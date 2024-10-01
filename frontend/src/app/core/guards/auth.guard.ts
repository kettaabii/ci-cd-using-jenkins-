import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const url: string = state.url;

  if (authService.isLoggedIn()) {
        return of(true);
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: url } });
    return of(false);
  }
};
