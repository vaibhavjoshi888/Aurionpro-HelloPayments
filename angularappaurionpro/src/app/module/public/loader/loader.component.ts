import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],

})
export class LoaderComponent implements OnInit {
  hideLoader: any = false;
  constructor() {
  }
  ngOnInit() {
  }
}
