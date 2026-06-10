import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/Auth/auth.service';
import { CryptoUtil } from '../../utils/crypto.util';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  showPassword = false;
  loginError = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);


  //validaciones 
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  goSignUp(){
    this.router.navigate(['/sign-up']); 
  }

  onSubmit() {
    this.loginError = false;
    if (this.loginForm.valid) {
      this.authService.Login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.status === true) {

            CryptoUtil.saveSession(response.value);
            this.router.navigate(['/dashboard']);
            console.log("login exitoso", response);
            //alert("Welcome");
          }

        },
        error: (err) => {
          console.error("error de autenficacion", err);
          this.loginError = true;
        }
      })
    }
  }
}
