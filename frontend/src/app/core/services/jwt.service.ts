import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { Role } from '../enums/Role';
import { User } from '../models/User';
import { AuthenticationRequest } from '../dtos/AuthenticationRequest';


@Injectable({
  providedIn: 'root'
})
export class JwtService {

  extractUsername(token: string): string {
    return this.extractClaim<string>(token, 'sub');
  }

  extractRole(token: string): Role {
    return this.extractClaim<Role>(token, 'role');
  }

  extractUser(token: string): User {
    return this.extractClaim<User>(token, 'user');
  }

  extractExpiration(token: string): Date {
    const expiration = this.extractClaim<number>(token, 'exp');
    return new Date(expiration * 1000);
  }

  private extractClaim<T>(token: string, claim: string): T {
    const decodedToken = jwt_decode.jwtDecode<any>(token);
    return decodedToken[claim];
  }

  isTokenExpired(token: string): boolean {
    const expiration = this.extractExpiration(token);
    return expiration < new Date();
  }

  validateToken(token: string, userDetails: AuthenticationRequest): boolean {
    const username = this.extractUsername(token);
    return username === userDetails.username && !this.isTokenExpired(token);
  }
}
