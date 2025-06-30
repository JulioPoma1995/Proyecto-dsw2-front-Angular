import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter ,withComponentInputBinding} from '@angular/router'; 
import { routes } from './app.routes'; 
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; 
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),  
    provideAnimations(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'proyecto-servicio-50409',
        appId: '1:611615218800:web:03fd9b1c8e286645d9e8b5',
        storageBucket: 'proyecto-servicio-50409.firebasestorage.app',
        apiKey: 'AIzaSyBa3CLaH_v3cZRVi3xKXuf7NOrw-UtO0VM',
        authDomain: 'proyecto-servicio-50409.firebaseapp.com',
        messagingSenderId: '611615218800',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};

