import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/enums/Role';
import { ProjectListComponent } from './shared/components/project-list/project-list.component';
import { MainComponent } from './features/dashboard/components/main/main.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
    canActivateChild: [roleGuard],
    data: [ Role.ADMIN, Role.CLIENT, Role.SUPERVISOR ],
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: MainComponent,
        canActivate: [roleGuard],
        data: [ Role.ADMIN, Role.CLIENT, Role.SUPERVISOR ]
      },
      {
        path: 'projects',
        component: ProjectListComponent,
        canActivate: [roleGuard],
        data: [ Role.ADMIN, Role.CLIENT, Role.SUPERVISOR ]
      }
    ]
  }

];

// @ts-ignore
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
