import { createReducer, on } from '@ngrx/store';
import { logout, setRole, setUser } from './auth.actions';
import { Role } from '../../enums/Role';
import { User } from '../../models/User';

export interface AuthState {
  role: Role | null;
  user: User | null;
}

export const initialState: AuthState = {
  role: null,
  user: null
};

export const authReducer = createReducer(
  initialState,
  on(setRole, (state, { role }) => ({
    ...state,
    role
  })),
  on(setUser, (state, { user }) => ({
    ...state,
    user
  })),
  on(logout, () => initialState),
);
