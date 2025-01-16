import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { PasswordToggleDirective } from '../../../../core/directives/password-toggle.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';

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
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    PasswordToggleDirective,
    MatProgressBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage: string | null = null;
  private subscription!: Subscription;

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
      .register({
        name: this.form.value.name!,
        email: this.form.value.email!,
        password: this.form.value.password!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
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
