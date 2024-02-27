import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SlackService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  sendMessage(channel: string, text: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/send-slack-notification`, { channel, text });
  }
}