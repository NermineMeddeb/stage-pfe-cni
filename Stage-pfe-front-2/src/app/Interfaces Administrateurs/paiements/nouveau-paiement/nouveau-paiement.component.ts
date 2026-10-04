import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PaiementsDto,
  SessionsDto,
  UtilisateursDto,
  FormationsDto,
} from 'src/cni-api/src/models';
import { switchMap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-nouveau-paiement',
  templateUrl: './nouveau-paiement.component.html',
  styleUrls: ['./nouveau-paiement.component.css'],
})
export class NouveauPaiementComponent implements OnInit {
  paiementsForm: FormGroup;
  utilisateurs: UtilisateursDto[] = [];
  sessions: SessionsDto[] = [];
  formations: FormationsDto[] = [];
  sessionFormations: Map<number, FormationsDto> = new Map();
  isEditMode = false;
  paiementsId: number | null = null;
  loading = true;
  statutOptions = [
    { value: 'EN_ATTENTE', label: 'En Attente' },
    { value: 'CONFIRME', label: 'Cpnfirmé' },
    { value: 'ANNULE', label: 'Annulé' },
  ];

  modesPaiement = [
    { value: 'ESPECES', label: 'Espèces' },
    { value: 'CHEQUE', label: 'Chèque' },
    { value: 'VIREMENT', label: 'Virement' },
    { value: 'CARTE', label: 'Carte bancaire' },
  ];

  formTheme = {
    primary: '#4f46e5',
    secondary: '#0ea5e9',
    accent: '#f59e0b',
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.paiementsForm = this.fb.group({
      id: [null],
      modePaiement: [null, Validators.required],
      utilisateurId: [null, Validators.required],
      datePaiement: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      montant: [null, Validators.required],
      sessionsId: [null, Validators.required],
      statut: ['EN_COURS', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loading = true;

    // Chargement de toutes les données nécessaires (utilisateurs, sessions, formations)
    this.chargerDonneesInitiales();

    // Vérifier si on est en mode édition (mise à jour)
    this.route.params
      .pipe(
        switchMap((params) => {
          if (params['id']) {
            this.isEditMode = true;
            this.paiementsId = +params['id'];
            return this.apiService.findPaiementById(this.paiementsId);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (paiements) => {
          if (paiements) {
            // Formater les dates avant de les assigner au formulaire
            const formattedPaiements = {
              ...paiements,
              datePaiement: paiements.datePaiement
                ? this.formatDateForInput(paiements.datePaiement)
                : null,
            };
            this.paiementsForm.patchValue(formattedPaiements);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du paiement', err);
          this.loading = false;
          this.afficherMessage('Erreur lors du chargement du paiement', true);
        },
      });
  }

  /**
   * Charge toutes les données requises pour le formulaire
   */
  chargerDonneesInitiales() {
    // Utiliser forkJoin pour charger toutes les données en parallèle
    forkJoin({
      utilisateurs: this.apiService.findAll_4(),
      sessions: this.apiService.findAll_2(),
      formations: this.apiService.findAllFormations(), // Supposant que cette méthode existe
    }).subscribe({
      next: (result: {
      utilisateurs: UtilisateursDto[];
      sessions: SessionsDto[];
      formations: FormationsDto[];
      }) => {
      this.utilisateurs = result.utilisateurs;
      this.sessions = result.sessions;
      this.formations = result.formations;

      // Créer un mapping entre sessions et formations
      this.mapSessionsToFormations();

      this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des données initiales', err);
        this.loading = false;
        this.afficherMessage('Erreur lors du chargement des données', true);
      },
    });
  }

  /**
   * Crée un mapping entre les sessions et leurs formations correspondantes
   */
  mapSessionsToFormations() {
    this.sessions.forEach((session) => {
      if (session.formationId) {
        const formation = this.formations.find(
          (f) => f.id === session.formationId
        );
        if (formation) {
          this.sessionFormations.set(session.sessionId || 0, formation);
        }
      }
    });
  }

  /**
   * Obtient le titre de la formation pour une session donnée
   */
  getFormationTitle(sessionId: number): string {
    const formation = this.sessionFormations.get(sessionId);
    return formation
      ? formation.titre || 'Formation sans titre'
      : 'Formation non trouvée';
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    // Assurez-vous que la date est au format YYYY-MM-DD pour l'input de type date
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (error) {
      console.error('Erreur de format de date:', error);
      return '';
    }
  }

  // Méthodes existantes maintenues pour compatibilité
  chargerUtilisateurs() {
    this.apiService.findAll_4().subscribe({
      next: (utilisateurs) => {
        this.utilisateurs = utilisateurs;
      },
      error: (err) => {
        console.error('Erreur de chargement des utilisateurs', err);
      },
    });
  }

  chargerSessions() {
    this.apiService.findAll_2().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
      },
      error: (err) => {
        console.error('Erreur de chargement des sessions', err);
      },
    });
  }

  /**
   * Récupère le prix de la formation associée à une session
   */
  getFormationPrice(sessionId: number): number {
    const formation = this.sessionFormations.get(sessionId);
    return formation && formation.prix ? formation.prix : 0;
  }

  /**
   * Met à jour automatiquement le montant du paiement en fonction de la session sélectionnée
   */
  onSessionChange(event: any) {
    const sessionId = Number(event.target.value);
    if (sessionId) {
      const price = this.getFormationPrice(sessionId);
      this.paiementsForm.patchValue({ montant: price });
    }
  }

  /**
   * Vérifie si la session a des places disponibles
   */
  hasAvailableSeats(session: SessionsDto): boolean {
    return session.placesDisponibles ? session.placesDisponibles > 0 : false;
  }

  /**
   * Retourne la classe CSS pour l'état des places
   */
  getAvailabilityClass(session: SessionsDto): string {
    if (!session.placesDisponibles) return 'unavailable';
    if (session.placesDisponibles <= 2) return 'low-availability';
    if (session.placesDisponibles <= 5) return 'medium-availability';
    return 'high-availability';
  }

  onSubmit() {
    if (this.paiementsForm.valid) {
      // Créer une copie pour éviter de modifier le formulaire directement
      const formValues = this.paiementsForm.getRawValue();

      // Convertir explicitement les valeurs et s'assurer du typage correct
      const paiements: PaiementsDto = {
        id: this.isEditMode && this.paiementsId ? this.paiementsId : 0,
        sessionsId: Number(formValues.sessionsId),
        utilisateurId: Number(formValues.utilisateurId),
        modePaiement: formValues.modePaiement,
        datePaiement: formValues.datePaiement,
        montant: Number(formValues.montant),
        statut: formValues.statut,
      };

      // Log détaillé de l'objet qui sera envoyé à l'API
      console.log(
        "Données qui seront envoyées à l'API:",
        JSON.stringify(paiements)
      );

      if (this.isEditMode && this.paiementsId) {
        console.log('Mode: Mise à jour (PUT)');
        this.apiService.updatePaiement(paiements).subscribe({
          next: (result) => {
            console.log('Succès PUT:', result);
            this.afficherMessage('Paiement mis à jour avec succès');
            this.router.navigate(['/dashboard/paiements']);
          },
          error: (err) => {
            console.error('Erreur PUT:', err);
            this.handleApiError(err);
          },
        });
      } else {
        console.log('Mode: Création (POST)');
        this.apiService.savePaiement(paiements).subscribe({
          next: (result) => {
            console.log('Succès POST:', result);
            this.afficherMessage('Paiement ajouté avec succès');
            this.resetForm();
            this.router.navigate(['/dashboard/paiements']);
          },
          error: (err) => {
            console.error('Erreur POST détaillée:', err);
            this.handleApiError(err);
          },
        });
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched(this.paiementsForm);
      this.afficherMessage('Veuillez corriger les erreurs du formulaire', true);
      console.error('Erreurs de validation:', this.paiementsForm.errors);

      // Afficher les erreurs pour chaque contrôle
      Object.keys(this.paiementsForm.controls).forEach((key) => {
        const control = this.paiementsForm.get(key);
        if (control?.invalid) {
          console.error(`Contrôle "${key}" invalide:`, control.errors);
        }
      });
    }
  }

  handleApiError(err: any) {
    console.error('Status:', err.status);
    console.error('Message:', err.message);
    console.error('Headers:', err.headers);
    if (err.error) {
      console.error("Réponse d'erreur:", err.error);
    }

    // Analyser le type d'erreur pour afficher un message approprié
    let errorMessage = "Erreur lors de l'opération";
    if (err.status === 0) {
      errorMessage +=
        ": Le serveur n'est pas accessible. Vérifiez que le backend est en cours d'exécution.";
    } else if (err.status === 405) {
      errorMessage +=
        ": Méthode non autorisée. L'URL ou la méthode HTTP est incorrecte.";
    } else if (err.status === 400) {
      errorMessage += ': Données invalides. Vérifiez le format de vos données.';
    } else if (err.status === 415) {
      errorMessage +=
        ': Format de média non supporté. Vérifiez les headers Content-Type.';
    }

    this.afficherMessage(errorMessage, true);
  }

  // Méthode pour marquer tous les champs comme touchés
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Afficher un message à l'utilisateur
  afficherMessage(message: string, isError: boolean = false) {
    // Implémentation selon votre système de notification
    // Exemple simple:
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = isError
      ? 'alert alert-danger'
      : 'alert alert-success';
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.right = '20px';
    messageElement.style.zIndex = '1000';
    document.body.appendChild(messageElement);

    // Disparaître après 5 secondes
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }

  resetForm() {
    this.paiementsForm.reset({
      datePaiement: new Date().toISOString().split('T')[0],
      statut: 'EN_COURS',
    });
  }

  // Vérifier si un champ est invalide et a été touché
  estInvalide(controlName: string): boolean {
    const control = this.paiementsForm.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  // Récupérer le message d'erreur pour un champ
  getErrorMessage(controlName: string): string {
    const control = this.paiementsForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      // Ajoutez d'autres messages d'erreur selon vos validateurs
    }
    return '';
  }
}
