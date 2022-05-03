import { InjectionToken } from "@angular/core";
import { OidcConfigService } from "angular-auth-oidc-client";

export const OidcConfig: InjectionToken<OidcConfigService> = new InjectionToken('');