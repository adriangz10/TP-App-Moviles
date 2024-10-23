import {Injectable} from '@angular/core';
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import { Firestore, doc, updateDoc, setDoc, getDoc} from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore: Firestore) {
  }

  async registerWithEmail(params: { email: string, password: string }): Promise<any> {
    try {
      const result = await FirebaseAuthentication.createUserWithEmailAndPassword({
        email: params.email,
        password: params.password,
      });
      const user = result.user;
  
      if (!user) {
        throw new Error("No se pudo crear el usuario.");
      }
  
      const userDocRef = doc(this.firestore, `Users/${user.uid}`);
      console.log('USERDoc:', userDocRef);
      await setDoc(userDocRef, {
        UserEmail: user.email,
        UserName: user.displayName,
        PhoneNumber: user.phoneNumber,
        ProfileImageUrl:user.photoUrl,
        createdAt: new Date(),
        UserId: user.uid,
      });
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw error;
    }
  }

  async loginWithEmailAndPassword(params: { email: string, password: string }): Promise<any> {
    const result = await FirebaseAuthentication.signInWithEmailAndPassword({
      email: params.email,
      password: params.password,
    });
    return result.user;
  }

  async getLoggedInUser() {
    try {
      const { user } = await FirebaseAuthentication.getCurrentUser();
      if (!user) {
        throw new Error("No se encontró un usuario autenticado.");
      }
      const userId = user.uid;
      const userDocRef = doc(this.firestore, `Users/${userId}`);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("El documento del usuario no existe en Firestore.");
      }

      const userData = userDoc.data();
      return userData;

    } catch (error) {
      console.error('Error al obtener el usuario autenticado:', error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();
  }

  async updateName(params: { name: string}): Promise<void> {
    await FirebaseAuthentication.updateProfile({
      displayName: params.name
    })
    const { user } = await FirebaseAuthentication.getCurrentUser();
    if (!user) {
      throw new Error("No se encontró un usuario autenticado.");
    }
    const userId = user.uid;
    const userDocRef = doc(this.firestore, `Users/${userId}`);
    await updateDoc(userDocRef, {
      UserName: params.name,
    });
  }

  async uploadPhoneNumber(params: {phoneNumber: string}): Promise<void>{
    try {
      const { user } = await FirebaseAuthentication.getCurrentUser();
      if (!user) {
      throw new Error("No se encontró un usuario autenticado.");
    }
      const userId = user.uid;
      const userDocRef = doc(this.firestore, `Users/${userId}`);
      await updateDoc(userDocRef, {
        PhoneNumber: params.phoneNumber,
      });
    } catch (error) {
      console.error('Error al actualizar el número de teléfono en Firestore:', error);
    }
  }

  async uploadProfileImage(file: File): Promise<void> {
    try {
      const { user } = await FirebaseAuthentication.getCurrentUser();
      if (!user) {
        throw new Error("No se encontró un usuario autenticado.");
      }

      const storage = getStorage();
      const profileImageRef = ref(storage, `profileImages/${user.uid}.jpg`);
      await uploadBytes(profileImageRef, file);

      const downloadURL = await getDownloadURL(profileImageRef);
      user.photoUrl = downloadURL;

      const userDocRef = doc(this.firestore, `Users/${user.uid}`);
      await updateDoc(userDocRef, {
        ProfileImageUrl: downloadURL,
      });
    } catch (error) {
      console.error('Error al subir la imagen de perfil:', error);
      throw error;
    }
  }
}