import { ctrlWrapper } from "../../helpers/ctrlWrapper";
import { getSupInfo } from "./getSupInfo";

export default {
  getSupInfo: ctrlWrapper(getSupInfo),
};
