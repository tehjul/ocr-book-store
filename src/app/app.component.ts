import { Component } from '@angular/core';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBIriwMl5676M8K-cWlNjxcXmN3gm1GgTg",
  authDomain: "ocr-book-store-4fb8c.firebaseapp.com",
  projectId: "ocr-book-store-4fb8c",
  storageBucket: "ocr-book-store-4fb8c.appspot.com",
  messagingSenderId: "470020294795",
  appId: "1:470020294795:web:6dfbd9f5a53da86e446c8e",
  measurementId: "G-B5G49KMPSX",
  dataBaseURL: "https://ocr-book-store-4fb8c-default-rtdb.europe-west1.firebasedatabase.app/"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ocr-book-store';

  constructor() {  }
}
