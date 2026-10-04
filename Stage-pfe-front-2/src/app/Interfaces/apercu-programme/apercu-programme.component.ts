import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationsDto, SessionsDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';

@Component({
  selector: 'app-apercu-programme',
  templateUrl: './apercu-programme.component.html',
  styleUrls: ['./apercu-programme.component.css'],
})
export class ApercuProgrammeComponent implements OnInit {
  formation: FormationsDto | null = null;
  sessions: SessionsDto[] = [];
  loading: boolean = true;
  error: string | null = null;
  objectifsArray: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const formationIdParam = this.route.snapshot.paramMap.get('id');

    if (formationIdParam) {
      const formationId = Number(formationIdParam);
      if (!isNaN(formationId)) {
        this.loadFormationAndSessions(formationId);
      } else {
        this.handleError('ID de formation invalide');
      }
    } else {
      this.handleError('Aucun ID de formation spécifié');
    }
  }

  private loadFormationAndSessions(formationId: number): void {
    this.loading = true;

    // 1. Appel pour récupérer la formation
    this.apiService.findFormationById(formationId).subscribe({
      next: (data: FormationsDto) => {
        this.formation = data;

        // 2. Ensuite, appel pour récupérer les sessions liées à la formation
        this.apiService
          .findAvailableSessionsByFormationId(formationId)
          .subscribe({
            next: (sessions: SessionsDto[]) => {
              this.sessions = sessions;
              this.loading = false;
            },
            error: (error) => {
              console.error('Erreur récupération sessions', error);
              this.loading = false;
            },
          });
      },
      error: (error) => {
        console.error('Erreur récupération formation', error);
        this.handleError('Erreur lors du chargement de la formation');
      },
    });
  }

  private loadSessions(formationId: number): void {
    this.apiService.findAvailableSessionsByFormationId(formationId).subscribe({
      next: (sessions: SessionsDto[]) => {
        this.sessions = sessions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sessions :', error);
        // Just log the error but don't navigate away - we can still show formation details
        this.loading = false;
      },
    });
  }

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['/etudiant/catalogue']);
    }, 3000); // Redirect after 3 seconds
  }

  retour(): void {
    this.router.navigate(['/etudiant/catalogue']);
  }

  sInscrire(): void {
    if (!this.formation) return;

    const placesDisponibles = this.formation.placesMax ?? 0;

    if (placesDisponibles > 0) {
      if (this.sessions && this.sessions.length > 0) {
        this.router.navigate([
          '/etudiant/inscription-client',
          this.formation.id,
        ]);
      } else {
        this.showNotification(
          "Aucune session n'est actuellement disponible pour cette formation",
          'warning'
        );
      }
    } else {
      this.showNotification(
        "Il n'y a plus de places disponibles pour cette formation",
        'danger'
      );
    }
  }

  private showNotification(
    message: string,
    type: 'success' | 'danger' | 'warning' | 'info' = 'info'
  ): void {
    // This is a placeholder for a notification system
    // You could replace this with a proper notification service or component
    alert(message);

    // Alternatively, you could use a Toast service if you have one implemented
    // Example: this.toastService.show(message, { classname: `bg-${type} text-light`, delay: 3000 });
  }
}
