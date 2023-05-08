import { ctrlWrapper } from "../../helpers/ctrlWrapper";
import suppliersGetAll from "./suppliersGetAll";

export default {
    getAll: ctrlWrapper(suppliersGetAll),
    createSupplier: ()=> {},
}