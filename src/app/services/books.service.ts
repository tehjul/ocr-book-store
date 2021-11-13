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
    set(ref(database, '/books'), this.books);
  }

  getBooks() {
    const database = getDatabase();
    const books = ref(database, '/books');
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
        const book = ref(database, '/books/' + id);
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