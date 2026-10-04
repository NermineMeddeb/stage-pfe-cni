import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from 'src/cni-api/src/services';
import { FormationsDto, SessionsDto } from 'src/cni-api/src/models';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-edit-sessions',
  templateUrl: './edit-sessions.component.html',
  styleUrls: ['./edit-sessions.component.css']
})
export class EditSessionsComponent implements OnInit {

  sessionForm: FormGroup;
  sessionId: number | null = null;
  isNewSession = false;
  formations: FormationsDto[] = [];
  
  loading = false;
  submitting = false;
  error = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private location: Location
  ) {
    // Initialiser le formulaire avec des valeurs par défaut
    this.sessionForm = this.fb.group({
      formationId: [null, Validators.required],
      dateDebut: [null, Validators.required],
      dateFin: [null, Validators.required],
      capacite: [0, [Validators.required, Validators.min(1)]],
      placesDisponibles: [0, Validators.required],
      statut: ['PLANIFIE', Validators.required],
      lieu: ['', Validators.required],
      formateur: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Charger la liste des formations
    this.loadFormations();
    
    // Déterminer s'il s'agit d'une nouvelle session ou d'une modification
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id === 'new') {
        this.isNewSession = true;
      } else if (id) {
        this.sessionId = +id;
        this.loadSessionData();
      } else {
        this.error = true;
        this.errorMessage = "Identifiant de session manquant";
      }
    });
  }

  loadFormations(): void {
    this.loading = true;
    
    this.apiService.findAllFormations().pipe(
      finalize(() => this.loading = false),
      catchError(err => {
        this.error = true;
        this.errorMessage = "Erreur lors du chargement des formations";
        console.error('Error loading formations:', err);
        return of([]);
      })
    ).subscribe(formations => {
      this.formations = formations;
    });
  }

  loadSessionData(): void {
    if (!this.sessionId) return;
    
    this.loading = true;
    
    this.apiService.findById_1(this.sessionId).pipe(
      finalize(() => this.loading = false),
      catchError(err => {
        this.error = true;
        this.errorMessage = "Erreur lors du chargement des données de la session";
        console.error('Error loading session:', err);
        return of(null);
      })
    ).subscribe(session => {
      if (session) {
        // Préparer les dates pour le formulaire
        const dateDebut = session.dateDebut ? new Date(session.dateDebut).toISOString().split('T')[0] : null;
        const dateFin = session.dateFin ? new Date(session.dateFin).toISOString().split('T')[0] : null;
        
        // Remplir le formulaire avec les données existantes
        this.sessionForm.patchValue({
          formationId: session.formationId,
          dateDebut: dateDebut,
          dateFin: dateFin,
          capacite: session.capacite,
          placesDisponibles: session.placesDisponibles,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.sessionForm.invalid) {
      // Marquer tous les contrôles comme touchés pour afficher les erreurs
      Object.keys(this.sessionForm.controls).forEach(key => {
        const control = this.sessionForm.get(key);
        control?.markAsTouched();
      });
      
      this.errorMessage = "Veuillez corriger les erreurs du formulaire";
      return;
    }
    
    this.submitting = true;
    this.error = false;
    this.errorMessage = '';
    this.successMessage = '';
    
    const sessionData: SessionsDto = {
      ...this.sessionForm.value
    };
    
    // Si c'est une modification, ajouter l'ID
    if (!this.isNewSession && this.sessionId) {
      sessionData.sessionId = this.sessionId;
    }
    
    // Appeler l'API pour créer ou mettre à jour
    const apiCall = this.isNewSession
      ? this.apiService.save_1(sessionData)
      : this.apiService.save_1(sessionData);
    
    apiCall.pipe(
      finalize(() => this.submitting = false),
      catchError(err => {
        this.error = true;
        this.errorMessage = this.isNewSession
          ? "Erreur lors de la création de la session"
          : "Erreur lors de la mise à jour de la session";
        console.error('Error saving session:', err);
        return of(null);
      })
    ).subscribe(result => {
      if (result) {
        this.successMessage = this.isNewSession
          ? "Session créée avec succès"
          : "Session mise à jour avec succès";
        
        // Rediriger après un court délai
        setTimeout(() => {
          this.router.navigate(['/sessions']);
        }, 1500);
      }
    });
  }

  // Validation des dates
  validateDates(): void {
    const dateDebut = this.sessionForm.get('dateDebut')?.value;
    const dateFin = this.sessionForm.get('dateFin')?.value;
    
    if (dateDebut && dateFin) {
      const startDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
      
      if (endDate < startDate) {
        this.sessionForm.get('dateFin')?.setErrors({ dateInvalid: true });
      }
    }
  }

  // Validation des places disponibles
  validatePlaces(): void {
    const capacite = this.sessionForm.get('capacite')?.value;
    const placesDisponibles = this.sessionForm.get('placesDisponibles')?.value;
    
    if (capacite !== null && placesDisponibles !== null) {
      if (placesDisponibles > capacite) {
        this.sessionForm.get('placesDisponibles')?.setErrors({ exceedsCapacity: true });
      }
    }
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
      if (this.isNewSession) {
        this.sessionForm.reset({
          formationId: null,
          statut: 'PLANIFIE',
          capacite: 0,
          placesDisponibles: 0
        });
      } else {
        this.loadSessionData();
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  // Vérifier si un contrôle est invalide et touché
  isFieldInvalid(fieldName: string): boolean {
    const control = this.sessionForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const control = this.sessionForm.get(fieldName);
    
    if (!control) return '';
    if (!control.errors) return '';
    
    if (control.errors['required']) {
      return 'Ce champ est requis';
    }
    
    if (control.errors['min']) {
      return `La valeur minimale est ${control.errors['min'].min}`;
    }
    
    if (control.errors['dateInvalid']) {
      return 'La date de fin doit être postérieure à la date de début';
    }
    
    if (control.errors['exceedsCapacity']) {
      return 'Les places disponibles ne peuvent pas dépasser la capacité totale';
    }
    
    return 'Champ invalide';
  }

}
