import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
  IonButton,
  IonInput,
  IonTextarea,
  IonItem,
  IonIcon,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvioService } from 'src/app/services/envios/envios.service';
import { addIcons } from 'ionicons';
import { arrowBack, camera } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-shipping',
  templateUrl: './edit-shipping.page.html',
  styleUrls: ['./edit-shipping.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonTextarea,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EditShippingPage implements OnInit {
  envioId: string | null = null;
  envioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private shippingService: EnvioService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ arrowBack, camera });
  }

  async ngOnInit() {
    this.envioId = this.route.snapshot.paramMap.get('id');

    this.envioForm = this.fb.group({
      direccionOrigen: ['', Validators.required],
      direccionDestino: ['', Validators.required],
      descripcionPaquete: ['', Validators.required],
      photoURL: [null],
    });

    if (this.envioId) {
      await this.getEnvioData(this.envioId);
    }
  }

  async getEnvioData(envioId: string): Promise<void> {
    try {
      const envios = await this.shippingService.getEnvios();
      const envio = envios.find((envio) => envio.envioId === envioId);

      if (envio) {
        console.log('Datos del Envío:', envio);
        this.envioForm.patchValue(envio);
      } else {
        console.log('Envío no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener los datos del envío:', error);
    }
  }

  async updateShipping() {
    if (this.envioForm.valid) {
      try {
        const updatedData = this.envioForm.value;
        await this.shippingService.updateShipping(this.envioId!, updatedData);
        this.showToast('Envío actualizado exitosamente');
        this.router.navigate(['/mis-envios']);
      } catch (error) {
        console.error('Error al actualizar el envío:', error);
        this.showToast('Error al actualizar el envío. Inténtalo de nuevo.');
      }
    } else {
      this.showToast('Por favor, completa todos los campos requeridos');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }

  async openImagePicker() {
    const alert = await this.alertController.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Cámara',
          handler: () => {
            this.captureImage(CameraSource.Camera);
          },
        },
        {
          text: 'Galería',
          handler: () => {
            this.captureImage(CameraSource.Photos);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Selección cancelada');
          },
        },
      ],
    });

    await alert.present();
  }

  async captureImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: source,
        quality: 100,
      });

      this.envioForm.patchValue({
        photoURL: image.dataUrl,
      });
    } catch (error) {
      console.error('Error al capturar la imagen:', error);
    }
  }
}
