import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { featureFlag } from '../models/splitAPI.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private dataService: DataService) {}

  // Service that connects with the backend API to send data to teams channel.
  sendMessage(text: featureFlag[], channel: string, wid: string): Observable<any> {
    let data = this.splitToTeamsConverter(text, wid);
    return this.http.post<any>(`${this.apiUrl}/send-teams-notification`, { data, channel });
  }

  // Resource to convert Split payload to the expected format by Teams Channel
  splitToTeamsConverter(jsonData: featureFlag[], wid: any){
    console.log("wid", wid);
    const transformedData = {
      type: "MessageCard",
      title: "Split IO Police 👮‍♂️",
      summary: "Hello there! This is a reminder to clean up / manage your feature flags \n",
      sections: jsonData.map((item, i) => ({
          startGroup: true,
          title: "\n **Flag that requires your immediate attention**",
          text: `- Flag ${i + 1} - ${item.name} \n - Status is: ${item.rolloutStatus.name} \n - In status for: ${this.dataService.calculateDiff(item.rolloutStatusTimestamp) + ' days'} \n - User : ${item.creator}`,
          potentialAction: [
            {
              "@type": "ActionCard",
              "name": "Confirm Task",
              "actions": [
                {
                  "@type": "HttpPOST",
                  "name": `Delete ${item.name} flag on Split`,
                  "target": `${environment.ngrok}/delete-flag`,
                  "body": `{ \"split_name\": ${item.name}, \"wid\": ${wid}}`,
                  "headers": [
                    { "name": "Authorization", "value": "" }
                  ],
                  "style": "positive"   // Green background for confirm button
                }
              ]
            }
          ]
      }))
   };
   return transformedData;
  }
}
