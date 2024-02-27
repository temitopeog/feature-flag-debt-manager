import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  // using localStorage. Feel free to replace with your JSON data storage
  // Create
  createRecord(key: string, data: any, ) {
    const records = this.getAllRecords(key);
    records.push(data);
    localStorage.setItem(key, JSON.stringify(records));
  }

  // Read
  getAllRecords(key: string): any[] {
    const recordsJson = localStorage.getItem(key);
    return recordsJson ? JSON.parse(recordsJson) : [];
  }

  // Update
  updateRecord(key: string, index: number, updatedData: any) {
    const records = this.getAllRecords(key);
    if (records[index]) {
      records[index] = updatedData;
      localStorage.setItem(key, JSON.stringify(records));
    }
  }

  // Delete
  deleteRecord(key: string, index: number) {
    const records = this.getAllRecords(key);
    if (records[index]) {
      records.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(records));
    }
  }
}
