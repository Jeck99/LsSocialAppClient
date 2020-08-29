import { User } from '../user';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    userId: any;
    constructor(private authService: AuthService) { }
    canGoToRoute(): boolean {
        return this.authService.getUserIdFromLocStor() ? true : false;
    }
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return this.canGoToRoute();
    }
}
