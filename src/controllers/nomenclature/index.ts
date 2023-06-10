import { NextFunction, Request, Response } from "express";
import paginated from "../../decorators/paginated";
import Nomenclature from "../../entity/Nomenclature.enity";
import StockBalance from "../../entity/StockBalance.entity";
import StockRepository from "../../repositories/StockBalance.repo";
import Replacement from "../../entity/Replacement";
import NomenclatureRepo from "../../repositories/Nomenclature.repo";
import Datasheet from "../../entity/Datasheet.entity";
import { UploadedFile } from "express-fileupload";
import { User } from "../../entity/User.entity";
import UserRoles from "../../enums/UserRoles";
import * as XLSX from "xlsx";
import Supplier from "../../entity/Suppliers.entity";
import AppDataSource from "../../dataSource";

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
    const data = await Nomenclature.find(findOptions);
    return data;
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
    const data = await StockRepository.findGrouped(
      { skip, take },
      { findByPartNumber: number }
    );
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
      const data = await StockRepository.findGrouped(undefined, {
        findByReplacementId: id,
      });
      return data;
    } catch (e) {
      res.status(400);
      res.send({ message: "Wrong nomenclature id" });
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
    const { supplier_id } = req.params;
    console.log(supplier_id);
    if (role !== UserRoles.supply_manager) {
      res.status(401).send("access denied");
    }
    const result = await Supplier.findOne({
      where: { id: +supplier_id, manager_id: req.user.id },
    });
    if (!result) {
      res.status(401).send("access denied. not enough rights");
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
      console.log(`  start - ${JSON.stringify(startRow)}`);
      console.log(`  end - ${JSON.stringify(endRow)}`);
      ///////////////////////// dummy data from front-end
      const dummy_data: { [key: string]: string } = {
        0: "part_number",
        1: "ignore",
        2: "balance",
        3: "manufacture_date",
      };
      //////////////////////////

      // Extract values from column A
      const values = [];

      /// for nomenclatures
      const part_numbers = [];

      // for non-validated
      const failed_rows: {}[] = [];

      for (let row = startRow; row <= endRow; row++) {
        const line: { [key: string]: string | string[] } = {}; /// object represents a single row in a table
        line.reasons = []; // reasons of failure

        for (let key in dummy_data) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: +key }); // Column N
          let cellValue = worksheet[cellAddress]?.v;

          const column_name = dummy_data[key]; // extracting value of each dummy_data

          if (column_name === " manufacture_date" && cellValue !== undefined) {
            const regex = /\d{2}/; // Regular expression to match the first two numeric symbols
            const match = regex.exec(cellValue);
            if (match) {
              const transformedDate = match[0] + "+";
              cellValue = transformedDate;
            }
          }

          line[column_name] = cellValue; // writing into (e.g.) line.part_number = NNNNNN

          if (column_name === "part_number") {
            part_numbers.push({ part_number: cellValue });
          }
        }

        // checking by part_number. If it is not there, I guess, the rest doesnt matter
        if (line.part_number === undefined) {
          continue;
        }

        // addding supplier_id;
        line.supplier_id = supplier_id;

        // FIXME !!!!! hardcoded nomenclature_id
        line.nomenclature_id = "1";

        // validation
        if (+line.balance < 0) {
          line.reasons.push("balance");
        }
        if (line.date === undefined) {
          line.reasons.push("manufacture_date");
        }
        if (line.reasons.length > 0) {
          failed_rows.push(line);
          continue;
        }

        values.push(line);
      }

      if (!values || !part_numbers) {
        res.status(400).send("parsing error");
      }

      console.log(`failed_rows - ${JSON.stringify(failed_rows)}`);
      console.log(`values - ${JSON.stringify(values)}`);
      ////////////////////////
      /////////////////////// plz leave it here for for a while
      // const workbook = await XLSX.read(file.data);
      // const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming you want to extract values from the first sheet
      // // Find the range of the worksheet
      // const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      // const startRow = range.s.r + 1; // Start from row 2
      // const endRow = range.e.r; // Last row
      // const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 }); // Column A
      // const cellValue = worksheet[cellAddress]?.v; // Get the cell value
      // if (cellValue) {
      //   values.push(cellValue);
      // }
      ////////////////////////

      // await StockBalance.createQueryBuilder()
      //   .delete()
      //   .from(StockBalance)
      //   .where("supplier_id = :supplier_id", { supplier_id })
      //   .execute();

      // const queryBuilderNom = Nomenclature.createQueryBuilder()
      //   .insert()
      //   .orIgnore()
      //   .into(Nomenclature)
      //   .values(part_numbers);

      // // await queryBuilderNom.execute();

      // const queryBuilder = StockBalance.createQueryBuilder()
      //   .insert()
      //   .into(StockBalance)
      //   .values(values);

      // // await queryBuilder.execute();

      // await AppDataSource.transaction(async (transactionalEntityManager) => {
      //   await queryBuilderNom.execute();
      //   await queryBuilder.execute();
      // });

      if (failed_rows.length > 0) {
        res.status(207).json({
          success: `everything but ${JSON.stringify(failed_rows.length)} row`,
          failure: failed_rows,
        });
        return;
      }

      res.status(201).send("sucessfully updated");
    } catch (e) {
      console.log(e);
      res.status(400);
      res.send({
        error: e,
        message: "something is wrong with the uploading new xls/xlsx",
      });
    }
  }
  ////////////////////////////////////

  ////////////////////////////////////
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
}

export default new NomenclatureController();
