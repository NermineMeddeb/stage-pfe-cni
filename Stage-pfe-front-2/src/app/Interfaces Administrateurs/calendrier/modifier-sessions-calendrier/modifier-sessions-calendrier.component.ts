import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { SessionsDto } from 'src/cni-api/src/models';
import { finalize, catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-modifier-sessions-calendrier',
  templateUrl: './modifier-sessions-calendrier.component.html',
  styleUrls: ['./modifier-sessions-calendrier.component.css'],
})
export class ModifierSessionsCalendrierComponent implements OnInit {
  sessionForm: FormGroup;
  sessionId: number | null = null;
  isNewSession = false;

  formations: any[] = [];
  salles: any[] = [];
  utilisateurs: any[] = [];
  formateurs: any[] = [];
  etudiants: any[] = [];
  selectedUtilisateurs: any[] = [];
  filteredUtilisateurs: any[] = [];
  userGroups: any[] = [];

  selectionMode: 'search' | 'liste' | 'role' = 'search';
  searchUtilisateurText = '';
  loading = false;
  submitting = false;
  error = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private apiService: ApiService
  ) {
    this.sessionForm = this.fb.group(
      {
        formationId: [null, Validators.required],
        dateDebut: [null, Validators.required], // Contiendra la date et l'heure
        dateFin: [null, Validators.required], // Contiendra la date et l'heure
        capacite: [0, [Validators.required, Validators.min(1)]],
        placesDisponibles: [0, [Validators.required, Validators.min(0)]],
        salleId: [null, Validators.required],
        utilisateursIds: [[], Validators.required],
      },
      { validators: [this.dateTimeValidator] } // Un seul validateur pour date+heure
    );
  }
  // Nouveau validateur combiné date+heure
  dateTimeValidator(group: FormGroup): { [key: string]: any } | null {
    const debut = group.get('dateDebut')?.value;
    const fin = group.get('dateFin')?.value;

    if (debut && fin) {
      const dateDebut = new Date(debut);
      const dateFin = new Date(fin);

      if (dateDebut > dateFin) {
        return { dateTimeInvalid: true };
      }
    }
    return null;
  }
  ngOnInit(): void {
    this.loadFormations();
    this.loadSalles();
    this.loadUtilisateurs();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id === 'new') {
        this.isNewSession = true;
      } else if (id) {
        this.sessionId = +id;
        this.loadSessionData();
      } else {
        this.error = true;
        this.errorMessage = 'Identifiant de session manquant';
      }
    });
  }

  // Validateur de dates
  dateValidator(group: FormGroup): { [key: string]: any } | null {
    const debut = group.get('dateDebut')?.value;
    const fin = group.get('dateFin')?.value;
    if (debut && fin && new Date(debut) > new Date(fin)) {
      return { dateInvalid: true };
    }
    return null;
  }

  // Nouveau validateur d'heures
  heureValidator(group: FormGroup): { [key: string]: any } | null {
    const dateDebut = group.get('dateDebut')?.value;
    const dateFin = group.get('dateFin')?.value;
    const heureDebut = group.get('heureDebut')?.value;
    const heureFin = group.get('heureFin')?.value;

    if (dateDebut && dateFin && heureDebut && heureFin) {
      const dateDebutObj = new Date(dateDebut);
      const dateFinObj = new Date(dateFin);

      // Si même date, vérifier l'heure
      if (dateDebutObj.getTime() === dateFinObj.getTime()) {
        const [heureDebutH, heureDebutM] = heureDebut.split(':').map(Number);
        const [heureFinH, heureFinM] = heureFin.split(':').map(Number);

        if (
          heureDebutH > heureFinH ||
          (heureDebutH === heureFinH && heureDebutM >= heureFinM)
        ) {
          return { heureInvalid: true };
        }
      }
    }
    return null;
  }

  validateDates(): void {
    const debut = this.sessionForm.get('dateDebut')?.value;
    const fin = this.sessionForm.get('dateFin')?.value;

    if (debut && fin && new Date(debut) > new Date(fin)) {
      this.sessionForm.setErrors({ dateInvalid: true });
    } else {
      // Préserver d'autres erreurs possibles
      const currentErrors = { ...this.sessionForm.errors };
      delete currentErrors['dateInvalid'];
      this.sessionForm.setErrors(
        Object.keys(currentErrors).length ? currentErrors : null
      );

      // Valider aussi les heures si les dates sont valides
    }
  }

  validatePlaces(): void {
    const capacite = this.sessionForm.get('capacite')?.value;
    const places = this.sessionForm.get('placesDisponibles')?.value;

    if (places > capacite) {
      this.sessionForm
        .get('placesDisponibles')
        ?.setErrors({ exceedsCapacity: true });
    } else {
      this.sessionForm.get('placesDisponibles')?.setErrors(null);
    }

    this.sessionForm.get('placesDisponibles')?.updateValueAndValidity();
  }

  loadFormations(): void {
    this.loading = true;
    this.apiService
      .findAllFormations()
      .pipe(
        finalize(() => (this.loading = false)),
        catchError((err) => {
          this.error = true;
          this.errorMessage = 'Erreur lors du chargement des formations';
          console.error(err);
          return of([]);
        })
      )
      .subscribe((data) => (this.formations = data));
  }

  loadSalles(): void {
    this.apiService.getAllSalles().subscribe({
      next: (data) => (this.salles = data),
      error: (err) => {
        this.error = true;
        this.errorMessage = 'Erreur lors du chargement des salles';
        console.error(err);
      },
    });
  }

  loadUtilisateurs(): void {
    this.apiService.findAll_4().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        forkJoin({
          formateursInternes: this.apiService.findFormateurinterne(),
          formateursExternes: this.apiService.findFormateurexterne(),
          etudiants: this.apiService.findEtudiants(),
        }).subscribe({
          next: ({ formateursInternes, formateursExternes, etudiants }) => {
            this.formateurs = [...formateursInternes, ...formateursExternes];
            this.etudiants = etudiants;
            this.userGroups = [
              { name: 'Formateurs internes', users: formateursInternes },
              { name: 'Formateurs externes', users: formateursExternes },
              { name: 'Étudiants', users: etudiants },
            ];
            this.updateFilteredUsers();
          },
          error: (err) => {
            this.error = true;
            this.errorMessage =
              'Erreur lors du chargement des utilisateurs par rôle';
            console.error(err);
          },
        });
      },
      error: (err) => {
        this.error = true;
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        console.error(err);
      },
    });
  }

  loadSessionData(): void {
    if (!this.sessionId) return;
    this.loading = true;
    this.apiService
      .findById_1(this.sessionId)
      .pipe(
        finalize(() => (this.loading = false)),
        catchError((err) => {
          this.error = true;
          this.errorMessage = 'Erreur lors du chargement de la session';
          console.error(err);
          return of(null);
        })
      )
      .subscribe((session) => {
        if (session) {
          // Formater les dates pour l'input datetime-local
          const formatForInput = (dateString: string) => {
            if (!dateString) return null;
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16); // Format YYYY-MM-DDTHH:MM
          };

          this.sessionForm.patchValue({
            ...session,
            dateDebut: session.dateDebut
              ? formatForInput(session.dateDebut)
              : null,
            dateFin: session.dateFin ? formatForInput(session.dateFin) : null,
          });

          this.selectedUtilisateurs = this.utilisateurs.filter((u) =>
            session.utilisateursIds?.includes(u.id)
          );
          this.updateFilteredUsers();
        }
      });
  }

  onCapaciteChange(): void {
    const capacite = this.sessionForm.get('capacite')?.value;
    if (capacite && !this.sessionForm.get('placesDisponibles')?.dirty) {
      this.sessionForm.get('placesDisponibles')?.setValue(capacite);
    }
    this.validatePlaces();
  }

  updateFilteredUsers(): void {
    this.filteredUtilisateurs = this.utilisateurs.filter(
      (u) => !this.selectedUtilisateurs.some((sel) => sel.id === u.id)
    );
  }

  setSelectionMode(mode: 'search' | 'liste' | 'role'): void {
    this.selectionMode = mode;
  }

  addUtilisateur(utilisateur: any): void {
    if (!this.isUserSelected(utilisateur.id)) {
      this.selectedUtilisateurs.push({ ...utilisateur });
      this.sessionForm.patchValue({
        utilisateursIds: this.selectedUtilisateurs.map((u) => u.id),
      });
      this.resetSelectionFields();
    }
  }

  removeUtilisateur(utilisateur: any): void {
    this.selectedUtilisateurs = this.selectedUtilisateurs.filter(
      (u) => u.id !== utilisateur.id
    );
    this.sessionForm.patchValue({
      utilisateursIds: this.selectedUtilisateurs.map((u) => u.id),
    });
    this.updateFilteredUsers();
  }

  searchUtilisateurs(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchUtilisateurText = searchText;
    this.filteredUtilisateurs = this.utilisateurs.filter(
      (user) =>
        (user.nom?.toLowerCase().includes(searchText) ||
          user.prenom?.toLowerCase().includes(searchText)) &&
        !this.isUserSelected(user.id)
    );
  }

  onUtilisateurSelect(event: Event): void {
    const userId = (event.target as HTMLSelectElement).value;
    if (userId) {
      const user = this.utilisateurs.find((u) => String(u.id) === userId);
      if (user) {
        this.addUtilisateur(user);
      }
      // Reset select
      (event.target as HTMLSelectElement).value = '';
    }
  }

  onFormateurSelect(event: Event): void {
    const formateurId = (event.target as HTMLSelectElement).value;
    if (formateurId) {
      const formateur = this.formateurs.find(
        (f) => String(f.id) === formateurId
      );
      if (formateur) {
        this.addUtilisateur(formateur);
      }
      // Reset select
      (event.target as HTMLSelectElement).value = '';
    }
  }

  onEtudiantSelect(event: Event): void {
    const etudiantId = (event.target as HTMLSelectElement).value;
    if (etudiantId) {
      const etudiant = this.etudiants.find((e) => String(e.id) === etudiantId);
      if (etudiant) {
        this.addUtilisateur(etudiant);
      }
      // Reset select
      (event.target as HTMLSelectElement).value = '';
    }
  }

  isUserSelected(userId: string | number): boolean {
    return this.selectedUtilisateurs.some(
      (u) => String(u.id) === String(userId)
    );
  }

  resetSelectionFields(): void {
    this.searchUtilisateurText = '';
    this.updateFilteredUsers();
  }

  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    Object.values(this.sessionForm.controls).forEach((control) => {
      control.markAsTouched();
    });

    // Vérifier si le formulaire est valide
    if (this.sessionForm.invalid) {
      this.error = true;
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    this.submitting = true;
    this.error = false;
    this.successMessage = '';

    // Préparer les données pour l'API
    const formData = this.sessionForm.value;

    // Convertir les dates au format ISO
    const sessionDto: SessionsDto = {
      formationId: formData.formationId,
      dateDebut: new Date(formData.dateDebut).toISOString(),
      dateFin: new Date(formData.dateFin).toISOString(),
      capacite: formData.capacite,
      placesDisponibles: formData.placesDisponibles,
      salleId: formData.salleId,
      utilisateursIds: formData.utilisateursIds,
      // Inclure l'ID seulement pour les modifications
      ...(this.sessionId &&
        !this.isNewSession && { sessionId: this.sessionId }),
    };

    console.log("Données envoyées à l'API:", sessionDto);

    // Choisir la méthode d'API appropriée (création ou modification)
    const apiCall = this.isNewSession
      ? this.apiService.save_1(sessionDto)
      : this.apiService.updatesessions(sessionDto);

    // Effectuer l'appel API
    apiCall
      .pipe(
        finalize(() => {
          this.submitting = false;
        }),
        catchError((error) => {
          this.error = true;

          // Gestion des erreurs plus détaillée
          if (error.error) {
            if (error.error.message) {
              this.errorMessage = error.error.message;
            } else if (error.error.errors) {
              // Concaténer toutes les erreurs de validation du serveur
              this.errorMessage = Object.values(error.error.errors).join(', ');
            } else {
              this.errorMessage = "Erreur lors de l'enregistrement";
            }
          } else {
            this.errorMessage = 'Erreur de connexion au serveur';
          }

          console.error('Erreur API:', error);
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.successMessage = this.isNewSession
              ? 'Session créée avec succès'
              : 'Session mise à jour avec succès';

            // Redirection après 1.5 secondes
            // Redirection vers la page précédente après 1.5 secondes
            setTimeout(() => {
              this.location.back();
            }, 1500);
          }
        },
        error: (error) => {
          // Cette partie est déjà gérée par catchError, mais on peut ajouter des logs supplémentaires
          console.error('Erreur dans subscribe:', error);
        },
      });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.sessionForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.sessionForm.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Ce champ est requis';
    if (control.errors['min']) return `Minimum ${control.errors['min'].min}`;
    if (field === 'heureDebut' || field === 'heureFin') {
      if (this.sessionForm.errors?.['heureInvalid'])
        return "L'heure de fin doit être après l'heure de début";
    }
    if (control.errors['dateInvalid'])
      return 'La date de fin doit être après la date de début';
    if (control.errors['exceedsCapacity'])
      return 'Les places disponibles ne peuvent pas dépasser la capacité';
    return 'Champ invalide';
  }

  onCancel(): void {
    this.router.navigate(['/sessions']);
  }

  goBack(): void {
    this.location.back();
  }

  resetForm(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
      if (this.isNewSession) {
        this.sessionForm.reset({
          formationId: null,
          capacite: 0,
          placesDisponibles: 0,
          salleId: null,
          utilisateursIds: [],
          heureDebut: null,
          heureFin: null,
        });
        this.selectedUtilisateurs = [];
        this.updateFilteredUsers();
      } else {
        this.loadSessionData();
      }
    }
  }
}
