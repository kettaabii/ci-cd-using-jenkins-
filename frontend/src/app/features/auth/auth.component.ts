import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PasswordStrengthPipe } from '../../shared/pipes/password-strength.pipe';
import { AuthenticationRequest } from '../../core/dtos/AuthenticationRequest';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit{
  loginForm: FormGroup;
  hide = true;
  strengthClass = '';
  loginError: string | null = null;
  showSuccessAnimation: boolean = false;

  @ViewChild('loginContainer') loginContainer!: ElementRef;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.loginForm.get('password')?.valueChanges.subscribe(password => {
      this.strengthClass = new PasswordStrengthPipe().transform(password);
    });
  }

  ngOnInit() {
    this.setupErrorReset();
  }

  setupErrorReset() {
    this.loginForm.get('username')?.valueChanges.subscribe(() => {
      this.loginError = null;
    });
    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.loginError = null;
    });
  }

  onSubmit() {
    
    if (this.loginForm.valid) {
      const loginRequest: AuthenticationRequest = this.loginForm.value;
      this.authService.login(loginRequest).subscribe({
        next: () => {
          if (this.authService.isLoggedIn()) {
            this.loginContainer.nativeElement.classList.add('fade-out');
            this.showSuccessAnimation = true;
            setTimeout(() => {
              this.router.navigate(["/dashboard"])
            }, 1500);
          }
        },
        error: (error) => {
          console.error('Login error', error);
          this.loginError = error.message;
        }
      });
    }
  }
}
