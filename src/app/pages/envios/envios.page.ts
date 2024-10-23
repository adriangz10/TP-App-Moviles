import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { EnvioService } from 'src/app/services/envios/envios.service';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { home, camera, cube } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-envios',
  templateUrl: './envios.page.html',
  styleUrls: ['./envios.page.scss'],
  standalone: true,
  providers: [EnvioService],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLinkWithHref,
    ReactiveFormsModule,
  ],
})
export class EnviosPage implements OnInit {
  envioForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private envioService: EnvioService,
    private alertController: AlertController,
    private router: Router
  ) {addIcons({ home, camera, cube })}

  ngOnInit() {
    this.envioForm = new FormGroup({
      direccionOrigen: new FormControl('', Validators.required),
      direccionDestino: new FormControl('', Validators.required),
      descripcionPaquete: new FormControl('', Validators.required),
      estado: new FormControl('pendiente', Validators.required),
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  irMisEnvios(){
    this.router.navigate(['/mis-envios'], {replaceUrl: true})
  }

  async onSubmit() {
    if (this.envioForm.valid) {
      const envio = {
        direccionOrigen: this.envioForm.get('direccionOrigen')?.value,
        direccionDestino: this.envioForm.get('direccionDestino')?.value,
        descripcionPaquete: this.envioForm.get('descripcionPaquete')?.value,
        estado: this.envioForm.get('estado')?.value,
        photoFile: this.selectedFile || undefined
      };
  
      try {
        await this.envioService.crearEnvio(envio);
        console.log('Envío creado exitosamente!');
        this.envioForm.reset();
        this.selectedFile = null;
  
        await this.showConfirmationAlert();
  
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al crear el envío:', error);
      }
    }
  }

  async showConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Envío Creado',
      message: '¡El envío ha sido creado exitosamente!',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
