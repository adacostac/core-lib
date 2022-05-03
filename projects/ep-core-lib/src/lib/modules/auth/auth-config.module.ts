import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AuthInterceptor, AuthModule, LogLevel, OidcConfigService } from 'angular-auth-oidc-client';

import { ErrorCatchingInterceptor } from '../../helpers/error-catching.interceptor';
import { OidcConfig } from '../../tokens/tokens';

export function configureAuth(oidcConfigService: OidcConfigService, OidcConfig: any): () => Promise<any> {
    return () =>
        oidcConfigService.withConfig({
            stsServer: OidcConfig.stsServer,
            redirectUrl: window.location.origin,
            postLogoutRedirectUri: window.location.origin,
            clientId: OidcConfig.clientId,
            scope: OidcConfig.scope,
            responseType: OidcConfig.responseType,
            silentRenew: true,
            useRefreshToken: true,
            renewTimeBeforeTokenExpiresInSeconds: 30,
            secureRoutes: OidcConfig.secureRoutes,
            logLevel: LogLevel.Debug
        });
}

@NgModule({
    imports: [AuthModule.forRoot()],
    exports: [AuthModule],
    providers: [
        OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: configureAuth,
            deps: [OidcConfigService, OidcConfig],
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorCatchingInterceptor,
            multi: true
        }
    ],
})
export class AuthConfigModule { }
