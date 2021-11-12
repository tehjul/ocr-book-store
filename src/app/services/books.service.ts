import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Book } from '../models/book.model';
import { getDatabase, ref, set, onValue, DataSnapshot } from 'firebase/database';

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
    set(ref(database, '/books/'), this.books).then(
      () => {
        console.log('Enregistrement terminé !');
      },
      (error) => {
        console.log('Erreur de sauvegarde : ' + error);
      }
    );
  }

  getBooks() {
    const database = getDatabase();
    onValue(ref(database, '/books'), (data: DataSnapshot) => {
      this.books = data.val() ? data.val() : [];
      this.emitBooks();
    }
    );
  }

  getSingleBook(id: number): any {
    const database = getDatabase();
    onValue(ref(database, '/books/' + id), (data: DataSnapshot) => {
      this.books = data.val() ? data.val() : [];
      this.emitBooks();
      return this.books;
    }
    );
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
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

}