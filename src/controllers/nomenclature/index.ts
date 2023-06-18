import {NextFunction, Request, Response} from "express";
import paginated from "../../decorators/paginated";
import Nomenclature from "../../entity/Nomenclature.enity";
import StockBalance from "../../entity/StockBalance.entity";
import StockRepository from "../../repositories/StockBalance.repo";
import Replacement from "../../entity/Replacement";
import Datasheet from "../../entity/Datasheet.entity";
import UserRoles from "../../enums/UserRoles";
import * as XLSX from "xlsx";
import Supplier from "../../entity/Suppliers.entity";
import ParsePathParams from "../../decorators/ParsePathParams";
import UseRole from "../../decorators/UseRole";

// export interface INew_data {
//   part_number: string | number;
// }

class NomenclatureController {
  @paginated<Nomenclature>({ entity: Nomenclature })
  async getAll(
    req: Request<
      null,
      null,
      null,
      {
        skip?: string;
        take?: string;
      }
    >,
    res: Response,
    next: NextFunction,
    findOptions?: {
      skip: number;
      take: number;
    }
  ) {

    const data = await StockRepository.getNomenclatures()


    return data;
  }

  async getAllRow(req:Request, res:Response, next:NextFunction) {
    let partFilter = '';
    if (req.query.partNumber) {
      // partFilter = {part_number:Like(`%${req.query.partNumber}%`)};
      partFilter = `"number" ILIKE '%${req.query.partNumber}%'`;
    }
    const data = await Nomenclature.getRepository().createQueryBuilder()
        .select()
        .where(partFilter)
        .getMany();

    res.send(data)
  }

  @paginated<StockBalance>({
    entity: StockBalance,
    countFunction: StockRepository.getGroupedCount.bind(StockRepository),
  })
  async getAvailable(
    req: Request<
      null,
      null,
      null,
      {
        skip?: string;
        take?: string;
        number?: string;
      }
    >,
    res: Response,
    next: NextFunction,
    findOptions: {
      skip: number;
      take: number;
      number?: string;
    }
  ) {
    const { skip, take, number } = findOptions;
    const data = await StockRepository.findGrouped({skip, take}, {findByPartNumber:number});
    return data;
  }

  @paginated<Replacement>({ entity: Replacement, skipCount: true })
  async getReplacement(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const data = await StockRepository.findGrouped(
          undefined,
          {findByReplacementId: id}
      );
      return data;
    } catch (e) {
      res.status(400);
      res.send({ message: "Wrong nomenclature id" });
    }
  }

  @ParsePathParams([{param: 'id', type: 'number'}])
  async getReplacementRow(
      req: Request<{ id: number }>,
      res: Response,
      next: NextFunction
  ) {
    const repl = await Replacement.find({
      where: {
        nomenclature_id: req.params.id
      },
      relations: ['replacement']
    })
    res.send(repl);
  }

  @UseRole(UserRoles.supply_manager)
  @ParsePathParams([{param: 'id', type: 'number'}])
  async addReplacement(
      req: Request<{ id: number }, {replacementId: number}>,
      res: Response,
      next: NextFunction
  ) {
    if (!req.body.replacementId || typeof req.body.replacementId !== "number") {
      res.status(400);
      res.send({message: 'Wrong replacement Id'});
      return
    }

    const replacement = Replacement.create({
      nomenclature_id: req.params.id,
      replacement_id: req.body.replacementId
    })

    try {
      await replacement.save()
      res.send(201);
    } catch (e: any) {
      // FIXME it should be enum or something like this.
      if (e.code === '23505') {
        res.sendStatus(409);
      }
    }
  }

  async getDatasheet(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const data = await Datasheet.findOne({ where: { nomenclature_id: id } });
      if (!data) {
        res.sendStatus(404);
        return;
      }

      res.setHeader("Content-Length", data.file_buffer.length);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");

      res.send(data.file_buffer);
    } catch (e) {
      res.status(400);
      res.send({ message: "Wrong nomenclature id" });
    }
  }

  async saveDatasheet(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);

      try {
        if (!req.files || !req.files.file) {
          res.status(400);
          res.send("No files to upload");
          return;
        }

        const data = await Datasheet.findOne({
          where: { nomenclature_id: id },
        });
        const file = req.files.file as any;

        if (file.mimetype !== "application/pdf") {
          res.status(400);
          res.send("Wrong file type");
          return;
        }
        if (data) {
          data.file_name = file.name;
          data.file = file.data;
          await data.save();
          res.sendStatus(200);
          return;
        }

        const datasheet = Datasheet.create({
          nomenclature_id: id,
          file_name: file.name,
          file: file.data,
        });

        await datasheet.save();
        res.sendStatus(201);
      } catch (e) {
        res.status(400);
        res.send({ message: "Wrong nomenclature id" });
      }
    } catch (e) {
      res.status(400);
      res.send({ message: "Wrong nomenclature id" });
    }
  }
  //////////////
  /////////////
  async parseNomenclature(req: Request, res: Response, next: NextFunction) {
    const role = req.user.role;
    if (role !== UserRoles.supply_manager) {
      res.status(401).send("access denied");
    }

    try {
      if (!req.files || !req.files.file) {
        res.status(400);
        res.send("No files to upload");
        return;
      }

      const file = req.files.file as any;

      if (
        file.mimetype !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.mimetype !== "application/vnd.ms-excel"
      ) {
        res.status(400);
        res.send("Wrong file type");
        return;
      }

      const workbook = await XLSX.read(file.data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming you want to extract values from the first sheet

      // Find the range of the worksheet
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      const startRow = range.s.r + 1; // Start from row 2
      const endRow = range.e.r; // Last row

      // Extract values from column A
      const values = [];
      for (let row = startRow; row <= endRow; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 }); // Column A
        const cellValue = worksheet[cellAddress]?.v; // Get the cell value
        if (cellValue) {
          values.push(cellValue);
        }
      }

      const new_data = values.map((value) => {
        return { part_number: value };
      });

      const queryBuilder = Nomenclature.createQueryBuilder()
        .insert()
        .orIgnore()
        .into(Nomenclature)
        .values(new_data);

      await queryBuilder.execute();

      res.status(201).send("success");
    } catch (e) {
      console.log(e);
      res.status(400);
      res.send({
        error: e,
        message: "something is wrong with the uploading new xls/xlsx",
      });
    }
  }
  /////////////
  ////////////
  async deleteStocksBySup(req: Request, res: Response, next: NextFunction) {
    const role = req.user.role;
    if (role !== UserRoles.supply_manager) {
      res.status(401).send("access denied");
    }
    const { sup_id } = req.params;
    console.log(sup_id);
    const manager_id = req.user.id;

    const data = await Supplier.findOne({
      where: { id: +sup_id },
    });
    if (!data) {
      res.status(404).send("sup not found");
      return;
    }
    if (data!.manager_id !== manager_id) {
      res.status(401).send("access denied");
    }
    await StockBalance.createQueryBuilder()
      .delete()
      .from(StockBalance)
      .where("supplier_id = :sup_id", { sup_id })
      .execute();

    res.status(204).send("successfully deleted");
  }

  @ParsePathParams([{param: 'id', type: 'number'}])
  async getById(req:Request<{
    id: number
  }>, res:Response, next:NextFunction) {
    const { id } = req.params;
    const noms = await StockRepository.getInfoById(id);
    if(noms.length === 0) {
      return res.sendStatus(404);
    }
    res.send(noms[0]);
  }

  @UseRole(UserRoles.supply_manager)
  @ParsePathParams([{param:'replacementId', type: 'number'}, {param: 'id', type: "number"}])
  async removeReplacement(req:Request<{
    id: number,
    replacementId: number
  }>, res:Response, next:NextFunction) {
    await Replacement.delete({
        nomenclature_id: req.params.id,
        replacement_id: req.params.replacementId
    })
    res.send(200);
  }
}

export default new NomenclatureController();
