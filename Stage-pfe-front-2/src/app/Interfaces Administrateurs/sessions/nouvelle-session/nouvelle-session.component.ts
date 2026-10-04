import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { forkJoin, finalize } from 'rxjs';

@Component({
  selector: 'app-nouvelle-session',
  templateUrl: './nouvelle-session.component.html',
  styleUrls: ['./nouvelle-session.component.css'],
})
export class NouvelleSessionComponent implements OnInit {
  formations: any[] = [];
  salles: any[] = [];
  utilisateurs: any[] = [];
  formateurs: any[] = [];
  etudiants: any[] = [];
  selectedUtilisateurs: any[] = [];
  filteredUtilisateurs: any[] = [];
  searchUtilisateurText: string = '';
  selectionMode: 'search' | 'liste' | 'role' = 'search';
  userGroups: any[] = [];
  dataLoaded: boolean = false;
  isNewSession: boolean = true; // Ajout d'une propriété pour différencier nouveau/modification
  loading: boolean = false; // Pour gérer l'état de chargement
  error: boolean = false; // Pour gérer les erreurs
  errorMessage: string = ''; // Message d'erreur
  submitting: boolean = false; // État de soumission du formulaire
  successMessage: string = ''; // Message de succès
  showSuccessPopup: boolean = false;

  // Nouvelles propriétés pour la validation de salle
  sessionsExistantes: any[] = [];
  salleConflicts: boolean = false;
  conflictMessage: string = '';
  currentSessionId: any = null; // Pour les modifications

  sessionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.sessionForm = this.fb.group(
      {
        capacite: [null, [Validators.required, Validators.min(1)]],
        dateDebut: [null, Validators.required],
        dateFin: [null, Validators.required],
        formationId: ['', Validators.required],
        placesDisponibles: [null, [Validators.required, Validators.min(0)]],
        salleId: ['', Validators.required],
        utilisateursIds: [[], Validators.required],
      },
      { validators: this.dateValidator }
    );
  }

  ngOnInit(): void {
    this.loading = true;
    Promise.all([
      this.loadFormations(),
      this.loadSalles(),
      this.loadUtilisateurs(),
      this.loadSessionsExistantes(), // Nouvelle méthode
    ]).finally(() => {
      this.loading = false;
    });
  }

  // Définir le mode de sélection
  setSelectionMode(mode: 'search' | 'liste' | 'role'): void {
    this.selectionMode = mode;
  }

  // Custom validator to ensure end date is after start date
  dateValidator(group: FormGroup): { [key: string]: any } | null {
    const dateDebut = group.get('dateDebut')?.value;
    const dateFin = group.get('dateFin')?.value;

    if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
      return { dateInvalid: true };
    }
    return null;
  }

  loadFormations(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.findAllFormations().subscribe({
        next: (data) => {
          this.formations = data;
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des formations', error);
          this.handleError('Impossible de charger les formations.');
          reject(error);
        },
      });
    });
  }

  loadSalles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getAllSalles().subscribe({
        next: (data) => {
          this.salles = data;
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des salles', error);
          this.handleError('Impossible de charger les salles.');
          reject(error);
        },
      });
    });
  }

  // Nouvelle méthode pour charger les sessions existantes
  loadSessionsExistantes(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Remplacez 'getAllSessions' par le nom de votre méthode API pour récupérer toutes les sessions
      this.apiService.findAll_2().subscribe({
        next: (data) => {
          this.sessionsExistantes = data;
          resolve();
        },
        error: (error) => {
          console.error(
            'Erreur lors du chargement des sessions existantes',
            error
          );
          // Ne pas bloquer le chargement pour cette erreur
          resolve();
        },
      });
    });
  }

  loadUtilisateurs(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Charger tous les utilisateurs d'abord
      this.apiService.findAll_4().subscribe({
        next: (data) => {
          this.utilisateurs = data;

          // Utiliser forkJoin pour attendre que toutes les requêtes API soient terminées
          forkJoin({
            formateursInternes: this.apiService.findFormateurinterne(),
            formateursExternes: this.apiService.findFormateurexterne(),
            etudiants: this.apiService.findEtudiants(),
          }).subscribe({
            next: (results) => {
              // Initialiser les tableaux
              this.formateurs = [
                ...results.formateursInternes,
                ...results.formateursExternes,
              ];
              this.etudiants = results.etudiants;

              // Mettre à jour les groupes d'utilisateurs
              this.userGroups = [
                {
                  name: 'Formateurs internes',
                  users: results.formateursInternes,
                },
                {
                  name: 'Formateurs externes',
                  users: results.formateursExternes,
                },
                { name: 'Étudiants', users: results.etudiants },
              ];

              this.dataLoaded = true;
              this.updateFilteredUsers();
              resolve();
            },
            error: (error) => {
              console.error(
                "Erreur lors du chargement des types d'utilisateurs",
                error
              );
              this.handleError(
                "Impossible de charger les types d'utilisateurs."
              );
              reject(error);
            },
          });
        },
        error: (error) => {
          console.error('Erreur lors du chargement des utilisateurs', error);
          this.handleError('Impossible de charger les utilisateurs.');
          reject(error);
        },
      });
    });
  }

  // Méthode pour vérifier la disponibilité de la salle
  checkSalleDisponibilite(): void {
    const salleId = this.sessionForm.get('salleId')?.value;
    const dateDebut = this.sessionForm.get('dateDebut')?.value;
    const dateFin = this.sessionForm.get('dateFin')?.value;

    if (!salleId || !dateDebut || !dateFin) {
      return;
    }

    // Convertir les dates en objets Date pour la comparaison
    const nouvelleDateDebut = new Date(dateDebut);
    const nouvelleDateFin = new Date(dateFin);

    // Vérifier les conflits avec les sessions existantes
    const conflits = this.sessionsExistantes.filter((session) => {
      // Ignorer la session actuelle si on modifie (pas nouveau)
      if (!this.isNewSession && session.id === this.currentSessionId) {
        return false;
      }

      // Vérifier si c'est la même salle
      if (String(session.salleId) !== String(salleId)) {
        return false;
      }

      const sessionDateDebut = new Date(session.dateDebut);
      const sessionDateFin = new Date(session.dateFin);

      // Vérifier si les périodes se chevauchent
      return (
        (nouvelleDateDebut >= sessionDateDebut &&
          nouvelleDateDebut < sessionDateFin) ||
        (nouvelleDateFin > sessionDateDebut &&
          nouvelleDateFin <= sessionDateFin) ||
        (nouvelleDateDebut <= sessionDateDebut &&
          nouvelleDateFin >= sessionDateFin)
      );
    });

    if (conflits.length > 0) {
      this.salleConflicts = true;
      const salle = this.salles.find((s) => String(s.id) === String(salleId));
      const nomSalle = salle ? salle.nom : 'Salle sélectionnée';

      this.conflictMessage = `${nomSalle} est déjà réservée pour une autre session durant cette période.`;

      // Ajouter une erreur au contrôle de la salle
      this.sessionForm.get('salleId')?.setErrors({
        ...this.sessionForm.get('salleId')?.errors,
        salleOccupee: true,
      });
    } else {
      this.salleConflicts = false;
      this.conflictMessage = '';

      // Retirer l'erreur de conflit si elle existe
      const salleControl = this.sessionForm.get('salleId');
      if (salleControl?.hasError('salleOccupee')) {
        const errors = { ...salleControl.errors };
        delete errors['salleOccupee'];

        // Si plus d'erreurs, mettre null, sinon garder les autres erreurs
        salleControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }
  }

  // Méthode pour obtenir la liste des sessions en conflit (optionnel - pour affichage détaillé)
  getConflictingSessions(): any[] {
    const salleId = this.sessionForm.get('salleId')?.value;
    const dateDebut = this.sessionForm.get('dateDebut')?.value;
    const dateFin = this.sessionForm.get('dateFin')?.value;

    if (!salleId || !dateDebut || !dateFin) {
      return [];
    }

    const nouvelleDateDebut = new Date(dateDebut);
    const nouvelleDateFin = new Date(dateFin);

    return this.sessionsExistantes.filter((session) => {
      if (!this.isNewSession && session.id === this.currentSessionId) {
        return false;
      }

      if (String(session.salleId) !== String(salleId)) {
        return false;
      }

      const sessionDateDebut = new Date(session.dateDebut);
      const sessionDateFin = new Date(session.dateFin);

      return (
        (nouvelleDateDebut >= sessionDateDebut &&
          nouvelleDateDebut < sessionDateFin) ||
        (nouvelleDateFin > sessionDateDebut &&
          nouvelleDateFin <= sessionDateFin) ||
        (nouvelleDateDebut <= sessionDateDebut &&
          nouvelleDateFin >= sessionDateFin)
      );
    });
  }

  // Méthodes à appeler lors des changements de salle ou de dates
  onSalleChange(): void {
    // Vérifier la disponibilité après changement de salle
    setTimeout(() => {
      this.checkSalleDisponibilite();
    }, 100);
  }

  onDateChange(): void {
    // Vérifier la disponibilité après changement de dates
    setTimeout(() => {
      this.checkSalleDisponibilite();
    }, 100);
  }

  // Helper method to get form control for easier access in template
  get formControls() {
    return this.sessionForm.controls;
  }

  // Auto-populate places disponibles with capacity when capacity changes
  onCapaciteChange(): void {
    const capacite = this.sessionForm.get('capacite')?.value;
    if (capacite && !this.sessionForm.get('placesDisponibles')?.dirty) {
      this.sessionForm.get('placesDisponibles')?.setValue(capacite);
    }
    // Valider également les places après modification de la capacité
    this.validatePlaces();
  }

  // Méthode pour rechercher des utilisateurs
  searchUtilisateurs(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchUtilisateurText = searchText;

    if (!searchText) {
      this.filteredUtilisateurs = [];
    } else {
      // Filtrer par texte de recherche et exclure les déjà sélectionnés
      this.filteredUtilisateurs = this.utilisateurs.filter(
        (user) =>
          (user.nom?.toLowerCase().includes(searchText) ||
            user.prenom?.toLowerCase().includes(searchText)) &&
          !this.isUserSelected(user.id)
      );
    }
  }

  // Mettre à jour la liste filtrée d'utilisateurs
  updateFilteredUsers(): void {
    // Filtrer les utilisateurs qui ne sont pas déjà sélectionnés
    this.filteredUtilisateurs = this.utilisateurs.filter(
      (user) => !this.isUserSelected(user.id)
    );
  }

  // Ajouter un utilisateur à la sélection
  addUtilisateur(utilisateur: any): void {
    // Vérifier si l'utilisateur n'est pas déjà dans la liste
    if (!this.isUserSelected(utilisateur.id)) {
      // Cloner l'utilisateur pour éviter les références partagées
      const userToAdd = { ...utilisateur };

      // Ajouter utilisateur à la liste de sélection
      this.selectedUtilisateurs.push(userToAdd);

      // Mettre à jour les IDs dans le formulaire
      const utilisateursIds = this.selectedUtilisateurs.map((u) => u.id);
      this.sessionForm.patchValue({ utilisateursIds });
      this.sessionForm.get('utilisateursIds')?.markAsDirty();

      // Réinitialiser les champs de sélection
      this.resetSelectionFields();

      // Pour le debug
      console.log('Utilisateur ajouté:', userToAdd);
      console.log('Liste utilisateurs:', this.selectedUtilisateurs);
    }
  }

  // Réinitialiser les champs après sélection
  resetSelectionFields(): void {
    setTimeout(() => {
      this.searchUtilisateurText = '';

      // Réinitialiser les sélecteurs de listes déroulantes (DOM)
      const selects = document.querySelectorAll('select.form-control');
      selects.forEach((select) => {
        (select as HTMLSelectElement).selectedIndex = 0;
      });

      this.updateFilteredUsers();
    }, 300);
  }

  // Méthode pour la sélection depuis la liste complète
  onUtilisateurSelect(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    if (selectedId) {
      // Convertir l'ID en même type si nécessaire
      const utilisateur = this.utilisateurs.find(
        (u) => String(u.id) === String(selectedId)
      );
      if (utilisateur) {
        this.addUtilisateur(utilisateur);
      }
    }
  }

  // Méthode pour la sélection d'un formateur
  onFormateurSelect(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    if (selectedId) {
      // Convertir l'ID en même type si nécessaire
      const formateur = this.formateurs.find(
        (f) => String(f.id) === String(selectedId)
      );
      if (formateur) {
        this.addUtilisateur(formateur);
        console.log('Formateur sélectionné:', formateur);
      } else {
        console.error('Formateur non trouvé avec ID:', selectedId);
        console.log('Liste des formateurs:', this.formateurs);
      }
    }
  }

  // Méthode pour la sélection d'un étudiant
  onEtudiantSelect(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    if (selectedId) {
      // Convertir l'ID en même type si nécessaire
      const etudiant = this.etudiants.find(
        (e) => String(e.id) === String(selectedId)
      );
      if (etudiant) {
        this.addUtilisateur(etudiant);
        console.log('Étudiant sélectionné:', etudiant);
      } else {
        console.error('Étudiant non trouvé avec ID:', selectedId);
        console.log('Liste des étudiants:', this.etudiants);
      }
    }
  }

  // Vérifier si un utilisateur est déjà sélectionné
  isUserSelected(userId: string | number): boolean {
    return this.selectedUtilisateurs.some(
      (u) => String(u.id) === String(userId)
    );
  }

  // Retirer un utilisateur de la sélection
  removeUtilisateur(utilisateur: any): void {
    // Retirer utilisateur de la liste
    this.selectedUtilisateurs = this.selectedUtilisateurs.filter(
      (u) => u.id !== utilisateur.id
    );

    // Mettre à jour les IDs dans le formulaire
    const utilisateursIds = this.selectedUtilisateurs.map((u) => u.id);
    this.sessionForm.patchValue({ utilisateursIds });
    // Si la liste est vide, marquer comme invalid
    if (utilisateursIds.length === 0) {
      this.sessionForm.get('utilisateursIds')?.setErrors({ required: true });
    }

    // Mettre à jour la liste filtrée
    this.updateFilteredUsers();
  }

  // Vérifier si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const control = this.sessionForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Afficher le message d'erreur approprié pour un champ - MISE À JOUR
  getErrorMessage(field: string): string {
    const control = this.sessionForm.get(field);

    if (!control) return '';

    if (control.hasError('required')) {
      return 'Ce champ est obligatoire';
    }

    if (control.hasError('min')) {
      if (field === 'capacite') {
        return "La capacité doit être d'au moins 1 personne";
      }
      if (field === 'placesDisponibles') {
        return 'Les places disponibles ne peuvent pas être négatives';
      }
      return `La valeur minimum est ${control.errors?.['min']?.min}`;
    }

    if (field === 'dateDebut' || field === 'dateFin') {
      if (this.sessionForm.hasError('dateInvalid')) {
        return 'La date de fin doit être après la date de début';
      }
    }

    if (field === 'placesDisponibles' && control.hasError('exceedsCapacity')) {
      return 'Les places disponibles ne peuvent pas dépasser la capacité totale';
    }

    if (field === 'utilisateursIds' && control.hasError('required')) {
      return 'Veuillez sélectionner au moins un participant';
    }

    // Nouvelle validation pour la salle occupée
    if (field === 'salleId' && control.hasError('salleOccupee')) {
      return (
        this.conflictMessage ||
        'Cette salle est déjà réservée pour cette période'
      );
    }

    return 'Champ invalide';
  }

  // Validation des places disponibles
  validatePlaces(): void {
    const capacite = this.sessionForm.get('capacite')?.value;
    const placesDisponibles = this.sessionForm.get('placesDisponibles')?.value;

    if (capacite && placesDisponibles > capacite) {
      this.sessionForm
        .get('placesDisponibles')
        ?.setErrors({ exceedsCapacity: true });
    }
  }

  // Gestion des erreurs
  handleError(message: string): void {
    this.error = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.error = false;
      this.errorMessage = '';
    }, 5000);
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/dashboard/sessions']);
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.sessionForm.reset({
      capacite: null,
      dateDebut: null,
      dateFin: null,
      formationId: '',
      placesDisponibles: null,
      salleId: '',
      utilisateursIds: [],
    });

    this.selectedUtilisateurs = [];
    this.searchUtilisateurText = '';
    this.selectionMode = 'search';
    this.salleConflicts = false;
    this.conflictMessage = '';
    this.resetSelectionFields();
  }

  onSubmit(): void {
    // Vérifier d'abord la disponibilité de la salle
    this.checkSalleDisponibilite();

    if (this.sessionForm.valid && !this.salleConflicts) {
      this.submitting = true;

      // Récupérer les valeurs du formulaire
      const formValues = this.sessionForm.value;

      // Convertir les dates en objets Date
      const dateDebutObj = new Date(formValues.dateDebut);
      const dateFinObj = new Date(formValues.dateFin);

      // Créer l'objet au format attendu par l'API
      const requestData = {
        sessionId: 0, // 0 pour une nouvelle session
        formationId: +formValues.formationId,
        utilisateursIds: this.selectedUtilisateurs.map((u) => +u.id),
        salleId: +formValues.salleId,

        // Formater les dates en ISO format complet "YYYY-MM-DDTHH:MM:SS"
        dateDebut: dateDebutObj.toISOString().split('.')[0],
        dateFin: dateFinObj.toISOString().split('.')[0],

        capacite: +formValues.capacite,
        placesDisponibles: +formValues.placesDisponibles,
      };

      console.log('Envoi des données au format attendu:', requestData);

      this.apiService.save_1(requestData).subscribe({
        next: (response) => {
          console.log('Session créée avec succès', response);
          this.successMessage =
            'La session de formation a été créée avec succès!';
          this.submitting = false;

          // Afficher le popup de succès au lieu de naviguer directement
          this.showSuccessPopup = true;
        },
        error: (error) => {
          this.submitting = false;
          console.error('Erreur lors de la création de la session', error);

          let errorMessage =
            'Une erreur est survenue lors de la création de la session';

          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          this.handleError(errorMessage);
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.sessionForm.controls).forEach((field) => {
        const control = this.sessionForm.get(field);
        control?.markAsTouched();
      });

      // Afficher un message si conflit de salle
      if (this.salleConflicts) {
        this.handleError(this.conflictMessage);
      }
    }
  }

  // Méthode pour fermer le popup de succès et naviguer vers la liste des sessions
  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.goBack(); // Utilise la méthode goBack() existante pour naviguer vers /sessions
  }
}
