import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SlackService } from 'src/app/services/slack.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit  {
  message: string = '';

  constructor(private dataService: DataService, private slackService: SlackService, private router: Router) { }

  ngOnInit() {
    this.dataService.currentMessage.subscribe(message => this.message = message);
  }

  sendInfo(){
    let data = this.dataService.getAllRecords('records').filter(record => record.tag === this.message);
    // checker if the user has created a Split tag <--> Slack / Teams Channel integration
    // send information to slack channel
    if(data && data[0] && data[0].slack && data[0].slack.length > 0){
      this.slackService.sendMessage(data[0].slack, this.message).subscribe(
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
    } else {
      alert(`You need to configure ${data[0].tag} tag first!!!`)
      // Navigate to the config route
    this.router.navigate(['/config']);

    }

  }
}
