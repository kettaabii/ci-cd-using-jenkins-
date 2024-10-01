import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, distinctUntilChanged, Observable, Subject, takeUntil, tap} from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { User } from '../../../../core/models/User';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/ngrx/app.state';
import { ProjectService } from '../../../../core/services/project.service';
import { of } from 'rxjs';
import * as SearchActions from '../../../../core/ngrx/search/search.actions'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit , OnDestroy {
  user$ !: Observable<User | null>;
  searchForm: FormGroup;
  suggestions$ !: Observable<string[]>;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private projectService: ProjectService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit() {
    this.setupAutocomplete();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupAutocomplete() {
    this.searchForm.get('searchTerm')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      if (term) {
        this.projectService.getAutocompleteSuggestions(term).subscribe(
          suggestions => {
            this.suggestions$ = of(suggestions);
            this.isLoading = false;
          },
          error => {
            console.error('Error fetching suggestions', error);
            this.isLoading = false;
          }
        );
      } else {
        this.suggestions$ =of([]);
        this.isLoading = false;
      }
    });
  }

  onSuggestionSelected(suggestion: string) {
    this.searchForm.patchValue({ searchTerm: suggestion });
    this.triggerProjectListSearch(suggestion);
  }

  private triggerProjectListSearch(query: string) {
    this.store.dispatch(SearchActions.setSearchTerm({ searchTerm: query }));
  }



}
