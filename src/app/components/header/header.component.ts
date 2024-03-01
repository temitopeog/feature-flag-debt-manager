import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SlackService } from 'src/app/services/slack.service';
import { TeamsService } from 'src/app/services/teams.service';
import { Router } from '@angular/router';
import { featureFlag } from 'src/app/models/splitAPI.model';
import { SplitService } from 'src/app/services/split.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit  {
  message: string = '';

  constructor(private dataService: DataService, private splitService: SplitService,
    private slackService: SlackService, private router: Router, private teamsService: TeamsService) { }

  ngOnInit() {
    this.dataService.currentMessage.subscribe(message => this.message = message);
  }

  async sendInfo(){
    // Sample array of objects
    let data = this.dataService.getAllRecords('records').filter(record => record.tag === this.message);
    let selectedTag = localStorage.getItem('selectedTag');
    let parsedSelectedTag = selectedTag ? JSON.parse(selectedTag) : [];
    await this.addUserInfo(parsedSelectedTag, data);
  }

  addPropertyToObjects(data: any[]) {
    // Add a new property to each object
    data.forEach(obj => {
      // Loop through the inner array of each object
      obj.owners.forEach((item: any, i: number) => {
          // Check the condition (for example, if value > 20)
          if (item.type === "user") {
              // Add a new key-value pair to the object
              this.splitService.getUserInfo(item.id).pipe(take(1)).subscribe((res) => {
                obj.creator = res.name;
                this.dataService.updateRecord('selectedTag', i, obj);
              });
          }
          if (item.type === "group") {
            // Add a new key-value pair to the object
            this.splitService.getGroupInfo(item.id).pipe(take(1)).subscribe((res) => {
              obj.group = res.name;
              this.dataService.updateRecord('selectedTag', i, obj);
            });
        }
      });
    });
    return data;
  }

  async addUserInfo(newSelectedTag: any[], data: any){
    // Loop through the array of objects
    let persistedTag = await this.addPropertyToObjects(newSelectedTag);
    if(data && data[0] && data[0].slack && data[0].slack.length > 0 && persistedTag){
      console.log('SLACK WORKS SLACK WORKS SLACK WORKS', persistedTag)
      await this.sendToSlack(persistedTag, data[0].slack);
    } else if(data && data[0] && data[0].teams && data[0].teams.length > 0){
      console.log('TEAMS WORKS')
      await this.sendToTeams(data);
    } else {
      alert(`You need to configure ${data[0].tag} tag first!!!`)
      // Navigate to the config route
      this.router.navigate(['/config']);
    }
    // return arrayOfObjects;
  }

  sendToSlack(data: any, channel: string){
    this.slackService.sendMessage(data, channel).subscribe(
      (response) => {
        console.log('Message sent:', response);
      },
      error => {
        console.error('Error sending message:', error);
        // Handle error
      }
    );
  }
  sendToTeams(data: any){
    this.teamsService.sendMessage(data[0].teams, this.message).subscribe(
      (response) => {
        console.log('Message sent:', response);
        alert('Message sent to slack channel');
        // Reset input fields or handle success message
      },
      error => {
        console.error('Error sending message:', error);
        // Handle error
      }
    );
  }
}
