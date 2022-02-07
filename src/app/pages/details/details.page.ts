import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  user = null;
 
  constructor(private route: ActivatedRoute, private beneficiaireService: BeneficiaireService) { }
 
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("===== Details Service === " + id);
    this.user = await this.beneficiaireService.getUsersById(id);
    console.log(this.user);
  }
}
