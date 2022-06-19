import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { File } from '@ionic-native/file/ngx';

// Import
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SqliteService } from './services/sqlite.service';
import { DatabaseService } from './services/database.service';
import { BeneficiaireService } from './services/beneficiaire.service';

/* Angular Material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Flex Layout */
import { FlexLayoutModule } from "@angular/flex-layout";


/** Component */
import { MenuPage } from './menu/menu.page';
import { HomePage } from './home/home.page';
import { BeneficiairePage } from './pages/beneficiaire/beneficiaire.page';
import { BeneficiaireBlocPage } from './pages/beneficiaire-bloc/beneficiaire-bloc.page';
import { SuiviPage } from './pages/suivi_/suivi/suivi.page';
import { SuiviBlocPage } from './pages/suivi_/suivi-bloc/suivi-bloc.page';
import { TabsPage } from './pages/tabs/tabs.page';
import { LoginPage } from './login/login.page';
import { ModalPage } from './pages/modal/modal.page';
import { ModalBlocPage } from './pages/modals/modal-bloc/modal-bloc.page';
import { ApiService } from './services/api.service';
import { ImportDataService } from './services/import-data.service';
import { LoadDataService } from './services/local/load-data.service';
import { CrudDbService } from './services/local/crud-db.service';
import { SyncService } from './services/sync.service';
import { LoadSyncService } from './services/local/load-sync.service';
import { SynchroPage } from './pages/synchro/synchro.page';

/** Parsing Date formats */
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MY_DATE_FORMATS } from 'src/app/utils/my-date-formats';
import { PrModule } from './pages/pr/pr.module';
import { ModalPrPage } from './pages/modals/modal-pr/modal-pr.page';



@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    MenuPage,
    BeneficiairePage,
    BeneficiaireBlocPage,
    SuiviPage,
    SuiviBlocPage,
    TabsPage,
    LoginPage,
    ModalPage,
    ModalBlocPage,
    ModalPrPage,
    SynchroPage
  ],
  entryComponents: [],
  imports: [
            BrowserModule, 
            FormsModule,
            ReactiveFormsModule, 
            AngularMaterialModule, 
            IonicModule.forRoot(), 
            AppRoutingModule, 
            BrowserAnimationsModule,
            HttpClientModule,
            FlexLayoutModule,
            PrModule
          ],
  providers: [
    HttpClient,
    SqliteService,
    DatabaseService,
    BeneficiaireService,
    ImportDataService,
    ApiService,
    LoadDataService,
    CrudDbService,
    SyncService,
    LoadSyncService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
