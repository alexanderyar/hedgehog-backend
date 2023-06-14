import dataSource from "../dataSource";
import Supplier from "../entity/Suppliers.entity";

const SupplierRepo = dataSource.getRepository(Supplier).extend({
  async getFormattedIds(supply_manager_id: number) {
    const query = `SELECT formatted_id
FROM Suppliers
WHERE manager_id = $1`;
    return await this.query(query, [supply_manager_id]);
  },
});

export default SupplierRepo;
