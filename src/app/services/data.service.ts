import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  private widSource = new BehaviorSubject<string>('');
  currentWid = this.widSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeWid(wid: string) {
    this.widSource.next(wid);
    localStorage.setItem("wid", JSON.stringify(wid));
  }

  // using localStorage. Feel free to replace with your JSON data storage
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

  // Convert EPOCH timestamp to local days/time format
  calculateDiff(dateSent: any){
    // Convert the timestamp to a Date object
  const timestamp1 = dateSent; // Milliseconds since epoch
  const date1 = new Date(timestamp1);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds between the two dates
  const differenceInMilliseconds = currentDate.getTime() - date1.getTime();

  // Convert milliseconds to days
  const millisecondsInADay = 1000 * 60 * 60 * 24; // 1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  const differenceInDays = Math.floor(differenceInMilliseconds / millisecondsInADay);

  return differenceInDays;
  }
}
