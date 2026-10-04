import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ThemesDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';

@Component({
  selector: 'app-nouvelle-formation',
  templateUrl: './nouvelle-formation.component.html',
  styleUrls: ['./nouvelle-formation.component.css'],
})
export class NouvelleFormationComponent implements OnInit {
  formationForm: FormGroup;
  themes: ThemesDto[] = [];
  niveaux: string[] = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
  statuts: string[] = ['Actif', 'Inactif', 'Complet'];
  uploadedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private themesService: ApiService,
    private formationService: ApiService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.formationForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      photo: [''],
      duree: [null, Validators.required],
      prix: [null, Validators.required],
      niveau: ['', Validators.required],
      prerequis: [''],
      statut: ['Actif', Validators.required],
      placesMax: [null, Validators.required],
      objectifsFormation: [''],
      programmeDetaille: [''],
      themeId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadThemes();
  }

  loadThemes(): void {
    this.themesService.findAll_3().subscribe({
      next: (data) => {
        this.themes = data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les thèmes',
        });
        console.error('Erreur lors du chargement des thèmes:', err);
      },
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
      this.formationForm.patchValue({ photo: file.name });

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.formationForm.valid) {
      const formValues = this.formationForm.value;
      const formData = new FormData();

      // Correctly structure the theme object as JSON string
      const themeObject = {
        id: formValues.themeId,
      };

      // Add basic form fields
      formData.append('titre', formValues.titre);
      formData.append('description', formValues.description);
      formData.append('duree', formValues.duree);
      formData.append('prix', formValues.prix);
      formData.append('niveau', formValues.niveau);
      formData.append('prerequis', formValues.prerequis || '');
      formData.append('statut', formValues.statut);
      formData.append('placesMax', formValues.placesMax);
      formData.append(
        'objectifsFormation',
        formValues.objectifsFormation || ''
      );
      formData.append('programmeDetaille', formValues.programmeDetaille || '');
      formData.append('theme', JSON.stringify(themeObject));

      // Add file if uploaded
      if (this.uploadedFile) {
        formData.append('photoFile', this.uploadedFile);
      }

      console.log('Sending formation with theme ID:', formValues.themeId);

      this.formationService.saveFormation(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Formation ajoutée avec succès',
          });
          this.router.navigate(['/formations']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail:
              err.error.message ||
              'Une erreur est survenue lors de la création de la formation',
          });
          console.error('Erreur lors de la création de la formation:', err);
        },
      });
    } else {
      this.markFormGroupTouched(this.formationForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez corriger les erreurs dans le formulaire',
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm(): void {
    this.formationForm.reset();
    this.formationForm.patchValue({ statut: 'Actif' });
    this.imagePreview = null;
    this.uploadedFile = null;
  }

  cancel(): void {
    this.router.navigate(['/formations']);
  }

  getFormControlError(controlName: string): string {
    const control = this.formationForm.get(controlName);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return 'Ce champ est obligatoire';
      }
      if (control.errors?.['maxlength']) {
        return `Ce champ ne doit pas dépasser ${control.errors['maxlength'].requiredLength} caractères`;
      }
    }
    return '';
  }
}
