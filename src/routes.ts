import { UserController } from "./controller/UserController";
import { GroupController } from "./controller/GroupController";
import { AuthController } from "./controller/AuthController";
import { RefreshTokenController } from "./controller/RefreshTokenController";
import { UserRole } from "./entity/User";
import { LabController } from "./controller/LabController";

export const Routes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    //permissions: [UserRole.PROFESSOR]
  },
  {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
  },
  {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
  },
  {
    //withAuth: true,
    method: 'get',
    route: '/user-group-labs/:userId',
    controller: UserController,
    action: 'getUserGroupLabsList' 
  },
  {
    method: 'post',
    route: '/save-user-lab',
    controller: UserController,
    action: 'saveUserLab'
  },
  {
    method: 'get',
    route: '/get-user-lab/:userId/:labId',
    controller: UserController,
    action: 'getUserLab'
  },
  /** Auth Routes */
  {
    method: "post",
    route: '/login',
    controller: AuthController,
    action: 'login',
  },
  {
    method: "post",
    route: '/register',
    controller: AuthController,
    action: 'register',
  },
  /** Group Controller */
  {
    method: "get",
    route: "/groups",
    controller: GroupController,
    action: "listAll",
  },
  {
    method: "get",
    route: "/groups/:id",
    controller: GroupController,
    action: "findOne",
  },
  {
    method: "post",
    route: '/groups',
    controller: GroupController,
    action: 'createOne',
  },
  {
    method: "delete",
    route: '/groups',
    controller: GroupController,
    action: 'removeOne',
  },
  {
    method: "put",
    route: '/groups',
    controller: GroupController,
    action: 'updateOne',
  },
  {
    method: 'get',
    route: '/available-labs/:id',
    controller: GroupController,
    action: 'allAvailableLabs'
  },
  {
    method: 'delete',
    route: '/delete-group-lab/:groupId/:labId',
    controller: GroupController,
    action: 'deleteLab'
  },
  {
    method: 'delete',
    route: '/delete-group-user/:groupId/:userId',
    controller: GroupController,
    action: 'deleteUser',
    withAuth: true
  },
  {
    method: 'get',
    route: '/users-search/',
    controller: GroupController,
    action: 'searchUserToAdd',
    withAuth: true,
  },
  {
    method: "post",
    route: '/refresh_token',
    controller: RefreshTokenController,
    action: 'refresh',
  },
   /** Lab Controller */
  {
    method: "post",
    route: '/labs',
    controller: LabController,
    action: 'save',
    withAuth: true,
  },
  { 
    method: 'get',
    route: '/labs',
    controller: LabController,
    action: 'listAll',
    withAuth: true,
  },
];
