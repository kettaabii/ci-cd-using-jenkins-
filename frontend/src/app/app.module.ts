import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthComponent } from './features/auth/auth.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { PasswordStrengthPipe } from './shared/pipes/password-strength.pipe';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './core/ngrx/app.state';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { SidebarComponent } from './features/dashboard/components/sidebar/sidebar.component';
import { NavbarComponent } from './features/dashboard/components/navbar/navbar.component';
import { MainComponent } from './features/dashboard/components/main/main.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BaseChartDirective } from 'ng2-charts';
import { ProjectLayoutComponent } from './shared/layouts/project-layout/project-layout.component';
import { ProjectListComponent } from './shared/components/project-list/project-list.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {searchReducer} from "./core/ngrx/search/search.reducer";


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    PasswordStrengthPipe,
    DashboardComponent,
    SidebarComponent,
    NavbarComponent,
    MainComponent,
    ProjectLayoutComponent,
    ProjectListComponent,
  ],
    imports: [
      StoreModule.forRoot({ search: searchReducer }),
        MatAutocompleteModule,
        MatPaginatorModule,
        MatMenuModule,
        MatProgressBarModule,
        FullCalendarModule,
        BaseChartDirective,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatListModule,
        MatCardModule,
        MatToolbarModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers}),
        MatProgressSpinner
    ],
  providers: [
    HttpClient,
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
