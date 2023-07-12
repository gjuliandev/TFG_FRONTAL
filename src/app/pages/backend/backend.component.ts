import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/providers/websocket.service';

import * as moment from 'moment'
import 'moment/locale/es';
import { TurnosService } from 'src/app/providers/turnos.service';
import { ClientesService } from 'src/app/providers/clientes.service';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.css']
})
export class BackendComponent implements OnInit {

  turno: number = 0;
  dia: string = moment(new Date().toISOString()).format('YYYY-MM-DD');
  fechaTitulo: string = moment(new Date().toISOString()).format('LL');
  turnos: Array<any> = [];
  cliente: any = '';
  enEspera: number = 0;
  maxTurno: number = 0;
  constructor( public wsService: WebsocketService,
               private turnosService: TurnosService,
               private clientesService: ClientesService ) { }


  ngOnInit(): void {
    this.getTurnoActual();
    this.getTurnosByDia();
    // this.getClienteActual();
    this.getClientesEnEspera();

    this.wsService.escuchar('listado-turnos')
      .subscribe( (data: any) => {
        this.turnos = data;
        this.maxTurno =  Math.max(...this.turnos.map(o => o.numero), 0);
      });
      this.wsService.escuchar('en-espera')
      .subscribe( (data: any) => {
          this.enEspera = data;
        });
       
  }

  getTurnosByDia() {
    this.turnosService.getTurnosByFecha(this.dia)
      .subscribe( (resp: any) => {
        this.turnos = resp.payload;
        this.maxTurno =  Math.max(...this.turnos.map(o => o.numero), 0);
      });
  }

  getClienteActual() {
    this.clientesService.getClienteActual(this.dia)
    .subscribe( (resp: any) => {
      if (resp.payload[0].cliente) {
        this.cliente = resp.payload[0].cliente;
      } else {
        this.cliente = '--'
      }
      
    });
  }

  getClientesEnEspera() {
    this.clientesService.getClientesEnEspera(this.dia)
      .subscribe( (resp: any) => {
        this.enEspera = resp.payload[0].nClientes;
    });
  }

  getTurnoActual() {
    this.turnosService.getTurnoActual(this.dia)
      .subscribe( (resp:any) => {
        if (resp.payload[0].turno) {
          console.log(this.turno);
          this.turno = resp.payload[0].turno;
        } else {
          this.turno = 0;
        }
      });
  }

  subirTurno() {
    this.turno++;
    this.wsService.emitir('cambio-turno', this.turno);
    // actualizar la tabla turno actualizando la hora_llamada
    // this.wsService.emitir('turnos-updated', this.dia);
  }

  bajarTurno() {
    this.turno--;
    if (this.turno < 0) {
      this.wsService.emitir('cambio-turno', 0);
      // actualizar la tabla turno actualizando la hora_llamada
    } else {
      this.wsService.emitir('cambio-turno', this.turno);
      // actualizar la tabla turno actualizando la hora_llamada
    }
  }

  llamarTurno(e: any) {
    console.log('hemos llamadao por el altavoz', e);
    this.turno = e.numero;
    this.wsService.emitir('cambio-turno', e.numero);

    console.log( moment( new Date().toISOString() ).format('YYYY-MM-DD HH:mm:ss')); 

    this.turnosService.actualizarTurno (
      e.id, moment( new Date().toISOString() ).format('YYYY-MM-DD HH:mm:ss') 
      )
      .subscribe( (resp) => {
        this.wsService.emitir('turnos-updated', this.dia);
      });
  }

}
