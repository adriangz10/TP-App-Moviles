import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonLabel, IonItem, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvioService } from 'src/app/services/envios/envios.service';


@Component({
  selector: 'app-edit-shipping',
  templateUrl: './edit-shipping.page.html',
  styleUrls: ['./edit-shipping.page.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EditShippingPage implements OnInit {
  envioId: string | null = null; // ID del envío a editar
  envioData: any = {
    direccionOrigen: '',
    direccionDestino: '',
    descripcionPaquete: '',
    estado: ''
  };

  constructor(
    private shippingService: EnvioService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.envioId = this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la URL
    if (this.envioId) {
      await this.loadShippingData();
    }
  }

  // Cargar los datos del envío
  async loadShippingData() {
    try {
      const envios = await this.shippingService.getEnvios();
      const envio = envios.find((e) => e.id === this.envioId);
      if (envio) {
        this.envioData = { ...envio };
      } else {
        this.showToast('Envío no encontrado.');
      }
    } catch (error) {
      console.error('Error al cargar el envío:', error);
      this.showToast('Error al cargar el envío.');
    }
  }

  // Actualizar el envío
  async updateShipping() {
    if (!this.envioId) return;

    try {
      await this.shippingService.updateShipping(this.envioId, this.envioData);
      this.showToast('Envío actualizado con éxito.');
      this.router.navigate(['/']); // Navega a la página principal o lista de envíos
    } catch (error) {
      console.error('Error al actualizar el envío:', error);
      this.showToast('Error al actualizar el envío.');
    }
  }

  // Mostrar un mensaje de notificación
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }
}
