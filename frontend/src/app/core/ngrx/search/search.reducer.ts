import { createReducer, on } from '@ngrx/store';
import * as SearchActions from './search.actions';

export interface SearchState {
  searchTerm: string;
}
export const initialState: SearchState = {
  searchTerm: ''
};

export const searchReducer = createReducer(
  initialState,
  on(SearchActions.setSearchTerm, (state, { searchTerm }) => ({ ...state, searchTerm }))
);
