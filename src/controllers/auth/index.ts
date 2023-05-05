import { ctrlWrapper } from "../../helpers/ctrlWrapper";

import { userGetCurrent } from "./userGetCurrent";
import { userEmailVerification } from "./userEmailVerification";
import { userLogin } from "./userLogin";
import { userLogout } from "./userLogout";
import { userRegistration } from "./userRegistration";
import { userResendVerificationEmail } from "./userResendVerificationEmail";

// !! while importing the object should be called somehow
export default {
  userGetCurrent: ctrlWrapper(userGetCurrent),
  userLogin: ctrlWrapper(userLogin),
  userLogout: ctrlWrapper(userLogout),
  userRegistration: ctrlWrapper(userRegistration),
  userEmailVerification: ctrlWrapper(userEmailVerification),
  userResendVerificationEmail: ctrlWrapper(userResendVerificationEmail),
};
