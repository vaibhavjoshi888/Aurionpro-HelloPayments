import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  color: any;

  constructor() { }

  ngOnInit() {
    this.color = 'antiquewhite';
  }

  getMyStyles() {
    const myStyles = {
       'background-color': this.color
    };
    return myStyles;
}

}
