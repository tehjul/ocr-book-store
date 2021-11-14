import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Book } from '../models/book.model';
import { getDatabase, ref, set, onValue, DataSnapshot } from 'firebase/database';
import { getAuth } from '@firebase/auth';
import { getStorage, ref as refstore, uploadBytesResumable, getDownloadURL, deleteObject } from '@firebase/storage';
import { getApp } from '@firebase/app';

@Injectable({
  providedIn: 'root'
})

export class BooksService {

  books: Book[] = [];
  bookSubject = new Subject<Book[]>();

  constructor() {
    this.getBooks();
  }

  emitBooks() {
    this.bookSubject.next(this.books);
  }

  saveBooks() {
    const database = getDatabase();
    const thisUser = getAuth().currentUser.uid;
    set(ref(database, '/books/' + thisUser), this.books);
  }

  getBooks() {
    const database = getDatabase();
    const thisUser = getAuth().currentUser.uid;
    const books = ref(database, '/books/' + thisUser);
    onValue(books, (data: DataSnapshot) => {
      this.books = data.val() ? data.val() : [];
      this.emitBooks();
    }
    );
  }

  getSingleBook(id: number): any {
    return new Promise(
      (resolve, reject) => {
        const database = getDatabase();
        const thisUser = getAuth().currentUser.uid;
        const book = ref(database, '/books/' + thisUser + '/' + id);
        onValue(book, (data: DataSnapshot) => {
          resolve(data.val());
        },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    if (book.photo) {
      const storage = getStorage();
      const storageRef = refstore(storage, book.photo);
      deleteObject(storageRef).then(
        () => {
          console.log('Photo removed');
        },
        (error) => {
          console.log('Could not remove photo' + error);
        }
      );
    }

    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if (bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }


  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const storage = getStorage();
        const almostUniqueFileName = Date.now().toString();
        const thisUser = getAuth().currentUser.uid;
        const upload = refstore(storage, '/images/' + thisUser + '/' + almostUniqueFileName + file.name);
        const uploadTask = uploadBytesResumable(upload, file);
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            });
          }
        );
      }
    );
  }
}
