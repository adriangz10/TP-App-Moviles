import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {Camera, CameraResultType} from "@capacitor/camera";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CameraPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async openCamera(){
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Uri
    })
  }

}
