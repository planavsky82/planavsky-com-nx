import { UserModel } from '@api-models/user';

export interface User extends UserModel {
  loggedIn: boolean;
}

export { UserRequest, UserResponse, UserAuth } from '@api-models/user';

export { Rankings } from '@api-models/ranking';
