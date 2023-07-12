import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string = '';
  password: string = '';

  userForm: FormGroup;

  constructor(fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.userForm = fb.group({
      usuario: fb.control(''),
      password: fb.control('')
      });
   }

  ngOnInit(): void {
  }
  

  login(): void {
    console.log(this.userForm.value);
    this.authService.login(
      this.userForm.value.usuario, 
      this.userForm.value.password)
      .subscribe(  (resp: any) => {
        localStorage.setItem('tp-token', resp.token);
        this.router.navigate(["pages/home"]);
      }, (err) => console.log(err));
  }



}
