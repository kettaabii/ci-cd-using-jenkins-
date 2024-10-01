import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectDto } from '../dtos/ProjectDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiProject}api/project`;

  constructor(private http: HttpClient) {}

  getAllProjects(page: number, size: number, sortField: string, sortDirection: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);

    return this.http.get(`${this.apiUrl}/get-all-projects`, { params });
  }

  FilterProjects(
    geolocation?: string | null,
    status?: string | null,
    minBudget?: number | null,
    maxBudget?: number | null,
    page: number = 0,
    size: number = 10,
    sortField: string = 'name',
    sortDirection: string = 'asc'
  ): Observable<any> {
    let params = new HttpParams();
    if (geolocation) params = params.append('geolocation', geolocation);
    if (status) params = params.append('status', status);
    if (minBudget) params = params.append('minBudget', minBudget.toString());
    if (maxBudget) params = params.append('maxBudget', maxBudget.toString());
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    params = params.append('sortField', sortField);
    params = params.append('sortDirection', sortDirection);

    return this.http.get(`${this.apiUrl}/filter`, { params });
  }

  dynamicSearchProjects(input: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('term', input)
      .set('page', page.toString())
      .set('size', size.toString())
      ;

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getAutocompleteSuggestions(term: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/autocomplete`, {
      params: new HttpParams().set('term', term)
    });
  }
  getProjectById(id: string): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.apiUrl}/get-project-by-id/${id}`);
  }

  createProject(projectDto: ProjectDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${this.apiUrl}/create-project`, projectDto);
  }

  updateProject(id: string, projectDto: ProjectDto): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.apiUrl}/update-project/${id}`, projectDto);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-project/${id}`);
  }
}
