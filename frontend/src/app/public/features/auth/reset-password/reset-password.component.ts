import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { PasswordToggleDirective } from '../../../../core/directives/password-toggle.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';

function matchPassword(): ValidatorFn {
  return (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    }
    return { mismatch: true };
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PasswordToggleDirective,
    MatProgressBarModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  isLoading = false;
  token = '';
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  form = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          //Password must contain at least one uppercase letter, one lowercase letter and one number.
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          //Password must contain at least one uppercase letter, one lowercase letter and one number.
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        ],
      ],
    },
    {
      validators: matchPassword(),
    }
  );

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  submit() {
    this.isLoading = true;
    this.authService
      .resetPassword({
        token: this.token,
        password: this.form.value.password!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          if (err && err.error && err.error.message) {
            alert(err.error.message);
          }
          console.error(err);
          this.isLoading = false;
        },
      });
  }
}
