import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      getAuth().onAuthStateChanged(user => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(['/auth', 'signin']);
          resolve(false);
        }
      }
      );
    }
    );
  }
}
