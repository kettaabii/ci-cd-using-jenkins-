import { createSelector } from '@ngrx/store';
import {AppState} from "../app.state";


export const selectSearchState = (state: AppState) => state.search;

export const selectSearchTerm = createSelector(
  selectSearchState,
  (state) => state.searchTerm
);
