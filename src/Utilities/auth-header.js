import { authenticationService } from "../Services/authenticationService";

function authHeader() {
  const currentUser = authenticationService.currentUserValue;
  if (currentUser) {
    return {
      "Content-Type": "application/json",
      "Connection": "keep-alive"
    };
  } else {
    return {};
  }
}

export default authHeader;
