import { Component, effect, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { home, settings, person, search, logOut} from 'ionicons/icons';
import { RouterLinkWithHref, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import {Camera, CameraResultType} from "@capacitor/camera";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  providers: [AuthService],
  imports: [ IonicModule, RouterLinkWithHref]
})
export class HomePage {
  
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    addIcons({ home, settings, person, search, logOut});
  }

  async logOut(){
    await this.authService.signOut();
    await this.router.navigate(["/login"], {replaceUrl: true})
  }

  irEnvios(){
    this.router.navigate(['/envios'], {replaceUrl: true})
  }

  async openCamara(){
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Uri
    })
  }
}

