import { Routes } from '@angular/router';
import {authGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'camera',
    loadComponent: () => import('./camera/camera.page').then( m => m.CameraPage)
  },
  {
    path: 'envios',
    loadComponent: () => import('./pages/envios/envios.page').then( m => m.EnviosPage)
  },
  {
    path: 'mis-envios',
    loadComponent: () => import('./pages/mis-envios/mis-envios.page').then( m => m.MisEnviosPage)
  },
  {
    path: 'edit-shipping/:id',
    loadComponent: () => import('./pages/edit-shipping/edit-shipping.page').then( m => m.EditShippingPage)
  },
];
