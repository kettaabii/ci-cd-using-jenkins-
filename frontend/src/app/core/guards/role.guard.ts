import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChildFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../ngrx/app.state';
import { selectRole } from '../ngrx/auth/auth.selectors';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../enums/Role';

export const roleGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const store = inject(Store<AppState>);
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const url: string = state.url;
  const requiredRoles = route.data['roles'] as Role[] | undefined;

  if (authService.isLoggedIn()) {
    return store.select(selectRole).pipe(
      map(userRole => {
        if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
          router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: url } });
    return of(false);
  }
};
