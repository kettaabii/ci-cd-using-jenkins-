import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceDto } from '../dtos/ResourceDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = `${environment.apiResource}api/resource`;

  constructor(private http: HttpClient) {}

  createResource(resourceDto: ResourceDto): Observable<ResourceDto> {
    return this.http.post<ResourceDto>(`${this.apiUrl}/create-resource`, resourceDto);
  }

  getResourceById(id: number): Observable<ResourceDto> {
    return this.http.get<ResourceDto>(`${this.apiUrl}/get-resource-by-id/${id}`);
  }

  getAllResources(page: number, size: number, sortField: string, sortDirection: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);

    return this.http.get(`${this.apiUrl}/get-all-resources`, { params });
  }

  updateResource(id: number, resourceDto: ResourceDto): Observable<ResourceDto> {
    return this.http.put<ResourceDto>(`${this.apiUrl}/update-resource/${id}`, resourceDto);
  }

  deleteResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-resource/${id}`);
  }
}
