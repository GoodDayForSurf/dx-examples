import { bootstrapApplication } from '@angular/platform-browser';
import {AppComponent} from "./app/app.component";
import {Inject, Injectable, NgModule, NgZone, Optional} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClient, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import { DxIntegrationModule } from "devextreme-angular/core"
import {DOCUMENT, XhrFactory} from "@angular/common";
// @ts-ignore
import httpRequest from 'devextreme/core/http_request';
// @ts-ignore
import injector from 'devextreme/core/utils/dependency_injector';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    constructor() {
        console.log('===============INTERCEPT constructor:');
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log('===============INTERCEPT Request:', req);
        return next.handle(req);
    }
}

bootstrapApplication(AppComponent, {
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }
    ]
})

