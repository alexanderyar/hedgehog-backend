import { ctrlWrapper } from "../../helpers/ctrlWrapper";

import { serviceGetCountries } from "../service/serviceCountries";
import { serviceGetSuppliers } from "./serviceSuppliers";

export default {
  serviceGetCountries: ctrlWrapper(serviceGetCountries),
  serviceGetSuppliers: ctrlWrapper(serviceGetSuppliers),
};
