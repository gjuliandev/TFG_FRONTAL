import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private http: HttpClient) { }

  getTurnosByFecha( dia: string ) {
    const url = `${environment.baseUrl}/api/turnos/turnos-list/${dia}`;
    return this.http.get(url);
  }

  getServicios() {
    const url = `${environment.baseUrl}/api/turnos/servicios`;
    return this.http.get(url);
  }

  getTurnoActual(dia: string) {
    const url = `${environment.baseUrl}/api/turnos/turno-actual/${dia}`;
    return this.http.get(url);
  }

  getSiguienteTurno(dia: string) {
    
    const url = `${environment.baseUrl}/api/turnos/siguiente-turno/${dia}`;
    return this.http.get(url);
  }

  crearNuevoTurno(clienteID: number) {
    const url = `${environment.baseUrl}/api/turnos`;
    return this.http.post(url, {clienteID});
  }

  addServiciosATurno(turno_id: number = 0, servicio_id: number = 0) {
    const url = `${environment.baseUrl}/api/turnos/servicio-turno`;
    return this.http.post(url, {turno_id, servicio_id});
  }

  actualizarTurno(numero: number, fecha: any) {
    const url = `${environment.baseUrl}/api/turnos`;
    return this.http.put(url, {numero, fecha} );
  }

}
