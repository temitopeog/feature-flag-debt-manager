import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { featureFlag } from '../models/splitAPI.model';

@Injectable({
  providedIn: 'root'
})
export class SlackService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, public dataService: DataService) {}

  sendMessage(text: any[], channel: string): Observable<any> {
    let data = this.splitToSlackConverter(text);
    return this.http.post<any>(`${this.apiUrl}/send-slack-notification`, { data, channel });
  }

  splitToSlackConverter(jsonData: featureFlag[]){
    let transformedData: any = [
      {
          "type": "header",
          "text": {
              "type": "plain_text",
              "text": "Split IO Police"
          }
      },
      {
          "type": "context",
          "elements": [
              {
                  "type": "mrkdwn",
                  "text": "Hello there! This is a reminder to clean up / manage your feature flags"
              }
          ]
      },
      {
          "type": "section",
          "text": {
              "type": "mrkdwn",
              "text": ":wave:\n\n Below is the list of flags that requires your immediate attention."
          },
          "accessory": {
              "type": "image",
              "image_url": "https://media.giphy.com/media/bAQH7WXKqtIBrPs7sR/giphy.gif?cid=ecf05e47mqcqd2dnhxb3vr4ahr0jrlqh5op7n3gh689znkei&ep=v1_gifs_search&rid=giphy.gif&ct=g",
              "alt_text": ""
          }
      },
      {
          "type": "divider"
      }
    ];
    jsonData.forEach((item: featureFlag) => {
      let timestamp = this.dataService.calculateDiff(item.rolloutStatusTimestamp) + ' days';
      transformedData.push(
        {
            "type": "rich_text",
            "elements": [
                {
                    "type": "rich_text_section",
                    "elements": [
                        {
                            "type": "emoji",
                            "name": "man"
                        },
                        {
                            "type": "text",
                            "text": (item.creator) ? item.creator : (item.group) ? item.group : "no name",
                            "style": {
                                "bold": true
                            }
                        }
                    ]
                },
                {
                    "type": "rich_text_list",
                    "style": "bullet",
                    "elements": [
                        {
                            "type": "rich_text_section",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": item.name
                                }
                            ]
                        },
                        {
                            "type": "rich_text_section",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": `Status is: ${item.rolloutStatus.name}`
                                }
                            ]
                        },
                        {
                            "type": "rich_text_section",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": `In status for: ${timestamp}`
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "divider"
    });
    });
    return transformedData;
    }
}
