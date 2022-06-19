import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AnimationSpecu, AnimationVe, Loc_projet } from 'src/app/interfaces/interfaces-local';
import { LoadDataService } from 'src/app/services/local/load-data.service';
import { Utilisateurs } from 'src/app/utils/interface-bd';

@Component({
  selector: 'app-animation-ve',
  templateUrl: './animation-ve.page.html',
  styleUrls: ['./animation-ve.page.scss'],
  animations: [ //utiliser pour @detailExpand (table expendable)
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class AnimationVePage implements OnInit {
  private projet: Loc_projet;
  private user: Utilisateurs[];
  private activite: string;

  private data_animation_ve: AnimationVe[] = [];
  private data_anime_specu: AnimationSpecu[] = [];

  // displayed columns
  displayedColumnsAnimeVe: string[] = ['code_pr', 'nom', 'code_anime', 'date_anime', 'commune', 'fokontany', 'nb_participant', 'nb_f', 'nb_h', 'nb-25', 'nb_specu', 'quantite', 'img_pièce', 'action'];
  displayedColumnsSpecu: string[] = ['speculation', 'quantite'];

  // data source Mep
  dataSourceAnimationVe = new MatTableDataSource<AnimationVe>();

  isTableAnimationExpanded = false;

  constructor(
    private router: Router,
    private loadData: LoadDataService
    ) {
      const routeState = this.router.getCurrentNavigation().extras.state;
      console.log("Route state::::", routeState);
        if (routeState) {
          let projet: Loc_projet;
    
          projet = JSON.parse(routeState.projet);
          this.user = JSON.parse(routeState.user);
          this.activite = routeState.activite;
          this.projet = projet;
          console.log(":::Projet:::", this.projet);
          console.log(":::USers::::", this.user);
          console.log(":::Activiter::::", this.activite);
          this.loadAnimation();
        }
    }

  ngOnInit() {
  }

  onClick() {
    console.log("console beneficiaire::::");
    this.router.navigate(['homes']);
  }

  loadAnimation() {
    let data = {
      code_projet: this.projet.code_proj,
      code_equipe: this.user[this.user.length - 1].id_equipe
    }
    this.loadData.loadAnimeSpecu(data).then(res => {
      console.log(":::::Load Animation Specu::::", res);
      if (res.values.length > 0) {
        res.values.forEach(elem => {
          this.data_anime_specu.push(elem);
        });
      }
    });
    this.loadData.loadAnimationVe(data).then(res => {
      console.log(":::::Load Animation Ve:::", res);
      //this.data_animation_ve = res.values;
      if (res.values.length > 0) {
        res.values.forEach(elem => {
          this.data_animation_ve.push(elem);
        });
        if (this.data_animation_ve.length > 0) {
          this.data_animation_ve.forEach(item => {
            item.specu_animation = this.data_anime_specu.filter(item_specu => {return item_specu.id_anime_ve === item.code_anime});
          });
        }
        this.dataSourceAnimationVe.data = this.data_animation_ve;
        console.log(":::::Load Animation Ve With elem:::", this.data_animation_ve);
      }
    });
  }

  toggleTableRows() {
    this.isTableAnimationExpanded = !this.isTableAnimationExpanded;
    this.dataSourceAnimationVe.data.forEach(row => {
      if (row.specu_animation.length > 0) {
        row.isExpanded = this.isTableAnimationExpanded;
      } else {
        if (row.isExpanded) {
          row.isExpanded = false;
        }
      }
    });
  }

}
