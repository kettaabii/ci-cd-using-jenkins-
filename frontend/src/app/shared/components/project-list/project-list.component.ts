import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProjectService } from '../../../core/services/project.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/ngrx/app.state';
import { selectSearchTerm } from '../../../core/ngrx/search/search.selectors';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  totalProjects: number = 0;
  page: number = 0;
  size: number = 6;
  sortField: string = 'name';
  sortDirection: string = 'asc';
  geolocation: string | null = null;
  status: string | null = null;
  minBudget: number | null = null;
  maxBudget: number | null = null;
  dateStart: string | null = null;
  dateEnd: string | null = null;
  isFiltering: boolean = false;
  isSearching: boolean = false;

  searchTerm$: Observable<string>;

  constructor(private projectService: ProjectService, private store: Store<AppState>) {
    this.searchTerm$ = this.store.select(selectSearchTerm);
  }

  ngOnInit(): void {
    this.searchTerm$.subscribe(term => {
      if (term) {
        this.isSearching = true;
        this.isFiltering = false;
        this.searchProjects(term);
      } else {
        this.isSearching = false;
        this.getProjects();
      }
    });
  }

  getProjects(): void {
    if (!this.isFiltering && !this.isSearching) {
      this.projectService.getAllProjects(this.page, this.size, this.sortField, this.sortDirection).subscribe(
        (response: any) => {
          this.projects = response.content;
          this.totalProjects = response.totalElements;
        },
        (error) => {
          console.error('Error fetching projects', error);
        }
      );
    } else if (this.isFiltering) {
      this.filterProjects();
    }
  }

  filterProjects(): void {
    this.projectService.FilterProjects(
      this.geolocation,
      this.status,
      this.minBudget,
      this.maxBudget,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(
      (response: any) => {
        this.projects = response.content;
        this.totalProjects = response.totalElements;
      },
      (error) => {
        console.error('Error fetching filtered projects', error);
      }
    );
  }

  searchProjects(input: string): void {
    this.projectService.dynamicSearchProjects(input, this.page, this.size).subscribe(
      (response: any) => {
        this.projects = response.content;
        this.totalProjects = response.totalElements;
      },
      (error) => {
        console.error('Error searching projects', error);
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;

    if (this.isSearching) {
      this.searchTerm$.subscribe(term => {
        this.searchProjects(term);
      });
    } else if (this.isFiltering) {
      this.filterProjects();
    } else {
      this.getProjects();
    }
  }

  toggleSortField(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    if (this.isSearching) {
      this.searchTerm$.subscribe(term => {
        this.searchProjects(term);
      });
    } else if (this.isFiltering) {
      this.filterProjects();
    } else {
      this.getProjects();
    }
  }

  getSortIndicator(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  }

  applyFilters(): void {
    this.isFiltering = true;
    this.isSearching = false;
    this.filterProjects();
  }

  resetFilters(): void {
    this.geolocation = '';
    this.status = '';
    this.minBudget = null;
    this.maxBudget = null;
    this.dateStart = null;
    this.dateEnd = null;
    this.isFiltering = false;
    this.isSearching = false;
    this.getProjects();
  }

  onSortChange(sortField: string, sortDirection: string): void {
    this.sortField = sortField;
    this.sortDirection = sortDirection;
    this.getProjects();
  }
}
