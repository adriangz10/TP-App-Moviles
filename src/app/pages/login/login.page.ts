import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import { IonicModule, NavController, ToastController} from '@ionic/angular';
import { Router, RouterLinkWithHref } from '@angular/router';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  providers: [AuthService],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterLinkWithHref]
})
export class LoginPage implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]), 
  })

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
    ){}


  ngOnInit() {
    console.log("ngOnInit")
  }

  async userToast() {
    const toast = await this.toastController.create({
      message: 'Incorrect email or password.',
      duration: 2000,
      position: 'top',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  async onSubmit(){
    const values = this.loginForm.value;

    await this.authService.loginWithEmailAndPassword(values);
    await this.router.navigate(['/home'], {replaceUrl: true});
  }
}
