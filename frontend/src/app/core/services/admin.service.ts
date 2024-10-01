import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDto } from '../dtos/AdminDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUser}api/admin`;

  constructor(private http: HttpClient) {}

  getAllAdmins(): Observable<AdminDto[]> {
    return this.http.get<AdminDto[]>(`${this.apiUrl}/get-all-admins`);
  }

  getAdminById(id: string): Observable<AdminDto> {
    return this.http.get<AdminDto>(`${this.apiUrl}/get-admin-by-id/${id}`);
  }

  updateAdmin(id: string, adminDto: AdminDto): Observable<AdminDto> {
    return this.http.put<AdminDto>(`${this.apiUrl}/update-admin/${id}`, adminDto);
  }

  deleteAdmin(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-admin/${id}`);
  }
}
