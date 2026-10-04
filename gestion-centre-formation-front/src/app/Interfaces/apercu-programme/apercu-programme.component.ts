import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationsDto, SessionsDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';

@Component({
  selector: 'app-apercu-programme',
  templateUrl: './apercu-programme.component.html',
  styleUrls: ['./apercu-programme.component.css']
})
export class ApercuProgrammeComponent implements OnInit {
  formation: FormationsDto | null = null;
  sessions: SessionsDto[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const formationId = this.route.snapshot.paramMap.get('id');
    console.log('ID reçu dans aperçu :', formationId);

    if (formationId) {
      this.loadFormationAndSessions(formationId);
    } else {
      console.error('Aucun ID reçu !');
      this.router.navigate(['/dashboard/catalogue']);
    }
  }

  private loadFormationAndSessions(formationId: string) {
    // Load formation details
    this.apiService.findFormationById(formationId).subscribe({
      next: (data: FormationsDto) => {
        this.formation = data;
        console.log('Données formation reçues :', this.formation);
        // Load sessions after formation is loaded
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la formation :', error);
        this.error = 'Erreur lors du chargement de la formation';
        this.loading = false;
        this.router.navigate(['/dashboard/catalogue']);
      }
    });
  }

 

  retour() {
    this.router.navigate(['/dashboard/catalogue']);
  }

  sInscrire(): void {
    if (!this.formation) {
      return;
    }

    const placesDisponibles = this.formation.placesMax ?? 0;
    
    if (placesDisponibles > 0) {
      if (this.sessions && this.sessions.length > 0) {
        this.router.navigate(['/inscription', this.formation.id]);
      } else {
        alert('Désolé, aucune session n\'est actuellement disponible pour cette formation.');
      }
    }
  }
}