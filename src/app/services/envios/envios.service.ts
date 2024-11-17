import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from '@angular/fire/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
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
        envioId: '',
      };

      const docRef = await addDoc(
        collection(this.firestore, 'envios'),
        envioData
      );
      await updateDoc(docRef, {
        envioId: docRef.id, // Aquí se guarda el envioId en el documento
      });
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

  async deleteShipping(envioId: string): Promise<void> {
    try {
      const envioRef = doc(this.firestore, `envios/${envioId}`);
      await deleteDoc(envioRef);
      console.log(`Envío con ID ${envioId} eliminado con éxito.`);
    } catch (error) {
      console.error('Error al eliminar el envío:', error);
      throw error;
    }
  }

  async updateShipping(envioId: string, updatedData: any): Promise<void> {
    try {
      const envioRef = doc(this.firestore, `envios/${envioId}`);
      await updateDoc(envioRef, updatedData);
      console.log(`Envío con ID ${envioId} actualizado con éxito.`);
    } catch (error) {
      console.error('Error al actualizar el envío:', error);
      throw error;
    }
  }

  // Convierte un Data URL a Blob
  private dataUrlToBlob(dataUrl: string): Blob {
    const [metadata, base64Data] = dataUrl.split(',');
    const contentType = metadata.match(/:(.*?);/)?.[1] || '';
    const binary = atob(base64Data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: contentType });
  }

  // Método para actualizar la imagen
  async actualizarImagen(dataUrl: string, filePath?: string): Promise<string> {
    try {
      const storage = getStorage();

      // Si se proporciona un filePath anterior, elimina la imagen existente
      if (filePath) {
        const oldImageRef = ref(storage, filePath);
        await deleteObject(oldImageRef).catch((error) => {
          console.warn('No se pudo eliminar la imagen anterior:', error);
        });
      }

      // Genera un nuevo nombre único para la imagen
      const newFilePath = `packages/${Date.now()}.jpg`;
      const storageRef = ref(storage, newFilePath);

      // Convierte el Data URL a Blob y sube la nueva imagen
      const photoBlob = this.dataUrlToBlob(dataUrl);
      await uploadBytes(storageRef, photoBlob);

      // Obtiene y devuelve la URL pública
      const photoURL = await getDownloadURL(storageRef);
      return photoURL;
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
      throw error;
    }
  }
}
