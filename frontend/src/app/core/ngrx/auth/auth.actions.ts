import { createAction, props } from '@ngrx/store';
import { User } from '../../models/User';
import { Role } from '../../enums/Role';

export const logout = createAction('[Auth] Logout');
export const setRole = createAction('[Auth] Set Role', props<{ role: Role }>());
export const setUser = createAction('[Auth] Set User', props<{ user: User }>());