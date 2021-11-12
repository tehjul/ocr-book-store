import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  createNewUser(email: string, password: string) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // signed in successfully
        const user = userCredential.user;
      })
      .catch(error => {
        return error.message;
      });
  }

  signInUser(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then(cred => {
        // signed in successfully
        const user = cred.user;
      })
      .catch(error => {
        return error.message;
      });
  }

  signOutUser() {
    const auth = getAuth();
    return signOut(auth).then(() => {
      // signed out successfully
    }
    ).catch(error => {
      return error.message;
    });
  }
}
