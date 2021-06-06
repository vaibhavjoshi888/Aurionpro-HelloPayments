import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../../common/session/storage.service';
import {StorageType} from '../../../common/session/storage.enum';
import {AppSetting} from '../../../constant/appsetting.constant';

@Component({
  selector: 'secure-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [StorageService]
})
export class SecureHeaderComponent implements OnInit {
  isLoader: any;
  userName = '';
  loggedInUserData: any;
  truncateWordLength = AppSetting.truncateWordLength;

  constructor(private storageService: StorageService, private router: Router) {
  }

  ngOnInit() {
    this.loggedInUserData = JSON.parse(this.storageService.get(StorageType.session, 'userDetails'));
    this.userName = this.loggedInUserData.userName;
  }

  logOut() {
    try {
      this.isLoader = true;
      this.userName = '';
      this.storageService.remove(StorageType.session, 'userDetails');
      this.storageService.remove(StorageType.session, 'auth');
      this.storageService.remove(StorageType.session, 'roleDetails');
    } catch (Execption) {
      this.isLoader = false;
      this.userName = '';
      this.storageService.remove(StorageType.session, 'userDetails');
      this.storageService.remove(StorageType.session, 'auth');
      this.storageService.remove(StorageType.session, 'roleDetails');
    }
    this.router.navigate(['/login']);
  }

  onContactSupportClick() {
    this.router.navigate(['/contact-support']);
  }

}
