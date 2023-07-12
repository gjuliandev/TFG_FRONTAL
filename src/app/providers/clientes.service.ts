import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  getClienteActual( dia: string ) {
    const url = `${environment.baseUrl}/api/clientes/cliente-actual/${dia}`;
    return this.http.get(url);
  }

  getClientesEnEspera(dia: string) {
    const url = `${environment.baseUrl}/api/turnos/clientes-espera/${dia}`;
    return this.http.get(url);
  }

  
}
