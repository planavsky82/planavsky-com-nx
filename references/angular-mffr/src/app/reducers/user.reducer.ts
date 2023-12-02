import { User } from '../shared/models/user';

export function addUserReducer(state: User[] = [], action) {
  switch (action.type) {
    case 'ADD_USER':
      return [...state, action.payload];
    case 'LOGOUT':
      return [];
    default:
      return state;
    }
}
