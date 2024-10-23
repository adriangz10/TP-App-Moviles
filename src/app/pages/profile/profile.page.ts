import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { home, settings, person } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  providers: [AuthService],
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref, ReactiveFormsModule]
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    currentPassword: new FormControl('', [Validators.required]),
  });
  currentUser: any = null;
  profileImage: string | ArrayBuffer | null = null;

  constructor(
    private authService: AuthService,
    private actionSheetController: ActionSheetController
  )
  {addIcons({ home, settings, person });}

  async ngOnInit() {
    this.currentUser = await this.authService.getLoggedInUser();
    console.log('aa', this.currentUser);
    this.profileForm.patchValue({ name: this.currentUser.UserName });
    this.profileForm.patchValue({ phoneNumber: this.currentUser.PhoneNumber });
    this.profileImage = this.currentUser.ProfileImageUrl; // Mostrar imagen de perfil si existe
  }

  async onSubmit() {
    const values = this.profileForm.value;
    await this.authService.updateName({ name: values.name });
    await this.authService.uploadPhoneNumber({ phoneNumber: values.phoneNumber });
  }

  async takePicture() {
    if (!this.actionSheetController) return;

    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Cámara',
          icon: 'camera',
          handler: () => {
            this.updateImage(CameraSource.Camera);
          },
        },
        {
          text: 'Álbum',
          icon: 'images',
          handler: () => {
            this.updateImage(CameraSource.Photos);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ],
    });
    await actionSheet.present();
  }

  async updateImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source,
    });

    if (image && image.dataUrl) {
      this.profileImage = image.dataUrl; // Mostrar la vista previa de la imagen
      this.uploadImage(image.dataUrl); // Subir la imagen
    }
  }

  async uploadImage(dataUrl: string) {
    const file = this.dataURLtoFile(dataUrl, 'profileImage.jpg');
    await this.authService.uploadProfileImage(file);
  }

  dataURLtoFile(dataUrl: string, filename: string): File {
    
    const arr = dataUrl.split(',');
  
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : ''; 
  
    const bstr = atob(arr[1]);
  
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  
}
