import { ctrlWrapper } from "../../helpers/ctrlWrapper";
import { clientsCreateOrder } from "../clients/clientsCreateOrder";
import { clientsAddInfo } from "../clients/clientsAddInfo";

export default {
  clientsCreateOrder: ctrlWrapper(clientsCreateOrder),
  clientsAddInfo: ctrlWrapper(clientsAddInfo),
};
