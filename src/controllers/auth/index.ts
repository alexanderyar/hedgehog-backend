import { ctrlWrapper } from "../../helpers/ctrlWrapper";

// import { userCurrent } from "./userCurrent";
import { userEmailVerification } from "./userEmailVerification";
// import { userLogin } from "./userLogin";
// import { userLogout } from "./userLogout";
import { userRegistration } from "./userRegistration";
import { userResendVerificationEmail } from "./userResendVerificationEmail";

// whule importing the object should be called somehow
export default {
  // userCurrent: ctrlWrapper(userCurrent),
  // userLogin: ctrlWrapper(userLogin),
  // userLogout: ctrlWrapper(userLogout),
  userRegistration: ctrlWrapper(userRegistration),
  userEmailVerification: ctrlWrapper(userEmailVerification),
  userResendVerificationEmail: ctrlWrapper(userResendVerificationEmail),
};
