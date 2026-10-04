// mes-formations.component.ts
import { Component, OnInit } from '@angular/core';
import { FormationsDto, SessionsDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { UserService } from 'src/cni-api/src/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mes-formations',
  templateUrl: './mes-formations.component.html',
  styleUrls: ['./mes-formations.component.css'],
})
export class MesFormationsComponent implements OnInit {
  formations: FormationsDto[] = [];
  sessions: SessionsDto[] = [];
  loading: boolean = true;
  error: string = '';
  isGenerating: boolean = false;

  constructor(
    private formationService: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserFormations();
  }

  loadUserFormations(): void {
    const user = this.userService.getConnectedUser();
    
    if (!user || !user.id) {
      this.error = 'Utilisateur non authentifié';
      this.loading = false;
      return;
    }
    
    this.formationService.getFormationsByUserId(user.id).subscribe(
      (data) => {
        this.formations = data;
        this.loadSessionsForFormations();
      },
      (error) => {
        this.error = 'Erreur lors du chargement des formations';
        this.loading = false;
        console.error(error);
      }
    );
  }

  loadSessionsForFormations(): void {
    const allSessions: SessionsDto[] = [];
    
    let remaining = this.formations.length;
    
    if (remaining === 0) {
      this.loading = false;
      return;
    }
    
    this.formations.forEach((formation) => {
      if (!formation.id) {
        remaining--;
        if (remaining === 0) {
          this.sessions = allSessions;
          this.loading = false;
        }
        return;
      }
      
      this.formationService.findByFormation(formation.id).subscribe(
        (sessions) => {
          allSessions.push(...sessions);
          remaining--;
          if (remaining === 0) {
            this.sessions = allSessions;
            this.loading = false;
          }
        },
        (error) => {
          this.error = 'Erreur lors du chargement des sessions';
          this.loading = false;
          console.error(error);
          remaining--;
        }
      );
    });
  }
    
  // Récupérer les sessions pour une formation spécifique
  getSessionsForFormation(formationId: number | undefined): SessionsDto[] {
    if (!formationId) return [];
    return this.sessions.filter(session => session.formationId === formationId);
  }

  // Method to format status labels
  getStatusLabel(status: string): string {
    switch (status) {
      case 'EN_COURS':
        return 'En cours';
      case 'TERMINEE':
        return 'Terminée';
      case 'A_VENIR':
        return 'À venir';
      default:
        return status;
    }
  }
  
  // Méthode pour voir l'aperçu d'une formation
  voirApercu(formationId: number | undefined): void {
    if (formationId) {
      this.router.navigate(['/etudiant/formation', formationId]);
    }
  }
  
  // Méthode pour s'inscrire à une formation
  inscrire(formationId: number): void {
    if (formationId) {
      // Implémentez la logique d'inscription ici
      console.log(`Inscription à la formation ${formationId}`);
      // Exemple: this.formationService.inscrireFormation(formationId, userId)...
    }
  }
  
  // Méthode pour générer un devis
  genererDevis(formationId: number | undefined): void {
    if (!formationId) return;
    
    this.isGenerating = true;
    
    // Simulation d'une opération asynchrone (à remplacer par votre appel API réel)
    setTimeout(() => {
      console.log(`Génération de devis pour la formation ${formationId}`);
      // Exemple: this.formationService.genererDevis(formationId)...
      this.isGenerating = false;
      
      // Ajoutez ici la logique de téléchargement ou d'affichage du devis
    }, 1500);
  }
}