import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupervisorDto } from '../dtos/SupervisorDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {
  private apiUrl = `${environment.apiUser}api/supervisor`;

  constructor(private http: HttpClient) {}

  getAllSupervisors(): Observable<SupervisorDto[]> {
    return this.http.get<SupervisorDto[]>(`${this.apiUrl}/get-all-supervisors`);
  }

  getSupervisorById(id: string): Observable<SupervisorDto> {
    return this.http.get<SupervisorDto>(`${this.apiUrl}/get-supervisor-by-id/${id}`);
  }

  updateSupervisor(id: string, supervisorDto: SupervisorDto): Observable<SupervisorDto> {
    return this.http.put<SupervisorDto>(`${this.apiUrl}/update-supervisor/${id}`, supervisorDto);
  }

  deleteSupervisor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-supervisor/${id}`);
  }
}
