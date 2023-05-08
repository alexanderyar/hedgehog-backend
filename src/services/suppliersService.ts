import Supplier from "../entity/Supplier.entity";

export default async function getAllSuppliers():Promise<Supplier[]> {
    const allSuppliers = await Supplier.find()

    return allSuppliers;
}