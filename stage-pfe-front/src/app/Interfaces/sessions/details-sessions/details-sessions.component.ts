import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from 'src/cni-api/src/services';
import { FormationsDto, SessionsDto } from 'src/cni-api/src/models';
@Component({
  selector: 'app-details-sessions',
  templateUrl: './details-sessions.component.html',
  styleUrls: ['./details-sessions.component.css']
})
export class DetailsSessionsComponent implements OnInit {
  sessionId: number | null = null;
  session: SessionsDto | null = null;
  formation: FormationsDto | null = null;
  loading = false;
  error = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private location: Location
  ) {
    // Récupérer les données passées via le state du router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as {
        sessionData: SessionsDto;
        formation: FormationsDto;
      };
      
      if (state.sessionData) {
        this.session = state.sessionData;
        this.sessionId = this.session.sessionId || null;
      }
      
      if (state.formation) {
        this.formation = state.formation;
      }
    }
  }

  ngOnInit(): void {
    // Si l'ID n'a pas été trouvé dans le state, le récupérer des paramètres de l'URL
    if (!this.sessionId) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.sessionId = +id;
          this.loadSessionData();
        } else {
          this.error = true;
          this.errorMessage = "Identifiant de session manquant";
        }
      });
    } else if (!this.session) {
      // Si on a l'ID mais pas les données complètes
      this.loadSessionData();
    } else if (!this.formation && this.session.formationId) {
      // Si on a les données de session mais pas la formation
      this.loadFormationData(this.session.formationId);
    }
  }

  loadSessionData(): void {
    if (!this.sessionId) return;
    
    this.loading = true;
    this.apiService.findById_1(this.sessionId).subscribe(
      (data) => {
        this.session = data;
        this.loading = false;
        
        // Charger les détails de la formation associée
        if (data.formationId) {
          this.loadFormationData(data.formationId);
        }
      },
      (error) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = "Erreur lors du chargement des détails de la session";
        console.error('Error loading session details:', error);
      }
    );
  }

  loadFormationData(formationId: number): void {
    this.loading = true;
    this.apiService.findFormationById(formationId).subscribe(
      (data) => {
        this.formation = data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error loading formation details:', error);
      }
    );
  }

  // Calculer le pourcentage d'occupation
  getOccupancyPercentage(): number {
    if (!this.session || !this.session.capacite) return 0;
    
    const placesOccupied = (this.session.capacite - (this.session.placesDisponibles || 0));
    return (placesOccupied / this.session.capacite) * 100;
  }

  // Obtenir la classe CSS en fonction du taux d'occupation
  getStatusClass(): string {
    const percentage = this.getOccupancyPercentage();
    if (percentage >= 80) return 'danger';
    if (percentage >= 50) return 'warning';
    return 'success';
  }

  // Formater les dates pour l'affichage
  formatDate(date?: string): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  goToEdit(): void {
    if (this.sessionId) {
      this.router.navigate(['/edit', this.sessionId]);
    }
  }

  deleteSession(): void {
    if (!this.sessionId) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer la session #${this.sessionId} ?`)) {
      this.loading = true;
      
      this.apiService.delete_1(this.sessionId).subscribe(
        () => {
          this.loading = false;
          alert('Session supprimée avec succès');
          this.router.navigate(['/sessions']);
        },
        (error) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = "Erreur lors de la suppression de la session";
          console.error('Error deleting session:', error);
        }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }
}
