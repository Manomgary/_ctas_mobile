import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { DatabaseService } from './services/database.service';
import { SqliteService } from './services/sqlite.service';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { IMAGE_DIR } from './utils/global-variables';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  rootPage:any = 'login';
  initPlugin: boolean;
  load: any;
  
  constructor(
    private platform: Platform,
    private _sqlite: SqliteService,
    private dataBaseService: DatabaseService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
    this.initializeApp();

  }
  async ngOnInit() {
    //this.dataFromServe();
  }
 
  async initializeApp() {
    const loading = await this.loadingCtrl.create();
    /**await loading.present();
    loading.dismiss();*/
    this.platform.ready().then(async () => {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this._sqlite.initializePlugin().then(ret => {
        this.initPlugin = ret;
        console.log('>>>> in App  this.initPlugin ' + this.initPlugin);
      });
      this.dataBaseService.init();
      this.dataBaseService.dbReady.subscribe(isReady => {
        if(isReady) {
          loading.dismiss();
          StatusBar.setStyle({ style: Style.Dark });
          SplashScreen.hide();
          //this.router.navigate(['home']);
        }
      });
      // create folder stored image
      Filesystem.readdir({
        path: IMAGE_DIR,
        directory: Directory.Data,
      }).then(result => {
        console.log('FOLDER EXISTE HERE: storages_image:: ', result);
      },
        async (err) => {
          // Folder does not yet exists!
          await Filesystem.mkdir({
            path: IMAGE_DIR,
            directory: Directory.Data,
          });
        }
      ).then(_ => {
        //loading.dismiss();
      });
    });
  }
}
