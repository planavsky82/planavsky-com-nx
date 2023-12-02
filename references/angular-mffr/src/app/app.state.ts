import { User } from './shared/models/user';

export interface AppState {
  readonly user: User[];
}
