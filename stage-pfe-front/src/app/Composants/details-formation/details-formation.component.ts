import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormationsDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';

@Component({
  selector: 'app-details-formation',
  templateUrl: './details-formation.component.html',
  styleUrls: ['./details-formation.component.css']
})
export class DetailsFormationComponent implements OnInit {
  @Input() FormationsDto!: FormationsDto;
  @Output() suppressionResult = new EventEmitter();
  constructor(
    private route: Router,
    private formationsService: ApiService,
  ) { }

  ngOnInit(): void {
    console.log('Formation reçue:', this.FormationsDto);
  }

   voirApercu(formationId?: number) {
    if (formationId) {
      const url = `formations/${formationId}/apercu`;
      console.log("URL de redirection :", url);
      this.route.navigate([url]).then((navigationSuccessful) => {
        if (navigationSuccessful) {
          console.log('Navigation réussie');
        } else {
          console.log('Navigation échouée');
        }
      }).catch(err => {
        console.error('Erreur de navigation :', err);
      });
    } else {
      console.error("Impossible de naviguer, ID manquant !");
    }
  } 
  
}
