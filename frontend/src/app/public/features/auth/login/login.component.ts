import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { PasswordToggleDirective } from '../../../shared/directives/password-toggle.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    PasswordToggleDirective,
    MatProgressBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage: string | null = null;
  private subscription!: Subscription;

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngOnInit() {
    this.subscription = this.form.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  submit() {
    this.isLoading = true;
    this.errorMessage = null;
    this.authService
      .login({
        email: this.form.value.email!,
        password: this.form.value.password!,
      })
      .subscribe({
        next: () => {
          console.log('logged in');
          this.router.navigate(['/']);
        },
        error: (err) => {
          // if (err && err.error && err.error.message) {
          //   alert(err.error.message);
          // }
          console.error(err);
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          }
          this.isLoading = false;
        },
      });
  }
}
