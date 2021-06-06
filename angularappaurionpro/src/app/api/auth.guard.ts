import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {StorageService} from '../common/session/storage.service';
import {StorageType} from '../common/session/storage.enum';


@Injectable()
export class AuthGuard implements CanActivate {
  user: any;

  constructor(private router: Router, private storageService: StorageService) {
  }

  canActivate() {
    // if (this.storageService.get(StorageType.session, 'userDetails')) {
    if (this.storageService.get(StorageType.session, 'auth')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  getToken() {
    if (this.storageService.get(StorageType.session, 'auth')) {
      this.user = JSON.parse(this.storageService.get(StorageType.session, 'auth'));
      if (this.user && this.user.token) {
        return this.user.token;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}
