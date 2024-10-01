import { Component } from '@angular/core';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  url!: string;

  constructor(private authService: AuthenticationService, private router: Router) {
    this.url = this.router.url;
  }

  onLogout(): void {
    console.log('loogoout');
    
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.url } });
  }
}
