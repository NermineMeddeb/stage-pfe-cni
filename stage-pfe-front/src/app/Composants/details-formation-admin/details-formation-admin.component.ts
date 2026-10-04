import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormationsDto, SessionsDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';
@Component({
  selector: 'app-details-formation-admin',
  templateUrl: './details-formation-admin.component.html',
  styleUrls: ['./details-formation-admin.component.css'],
})
export class DetailsFormationAdminComponent implements OnInit {
  sessions: SessionsDto[] = [];
  loading: boolean = true;
  error: string | null = null;
  @Input() FormationsDto!: FormationsDto;
  @Output() suppressionResult = new EventEmitter();
  constructor(private route: Router, private formationsService: ApiService) {}

  ngOnInit(): void {
    console.log('Formation reçue:', this.FormationsDto);
  }

  voirApercu(formationId?: number) {
    if (formationId) {
      const url = `formations/${formationId}/apercu`;
      console.log('URL de redirection :', url);
      this.route
        .navigate([url])
        .then((navigationSuccessful) => {
          if (navigationSuccessful) {
            console.log('Navigation réussie');
          } else {
            console.log('Navigation échouée');
          }
        })
        .catch((err) => {
          console.error('Erreur de navigation :', err);
        });
    } else {
      console.error('Impossible de naviguer, ID manquant !');
    }
  }

  modifierArticle(): void {
    console.log(
      'entrer dans la fct modifier Article:',)
    if (this.FormationsDto.id) {
      this.route.navigate([
        '/dashboard/nouvelle-formation',
        this.FormationsDto.id,
      ]);
    } else {
      console.error('ID de formation manquant');
    }
  }

  confirmerEtSupprimerArticle(): void {
    console.log(
      'Tentative de suppression de formation avec ID :',
      this.FormationsDto.id
    );
    if (this.FormationsDto.id) {
      this.formationsService
        .deleteFormation(this.FormationsDto.id.toString())
        .subscribe({
          next: (res) => {
            console.log('Suppression réussie');
            this.suppressionResult.emit('success');
            this.route.navigate(['/dashboard/formations']);
          },
          error: (error) => {
            console.error('Erreur lors de la suppression de formation:', error);
            this.suppressionResult.emit(
              error.error?.error || 'Erreur inconnue'
            );
          },
        });
    } else {
      console.error('ID de formation manquant pour suppression');
    }
  }
}
