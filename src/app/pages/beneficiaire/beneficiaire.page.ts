import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// Imports 
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Region } from 'src/app/utils/interface-bd';

export interface UserData {
  id: string;
  nom: string;
  fokontany: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'Anjatoka III',
  'Tanambao',
  'berary',
  'Mangarivotse',
  'Beabo',
  'Ambaro',
];
const NAMES: string[] = [
  'Miza',
  'Rakoto',
  'Tabirisoa',
  'Laha',
  'Amelia',
  'Nirina',
  'Charlotte',
  'Theodore',
  'Firaisa',
  'Oliver',
  'Isabella',
  'Fomeindraza',
  'Miatrebala',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Marentsoa',
];


@Component({
  selector: 'app-beneficiaire',
  templateUrl: './beneficiaire.page.html',
  styleUrls: ['./beneficiaire.page.scss'],
})
export class BeneficiairePage implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['code', 'nom'];
  dataSource: MatTableDataSource<Region>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  region: any;
  district: any;
  commune: any;

  constructor(public modalCtrl: ModalController, private router: Router, private loadData: LoadDataService) {
    if (this.router.getCurrentNavigation().extras.state) {
      let data: any;
      const routeState = this.router.getCurrentNavigation().extras.state;
      data = JSON.parse(routeState.zone);
      ///this.region = JSON.parse(data.data);
      console.log("Beneficiaire =====>" + data);
      console.log(data);
      this.region = data.data.region;
      this.district = data.data.district;
      this.commune = data.data.commune;
      console.log(this.region);
      console.log(this.district);
      console.log(this.commune);
    }

    let region: any[] = [];

    this.loadData.loadRegion().subscribe((res) => {
      console.log(res);
      region = res;
      console.log(region);
    });

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(region);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    nom: name,
    fokontany: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}
