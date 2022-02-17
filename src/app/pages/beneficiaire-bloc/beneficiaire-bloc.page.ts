import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadDataService } from 'src/app/services/local/load-data.service';

@Component({
  selector: 'app-beneficiaire-bloc',
  templateUrl: './beneficiaire-bloc.page.html',
  styleUrls: ['./beneficiaire-bloc.page.scss'],
})
export class BeneficiaireBlocPage implements OnInit {

  region: any;
  district: any;

  constructor(private router: Router, private loadData: LoadDataService) { 
    if (this.router.getCurrentNavigation().extras.state) {
      let data: any;
      const routeState = this.router.getCurrentNavigation().extras.state;
      console.log(routeState);
      data = JSON.parse(routeState.zone);
      console.log("Beneficiaire Bloc =====>");
      console.log(data);
      this.region = data.data.region;
      this.district = data.data.district;

      console.log(this.region);
      console.log(this.district);
    }
  }

  ngOnInit() {
    /**this.loadData.loadAllProjet({}).subscribe(data => {
      console.log("<======= load All project =====>");
      console.log(data);
    });
    this.loadData.loadCollaborateurs().subscribe(data => {
      console.log("<======= load All Collaborateurs =====>");
      console.log(data);
    });
    this.loadData.loadCollabActivite().subscribe(data => {
      console.log("<======= load All Collaborateurs activite =====>");
      console.log(data);
    });
    this.loadData.loadAssociation({}).then(data => {
      console.log("<======= load Association =====>");
      console.log(data);
    });
    this.loadData.loadBloc().subscribe(data => {
      console.log("<======= load BLOC =====>");
      console.log(data);
    });
    this.loadData.loadBeneficiaire().subscribe(data => {
      console.log("<======= load Beneficiaire =====>");
      console.log(data);
    });
    this.loadData.loadBeneficiairePms().subscribe(data => {
      console.log("<======= load Beneficiaire PMS =====>");
      console.log(data);
    });
    this.loadData.loadBeneficiaireBloc().subscribe(data => {
      console.log("<======= load Beneficiaire BLOC  =====>");
      console.log(data);
    });*/
  }

}
