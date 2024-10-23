import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonList,
  IonIcon,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { EnvioService } from 'src/app/services/envios/envios.service';
import {
  arrowBack,
  cube,
  location,
  documentText,
  flash,
  trash,
  create,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-envios',
  templateUrl: './mis-envios.page.html',
  styleUrls: ['./mis-envios.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonButton,
    IonIcon,
    IonCol,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonRow,
    IonList,
  ],
})
export class MisEnviosPage implements OnInit {
  envios: any[] = [];

  constructor(private envioService: EnvioService, private router: Router) {
    addIcons({ arrowBack, cube, location, documentText, flash, trash, create });
  }

  ngOnInit() {
    this.obtenerEnvios();
  }

  irEnvios() {
    this.router.navigate(['/envios'], { replaceUrl: true });
  }

  async obtenerEnvios(): Promise<void> {
    try {
      const idUserRegis = await this.envioService.getIdUser();
      this.envios = await this.envioService.getEnvios();
      const enviosFiltrados = this.envios.filter((envio) => {
        return envio.userId === idUserRegis;
      });
      this.envios = enviosFiltrados;
    } catch (error) {
      console.error('Error al obtener los envíos:', error);
    }
  }
}
