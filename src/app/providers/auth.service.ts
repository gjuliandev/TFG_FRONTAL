import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(usuario: string = '', password: string = '') {

    const credentials = {
      login: usuario,
      password: password
    };

   
    const url = `${environment.baseUrl}/api/users/login`;
    return this.http.post(url,{credentials} );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('tp-token');
    console.log(token);
    if (localStorage.getItem('tp-token')) {
      return true;
    } else {
      return false;
    }
  }

}
