import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-public-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class PublicHeaderComponent implements OnInit {
    constructor(private router: Router) { }
    ngOnInit() { }

    onContactSupportClick() {
      this.router.navigate(['/contact-support']);
    }
}
