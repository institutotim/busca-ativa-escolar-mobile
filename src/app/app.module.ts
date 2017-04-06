import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {IonicStorageModule} from "@ionic/storage";
import {AuthService} from "../providers/auth.service";
import {HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {AuthModule} from "./auth.module";
import {MyAttributionsPage} from "../pages/my-attributions/my-attributions";
import {APIService} from "../providers/api.service";
import {ChildrenService} from "../providers/children.service";
import {ChildViewPage} from "../pages/child-view/child-view";
import {UtilsService} from "../providers/utils.service";
import {StaticDataService} from "../providers/static-data.service";
import {EditStepPage} from "../pages/edit-step/edit-step";
import {FormBuilderService} from "../providers/form-builder.service";

@NgModule({
	declarations: [
		MyApp,
		LoginPage,
		MyAttributionsPage,
		ChildViewPage,
		EditStepPage,
		TabsPage,
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
		MyAttributionsPage,
		ChildViewPage,
		EditStepPage,
		TabsPage
	],
	providers: [
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		{provide: AuthService, useClass: AuthService},
		{provide: APIService, useClass: APIService},
		{provide: ChildrenService, useClass: ChildrenService},
		{provide: StaticDataService, useClass: StaticDataService},
		{provide: UtilsService, useClass: UtilsService},
		{provide: FormBuilderService, useClass: FormBuilderService},
	]
})
export class AppModule {
}
