import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/cni-api/src/services';

@Component({
  selector: 'app-nouvelle-session',
  templateUrl: './nouvelle-session.component.html',
  styleUrls: ['./nouvelle-session.component.css'],
})
export class NouvelleSessionComponent implements OnInit {
  formations: any[] = [];
  salles: any[] = [];
  utilisateurs: any[] = [];
  sessionForm: FormGroup;
  isSubmitting = false; // Flag to track form submission state
  // Propriétés pour le popup
  showSuccessPopup: boolean = false;
  successMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService, // Use a single instance of ApiService
    private router: Router
  ) {
    this.sessionForm = this.fb.group(
      {
        capacite: [null, [Validators.required, Validators.min(1)]],
        dateDebut: [null, Validators.required],
        dateFin: [null, Validators.required],
        formationId: ['', Validators.required], // Initialize with empty string
        placesDisponibles: [null, [Validators.required, Validators.min(0)]],
        salleId: ['', Validators.required], // Initialize with empty string
        utilisateurId: ['', Validators.required], // Initialize with empty string
      },
      { validators: this.dateValidator }
    ); // Add custom validator
  }

  ngOnInit(): void {
    this.loadFormations();
    this.loadSalles();
    this.loadUtilisateurs();
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

  loadFormations(): void {
    this.apiService.findAllFormations().subscribe({
      next: (data) => (this.formations = data),
      error: (error) => {
        console.error('Erreur lors du chargement des formations', error);
      },
    });
  }

  loadSalles(): void {
    this.apiService.getAllSalles().subscribe({
      next: (data) => (this.salles = data),
      error: (error) => {
        console.error('Erreur lors du chargement des salles', error);
      },
    });
  }

  loadUtilisateurs(): void {
    this.apiService.findAll_4().subscribe({
      next: (data) => (this.utilisateurs = data),
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
      },
    });
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
  }

  onSubmit(): void {
    if (this.sessionForm.valid) {
      this.isSubmitting = true;
      console.log('Envoi des données...', this.sessionForm.value);

      this.apiService.save_1(this.sessionForm.value).subscribe({
        next: (response) => {
          console.log('Session créée avec succès', response);
          this.successMessage =
            'La session de formation a été créée avec succès!';
          this.showSuccessPopup = true;
          this.router.navigate(['/sessions']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Erreur lors de la création de la session', error);
          if (error.error) {
            console.log("Détails de l'erreur :", error.error);
          }
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.sessionForm.controls).forEach((field) => {
        const control = this.sessionForm.get(field);
        control?.markAsTouched();
      });
    }
  }
  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['/sessions']);
  }

  onCancel(): void {
    this.router.navigate(['/sessions']);
  }
}
