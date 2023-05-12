import { ctrlWrapper } from "../../helpers/ctrlWrapper";

import { serviceGetCountries } from "../service/serviceCountries";

export default {
  serviceGetCountries: ctrlWrapper(serviceGetCountries),
};
