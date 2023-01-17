import { UnauthenticatedError } from "../errors/index.js";
const checkPermission = (requestUser, resourceUserId) => {
  //requestUser: user ycau edit/delete...
  //resourceUser: created by cua job

  // if(request.role === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError("You dont have permisstion to do this");
};
export default checkPermission;
