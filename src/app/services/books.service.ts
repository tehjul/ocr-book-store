import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Book } from '../models/book.model';
import { getDatabase, ref, set } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})

export class BooksService {

  books: Book[] = [];
  bookSubject = new Subject<Book[]>();

  constructor() { }

  emitBooks() {
    this.bookSubject.next(this.books);
  }

  saveBooks() {
    const database = getDatabase();
    set(ref(database, 'books'), this.books);
  }
}