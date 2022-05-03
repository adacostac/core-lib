import { HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';

export function ErrorCatchingFactory(oidcSecurityService: OidcSecurityService) {
    return new ErrorCatchingInterceptor(oidcSecurityService)
}

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private oidcSecurityService: OidcSecurityService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {

        return next.handle(req).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                    console.log('ERROR 401')
                    //return this.handle401Error(req, next);
                } else if (error.status === 403) {
                    console.log('ERROR 403')
                    this.oidcSecurityService.logoff();
                    //this.eventBusService.emit(new EventData('logout', null));
                }
            }

            return throwError(error);
        }));
    }

    /* private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const token = this.token.getRefreshToken();

            if (token)
                return this.authService.refreshToken(token).pipe(
                    switchMap((token: any) => {
                        this.isRefreshing = false;

                        this.token.saveToken(token.accessToken);
                        this.refreshTokenSubject.next(token.accessToken);

                        return next.handle(this.addTokenHeader(request, token.accessToken));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;

                        this.token.signOut();
                        return throwError(err);
                    })
                );
        }

        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token)))
        );
    } */

    /* private addTokenHeader(request: HttpRequest<any>, token: string) {
        if (this.tokenHeaderKey) {
            return request.clone({ headers: request.headers.set(this.tokenHeaderKey, token) });
        } else {
            let headers: HttpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
            return request.clone({ headers: headers });
        }
    } */
}