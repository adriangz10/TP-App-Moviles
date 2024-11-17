import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  IonButtons, IonItem, IonLabel, IonSpinner } from '@ionic/angular/standalone';
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
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mis-envios',
  templateUrl: './mis-envios.page.html',
  styleUrls: ['./mis-envios.page.scss'],
  standalone: true,
  imports: [ 
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class MisEnviosPage implements OnInit {
  envios: any[] = [];
  envioId: string | null = null;

  constructor(private envioService: EnvioService, private router: Router, private alertController: AlertController, private toastController: ToastController) {
    addIcons({ arrowBack, cube, location, documentText, flash, trash, create });
  }

  ngOnInit() {
    this.obtenerEnvios();
  }

  irEnvios() {
    this.router.navigate(['/envios'], { replaceUrl: true });
  }

  irEditEnvios(id: string): void {
    this.router.navigate([`/edit-shipping/${id}`], { replaceUrl: true });
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

  async onDeleteShipping() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este envío?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            if (this.envioId) {
              try {
                await this.envioService.deleteShipping(this.envioId);
                this.showToast('Envío eliminado con éxito.');
              } catch (error) {
                this.showToast('Error al eliminar el envío.');
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }
}
