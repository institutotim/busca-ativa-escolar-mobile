import {NgModule, ErrorHandler} from '@angular/core';
import {CloudSettings, CloudModule} from '@ionic/cloud-angular';
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
import {EntityPickerModal} from "../pages/modals/entity-picker/entity-picker";
import {SpawnAlertPage} from "../pages/spawn-alert/spawn-alert";
import {FormEditor} from "../components/form-editor/form-editor";
import {TextMaskModule} from "angular2-text-mask";
import {MasksService} from "../providers/masks.service";
import {DashboardPage} from "../pages/dashboard/dashboard";

const cloudSettings: CloudSettings = {
	'core': {
		'app_id': '4fc2ed21'
	}
};

@NgModule({
	declarations: [
		MyApp,
		LoginPage,
		DashboardPage,
		SpawnAlertPage,
		MyAttributionsPage,
		ChildViewPage,
		EditStepPage,
		TabsPage,
		EntityPickerModal,
		FormEditor,
	],
	imports: [
		IonicModule.forRoot(MyApp),
		//CloudModule.forRoot(cloudSettings),
		HttpModule,
		AuthModule,
		TextMaskModule,
		IonicStorageModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LoginPage,
		DashboardPage,
		SpawnAlertPage,
		MyAttributionsPage,
		ChildViewPage,
		EditStepPage,
		TabsPage,
		EntityPickerModal,
		FormEditor,
	],
	providers: [
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		{provide: AuthService, useClass: AuthService},
		{provide: APIService, useClass: APIService},
		{provide: ChildrenService, useClass: ChildrenService},
		{provide: StaticDataService, useClass: StaticDataService},
		{provide: UtilsService, useClass: UtilsService},
		{provide: MasksService, useClass: MasksService},
		{provide: FormBuilderService, useClass: FormBuilderService},
	]
})
export class AppModule {
}
