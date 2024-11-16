import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { firebaseConfig } from './environments/firebase-config';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { Keyboard } from '@capacitor/keyboard';  // Importa el plugin del teclado

// Configura el comportamiento del teclado
Keyboard.getResizeMode()  // Esto evita que el teclado mueva la vista

// Inicializa la aplicación
bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
}).catch(err => console.error(err));
