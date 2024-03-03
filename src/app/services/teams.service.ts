import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { featureFlag } from '../models/splitAPI.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private dataService: DataService) {}

  sendMessage(text: featureFlag[], channel: string): Observable<any> {
    let data = this.splitToTeamsConverter(text);
    return this.http.post<any>(`${this.apiUrl}/send-teams-notification`, { data, channel });
  }
//
  splitToTeamsConverter(jsonData: featureFlag[]){
    const transformedData = {
      type: "MessageCard",
      title: "Split IO Police 👮‍♂️",
      summary: "Hello there! This is a reminder to clean up / manage your feature flags \n",
      sections: jsonData.map((item, i) => ({
          startGroup: true,
          title: "\n **Flag that requires your immediate attention**",
          text: `- Flag ${i + 1} - ${item.name} \n - Status is: ${item.rolloutStatus.name} \n - In status for: ${this.dataService.calculateDiff(item.rolloutStatusTimestamp) + ' days'} \n - User : ${item.creator}`
      }))
   };
   return transformedData;
  }
}
