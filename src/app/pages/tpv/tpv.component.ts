import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TurnosService } from 'src/app/providers/turnos.service';
import { WebsocketService } from 'src/app/providers/websocket.service';
import Swal from 'sweetalert2';
import * as moment from 'moment'
import 'moment/locale/es';

@Component({
  selector: 'app-tpv',
  templateUrl: './tpv.component.html',
  styleUrls: ['./tpv.component.css']
})
export class TpvComponent implements OnInit {

  paso: number = 0;
  servicios: Array<any> = [];
  turnoActual: number = 0;
  siguienteTurno: number = 0;
  dia: string = moment(new Date().toISOString()).format('YYYY-MM-DD');
  nServiciosSeleccionados = 0;

  constructor( private turnosService: TurnosService, 
               protected sanitizer: DomSanitizer,
               public wsService: WebsocketService) {
                  
                }

  ngOnInit(): void {
    this.getTurnoActual();
    this.getSiguienteTurno();

    // Subscripción para el turno que se está atendiento
    this.wsService.escuchar('nuevo-turno')
      .subscribe( (turno: any) => {
        this.turnoActual = turno;
      });

    // Subscripción siguiente turno a recibir
    this.wsService.escuchar('siguiente-turno')
    .subscribe( (turno: any) => {
      this.siguienteTurno = turno;
    });

    this.getServicios();
  }

  getTurnoActual() {
    this.turnosService.getTurnoActual(this.dia)
      .subscribe( (resp: any) => {
        
        if (resp.payload[0].turno) {
          this.turnoActual = resp.payload[0].turno;
        } else {
          this.turnoActual = this.turnoActual + 0;
        }
        
      });
  }

  getSiguienteTurno() {
    console.log('vamos a por el siguiente turno');
    this.turnosService.getSiguienteTurno(this.dia)
    .subscribe( (resp: any) => {
      if (resp.payload[0].turno) {
        console.log('HEMOS RECIBIDO ' + resp);
        this.siguienteTurno = resp.payload[0].turno;
      } else {
        console.log('no hemos recibido nada' + JSON.stringify(resp));
        this.siguienteTurno = 1;
      }
      
    });
  }

  getServicios() {
    this.turnosService.getServicios()
      .subscribe( (resp: any) => {
          this.servicios = resp.payload;
      });
  }

  next() {
    if (this.paso === 1) {
      if (this.nServiciosSeleccionados <= 0) {
        Swal.fire({
          title: '<strong>Tarifa Plana <u>Peluqueros</u></strong>',
          icon: 'warning',
          html:
            'Debe indicar al menos un servicio a realizar.',
          timer: 3000,   
        }); 
      } else {
        this.paso++
  
        setTimeout( () => {
          this.paso=0;
        }, 5000)
      }
    } else {
      this.paso++;
    }
  }

  previous() {
    this.paso--;
  }

  async checkService(e: any, idx: number) {
    this.servicios[idx].seleccionado = !this.servicios[idx].seleccionado;
    this.nServiciosSeleccionados = await this.servicios.filter( x => x.seleccionado === true).length;
  }

  async addTurno() {
     this.turnosService.crearNuevoTurno(125)
      .subscribe( async (resp: any) => {
    
        let turno_inserted = resp.payload.insertId;
          await this.addTurnoServicio(turno_inserted);
    
          this.getSiguienteTurno();
          
      });
      
      

  } 

  async addTurnoServicio(turno_id: number = 0) {
    this.servicios.map( async (x:any) => {
      if (x.seleccionado == true) {
        this.turnosService.addServiciosATurno(turno_id, x.id)
          .subscribe( s => {
            x.seleccionado = false;
            this.nServiciosSeleccionados = this.servicios.filter( x => x.seleccionado === true).length;
          });
      }
    });
  }

 async imprimir_ticket() {
    await this.addTurno();

    setTimeout( () => {
      this.wsService.emitir('turnos-updated', this.dia);
    }, 1000);
    
    this.paso = 0;  

    Swal.fire({
      title: '<strong>Tarifa Plana <u>Peluqueros</u></strong>',
      icon: 'success',
      html:
        '¡Gracias por confiar en nosotros!',
      timer: 3000,   
    
    }); 
         
 }
}


