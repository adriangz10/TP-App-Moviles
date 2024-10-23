import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import { IonLabel, IonItem, NavController} from '@ionic/angular/standalone';
import { IonicModule} from '@ionic/angular';
import { Router, RouterLinkWithHref } from '@angular/router';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  providers: [AuthService],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonLabel, IonItem, IonicModule, RouterLinkWithHref]
})

export class SignupPage implements OnInit {

  loading = false;
  singupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]), 
  })

  constructor(
    private router: Router,
    private authService: AuthService,
    )
    {}

  ngOnInit() {
    console.log("ngOnInit")
  }

  async onSubmit() {
    this.loading = true;
    const values = this.singupForm.value

    try {
      const loginUser = await this.authService.registerWithEmail(values);
      this.loading = false;
      // await this.presentToast({message: 'Usuario creado con exito', color: 'success'});
      await this.router.navigate(['/login'], {replaceUrl: true});
    } catch (e) {
      // await this.presentToast({message: 'Error al crear el usuario', color: 'danger'});
    }
  }
}
