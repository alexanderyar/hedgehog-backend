import dataSource from "../dataSource";
import Supplier from "../entity/Suppliers.entity";
import UserRoles from "../enums/UserRoles";

const SupplierRepo = dataSource.getRepository(Supplier).extend({
  async getFormattedIds(supply_manager_id: number, userRole: UserRoles | string = '') {
    const query = `SELECT formatted_id
FROM Suppliers
WHERE manager_id = $1 or $2`;
    return await this.query(query, [supply_manager_id, userRole === UserRoles.admin]);
  },
});

export default SupplierRepo;
