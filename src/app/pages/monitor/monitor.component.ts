import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

import * as moment from 'moment'
import 'moment/locale/es';

import { WebsocketService } from 'src/app/providers/websocket.service';
import { TurnosService } from 'src/app/providers/turnos.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  fecha: any;
  hora: any;
  turno: number = 0;
  dia: any;
  
  constructor( public wsService: WebsocketService, 
               private turnosService: TurnosService ) { 
      this.dia = moment(new Date().toISOString()).format('YYYY-MM-DD');
      this.fecha = moment(new Date().toISOString()).format('LL');
      this.hora = moment(new Date().toISOString()).format('LTS');
  }

  ngOnInit(): void {

   
    this.getTurnoActual();
    this.arrancarReloj();

    // Subscripción al nuevo turno
    this.wsService.escuchar( 'nuevo-turno')
      .subscribe( (resp: any) => {
        this.turno = resp;
      });
  }

  getTurnoActual(){
    this.turnosService.getTurnoActual(this.dia)
    .subscribe( (resp:any) => {
      if (resp.payload[0].turno) {
        this.turno = resp.payload[0].turno;
      } else {
        this.turno = 0;
      }
     
    })
  }

  arrancarReloj() {
    //emit value in sequence every 1 second
    const source = interval(1000);

    const subscribe = source.subscribe( val => {
      this.fecha = moment(new Date().toISOString()).format('LL');
      this.hora = moment(new Date().toISOString()).format('LTS');
    });
  }
}
