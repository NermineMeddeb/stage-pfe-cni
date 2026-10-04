import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  InscriptionDto,
  SessionsDto,
  UtilisateursDto,
} from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-nouvelle-inscription',
  templateUrl: './nouvelle-inscription.component.html',
  styleUrls: ['./nouvelle-inscription.component.css'],
})
export class NouvelleInscriptionComponent implements OnInit {
  inscriptionForm: FormGroup;
  utilisateurs: UtilisateursDto[] = [];
  sessions: SessionsDto[] = [];
  isEditMode = false;
  inscriptionId: number | null = null;

  statutOptions = [
    { value: 'EN_COURS', label: 'En Cours' },
    { value: 'TERMINE', label: 'Terminé' },
    { value: 'ANNULE', label: 'Annulé' },
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.inscriptionForm = this.fb.group({
      id: [null],
      sessionId: [null, Validators.required],
      utilisateurId: [null, Validators.required],
      dateInscription: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      statut: ['EN_COURS', Validators.required],
      certificatGenere: [false, Validators.required],
      dateDebut: [null, Validators.required],
      dateFin: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Chargement des données de référence
    this.chargerUtilisateurs();
    this.chargerSessions();

    // Vérifier si on est en mode édition (mise à jour)
    this.route.params
      .pipe(
        switchMap((params) => {
          if (params['id']) {
            this.isEditMode = true;
            this.inscriptionId = +params['id'];
            return this.apiService.getInscriptionById(this.inscriptionId);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (inscription) => {
          if (inscription) {
            // Formater les dates avant de les assigner au formulaire
            const formattedInscription = {
              ...inscription,
              dateInscription: inscription.dateInscription
                ? this.formatDateForInput(inscription.dateInscription)
                : null,
              dateDebut: inscription.dateDebut
                ? this.formatDateForInput(inscription.dateDebut)
                : null,
              dateFin: inscription.dateFin
                ? this.formatDateForInput(inscription.dateFin)
                : null,
            };
            this.inscriptionForm.patchValue(formattedInscription);
          }
        },
        error: (err) => {
          console.error("Erreur lors du chargement de l'inscription", err);
        },
      });
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

  onSubmit() {
    if (this.inscriptionForm.valid) {
      // Créer une copie pour éviter de modifier le formulaire directement
      const formValues = this.inscriptionForm.getRawValue();

      // Convertir explicitement les valeurs et s'assurer du typage correct
      const inscription: InscriptionDto = {
        id: 0, // Forcer l'ID à 0 pour un nouvel enregistrement
        sessionId: Number(formValues.sessionId),
        utilisateurId: Number(formValues.utilisateurId),
        dateInscription: formValues.dateInscription,
        dateDebut: formValues.dateDebut,
        dateFin: formValues.dateFin,
        statut: formValues.statut,
        certificatGenere: Boolean(formValues.certificatGenere),
      };

      // Log détaillé de l'objet qui sera envoyé à l'API
      console.log(
        "Données qui seront envoyées à l'API:",
        JSON.stringify(inscription)
      );

      // Pour tester, vous pouvez essayer d'utiliser directement HttpClient au lieu de ApiService
      if (this.isEditMode && this.inscriptionId) {
        console.log('Mode: Mise à jour (PUT)');
        this.apiService
          .updateInscription(this.inscriptionId, inscription)
          .subscribe({
            next: (result) => {
              console.log('Succès PUT:', result);
              this.afficherMessage('Inscription mise à jour avec succès');
              this.router.navigate(['/dashboard/inscriptions']);
            },
            error: (err) => {
              console.error('Erreur PUT:', err);
              console.error('Status:', err.status);
              console.error('Message:', err.message);
              console.error('Headers:', err.headers);
              if (err.error) {
                console.error("Réponse d'erreur:", err.error);
              }
              this.afficherMessage(
                `Erreur lors de la mise à jour: ${err.status} ${err.statusText}`,
                true
              );
            },
          });
      } else {
        console.log('Mode: Création (POST)');
        // Test direct avec HttpClient
        this.apiService.saveInscription(inscription).subscribe({
          next: (result) => {
            console.log('Succès POST:', result);
            this.afficherMessage('Inscription ajoutée avec succès');
            this.resetForm();
            this.router.navigate(['/dashboard/inscriptions']);
          },
          error: (err) => {
            console.error('Erreur POST détaillée:', err);
            console.error('Status:', err.status);
            console.error('Message:', err.message);
            console.error('Headers:', err.headers);
            if (err.error) {
              console.error("Réponse d'erreur:", err.error);
            }

            // Analyser le type d'erreur pour afficher un message approprié
            let errorMessage = "Erreur lors de l'ajout";
            if (err.status === 0) {
              errorMessage +=
                ": Le serveur n'est pas accessible. Vérifiez que le backend est en cours d'exécution.";
            } else if (err.status === 405) {
              errorMessage +=
                ": Méthode non autorisée. L'URL ou la méthode HTTP est incorrecte.";
            } else if (err.status === 400) {
              errorMessage +=
                ': Données invalides. Vérifiez le format de vos données.';
            } else if (err.status === 415) {
              errorMessage +=
                ': Format de média non supporté. Vérifiez les headers Content-Type.';
            }

            this.afficherMessage(errorMessage, true);
          },
        });
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched(this.inscriptionForm);
      this.afficherMessage('Veuillez corriger les erreurs du formulaire', true);
      console.error('Erreurs de validation:', this.inscriptionForm.errors);

      // Afficher les erreurs pour chaque contrôle
      Object.keys(this.inscriptionForm.controls).forEach((key) => {
        const control = this.inscriptionForm.get(key);
        if (control?.invalid) {
          console.error(`Contrôle "${key}" invalide:`, control.errors);
        }
      });
    }
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
    this.inscriptionForm.reset({
      dateInscription: new Date().toISOString().split('T')[0],
      statut: 'EN_COURS',
      certificatGenere: false,
    });
  }

  // Vérifier si un champ est invalide et a été touché
  estInvalide(controlName: string): boolean {
    const control = this.inscriptionForm.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  // Récupérer le message d'erreur pour un champ
  getErrorMessage(controlName: string): string {
    const control = this.inscriptionForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      // Ajoutez d'autres messages d'erreur selon vos validateurs
    }
    return '';
  }
}
