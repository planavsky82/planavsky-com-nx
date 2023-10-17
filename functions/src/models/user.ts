import { Rankings } from './ranking';

export interface UserModel {
  name: string;
  pwd: string;
  admin: boolean;
  email: string;
  rankings?: Rankings[];
}

export interface UserRequest {
  name: string;
  pwd: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
}

export interface UserAuth {
  success: boolean;
  message: string;
  token: string;
  id: string;
  match: boolean;
  rankings: Rankings[];
}
