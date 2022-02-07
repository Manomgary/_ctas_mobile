import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

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
import { TabsPage } from './pages/tabs/tabs.page';
import { LoginPage } from './login/login.page';
import { ModalPage } from './pages/modal/modal.page';
import { ApiService } from './services/api.service';
import { ImportDataService } from './services/import-data.service';
import { LoadDataService } from './services/local/load-data.service';



@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    MenuPage,
    BeneficiairePage,
    TabsPage,
    LoginPage,
    ModalPage
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
            FlexLayoutModule 
          ],
  providers: [
    HttpClient,
    SqliteService,
    DatabaseService,
    BeneficiaireService,
    ImportDataService,
    ApiService,
    LoadDataService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
