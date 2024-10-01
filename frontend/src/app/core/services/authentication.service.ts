import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationRequest } from '../dtos/AuthenticationRequest';
import { AuthenticationResponse } from '../dtos/AuthenticationResponse';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AdminDto } from '../dtos/AdminDto';
import { ClientDto } from '../dtos/ClientDto';
import { SupervisorDto } from '../dtos/SupervisorDto';
import { Role } from '../enums/Role';
import { User } from '../models/User';
import { AppState } from '../ngrx/app.state';
import { logout, setRole, setUser } from '../ngrx/auth/auth.actions';
import { JwtService } from './jwt.service';
import { Store } from '@ngrx/store';
import { LoginException } from '../exceptions/login.exception';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = `${environment.apiUser}api/auth`;

  constructor(private http: HttpClient, private store: Store<AppState>, private jwtService: JwtService) {}

  login(authRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/login`, authRequest).pipe(
      map(response => {
        const authResponse: AuthenticationResponse = response;
        if (authResponse.token && this.jwtService.validateToken(authResponse.token, authRequest)) {

          localStorage.setItem("auth-token", authResponse.token)

          return authResponse;
        } else {
          throw LoginException.authenticationFailed();
        }
      }),
      catchError(error => {
        if (error.status === 401) {
          return throwError(() =>
            LoginException.invalidCredentials() ||
            LoginException.authenticationFailed()
          );
        }
        return throwError(() => error.message || 'Failed to login');
      })
    );
  }

  registerAdmin(adminDto: AdminDto): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/register/admin`, adminDto);
  }

  registerClient(clientDto: ClientDto): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/register/client`, clientDto);
  }

  registerSupervisor(supervisorDto: SupervisorDto): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/register/supervisor`, supervisorDto);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem("auth-token");

    if (token && !this.jwtService.isTokenExpired(token)) {
      const role: Role = this.jwtService.extractRole(token);
      const user: User = this.jwtService.extractUser(token);
      this.store.dispatch(setRole({ role }));
      this.store.dispatch(setUser({ user }));
      return true;
    } else {
      this.logout()
      return false;
    }
  }

  logout() {
    localStorage.removeItem("auth-token")
    this.store.dispatch(logout());
  }
}
