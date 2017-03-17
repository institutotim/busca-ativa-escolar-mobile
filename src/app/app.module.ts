import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {IonicStorageModule} from "@ionic/storage";
import {AuthService} from "../providers/auth.service";
import {HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {AuthModule} from "./auth.module";
@NgModule({
	declarations: [
		MyApp,
		LoginPage,
		AboutPage,
		ContactPage,
		HomePage,
		TabsPage
	],
	imports: [
		IonicModule.forRoot(MyApp),
		HttpModule,
		AuthModule,
		IonicStorageModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LoginPage,
		AboutPage,
		ContactPage,
		HomePage,
		TabsPage
	],
	providers: [
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		{provide: AuthService, useClass: AuthService}
	]
})
export class AppModule {
}
