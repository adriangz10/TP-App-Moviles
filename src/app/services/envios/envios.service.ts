import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
} from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root',
})
export class EnvioService {
  constructor(private firestore: Firestore) {}

  async getEnvios(): Promise<any[]> {
    try {
      const enviosSnapshot = await getDocs(
        collection(this.firestore, 'envios')
      );
      return enviosSnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error('Error al obtener los envíos:', error);
      throw error;
    }
  }

  async crearEnvio(envio: {
    direccionOrigen: string;
    direccionDestino: string;
    descripcionPaquete: string;
    estado: string;
    photoFile?: File;
  }): Promise<void> {
    try {
      let photoURL = null;
      if (envio.photoFile) {
        const storage = getStorage();
        const filePath = `packages/${Date.now()}_${envio.photoFile.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, envio.photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      const { user } = await FirebaseAuthentication.getCurrentUser();
      if (!user) {
        throw new Error('No se encontró un usuario autenticado.');
      }

      const envioData = {
        direccionOrigen: envio.direccionOrigen,
        direccionDestino: envio.direccionDestino,
        descripcionPaquete: envio.descripcionPaquete,
        estado: envio.estado,
        photoURL: photoURL,
        createdAt: new Date(),
        userId: user.uid,
      };

      await addDoc(collection(this.firestore, 'envios'), envioData);
      console.log('Envío creado exitosamente!');
    } catch (error) {
      console.error('Error al crear el envío:', error);
      throw error;
    }
  }

  async getIdUser() {
    const { user } = await FirebaseAuthentication.getCurrentUser();
    if (!user) {
      throw new Error('No se encontró un usuario autenticado.');
    }
    return user.uid;
  }
}