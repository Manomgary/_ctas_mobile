import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadDataService } from 'src/app/services/local/load-data.service';

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.page.html',
  styleUrls: ['./suivi.page.scss'],
})
export class SuiviPage implements OnInit {
  private region: any;
  private district: any;

  constructor(private router: Router, private loadService: LoadDataService) { 
    const routeState = this.router.getCurrentNavigation().extras.state;
    if (routeState) {
      let zone: any = JSON.parse(routeState.zone);
      let projet: any = JSON.parse(routeState.projet);
      this.region = zone.data.region;
      this.district = zone.data.district;
      console.log(zone);
      console.log(projet)
    } else console.log("Router Suivi is not current");
  }

  ngOnInit() {
    this.loadService.loadEquipe().subscribe(data => {
      console.log("load Equipe suivi+++");
      console.log(data);
    });
    this.loadService.loadProjetEquipe().subscribe(data => {
      console.log("load ProjetEquipe suivi+++");
      console.log(data);
    });
  }

}
