import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormationsDto, ThemesDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';

@Component({
  selector: 'app-nouvelle-formation',
  templateUrl: './nouvelle-formation.component.html',
  styleUrls: ['./nouvelle-formation.component.css'],
  providers: [ConfirmationService],
})
export class NouvelleFormationComponent implements OnInit {
  formationForm!: FormGroup;
  themes: ThemesDto[] = [];
  niveaux: string[] = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
  statuts: string[] = ['Actif', 'Inactif', 'Complet'];
  uploadedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isEditMode: boolean = false;
  formationId: number | null = null;
  originalPhotoName: string | null = null; // Pour stocker le nom de la photo originale

  constructor(
    private fb: FormBuilder,
    private themesService: ApiService,
    private formationService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.formationForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      photo: [''],
      duree: [null, [Validators.required, Validators.min(0)]],
      prix: [null, [Validators.required, Validators.min(0)]],
      niveau: ['', Validators.required],
      prerequis: [''],
      statut: ['Actif', Validators.required],
      placesMax: [null, [Validators.required, Validators.min(0)]],
      objectifsFormation: [''],
      programmeDetaille: [''],
      themeId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadThemes();

    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.formationId = +id;
        this.loadFormationDetails(this.formationId);
      }
    });
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

  loadFormationDetails(id: number): void {
    this.formationService.findFormationById(id).subscribe({
      next: (formation: FormationsDto) => {
        this.populateFormWithFormationData(formation);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la formation',
        });
        console.error('Erreur lors du chargement de la formation:', err);
      },
    });
  }

  populateFormWithFormationData(formation: FormationsDto): void {
    console.log('Formation reçue:', formation);

    // Stocker le nom de la photo originale
    this.originalPhotoName = formation.photo || null;
    console.log('Photo originale stockée:', this.originalPhotoName);

    this.formationForm.patchValue({
      titre: formation.titre,
      description: formation.description,
      photo: formation.photo, // Garde le nom de la photo existante
      duree: formation.duree,
      prix: formation.prix,
      niveau: formation.niveau,
      prerequis: formation.prerequis,
      statut: formation.statut,
      placesMax: formation.placesMax,
      objectifsFormation: formation.objectifsFormation,
      programmeDetaille: formation.programmeDetaille,
      themeId: formation.themeId,
    });

    if (formation.photo) {
      const imageUrl = this.getImagePreviewUrl(formation.photo);
      console.log('URL image construite:', imageUrl);
      this.imagePreview = imageUrl;
    } else {
      console.log('Aucune photo trouvée dans la formation');
    }
  }

  getImagePreviewUrl(photo: string): string {
    console.log('Construction URL pour photo:', photo);

    // Si l'URL est déjà complète ou c'est une image en base64
    if (photo.startsWith('http') || photo.startsWith('data:')) {
      return photo;
    }

    // Essayez plusieurs chemins possibles
    // Option 1: Chemin relatif simple
    const path1 = `assets/affiche_formation/${photo}`;

    // Utilisez celui qui semble le plus probable selon votre structure de projet
    console.log('Chemin utilisé:', path1);
    return path1;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
      this.formationForm.patchValue({ photo: file.name });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.formationForm.valid) {
      const formValues = this.formationForm.value;

      // Validation du thème
      const themeExists = this.themes.some(
        (theme) => theme.id === formValues.themeId
      );
      if (!themeExists) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "Le thème sélectionné n'existe pas.",
        });
        return;
      }

      // Préparation des données pour l'API
      const formationData: FormationsDto = {
        id: this.isEditMode && this.formationId ? this.formationId : 0,
        titre: formValues.titre || '',
        description: formValues.description || '',
        duree: formValues.duree ? Number(formValues.duree) : 0,
        prix: formValues.prix ? Number(formValues.prix) : 0,
        placesMax: formValues.placesMax ? Number(formValues.placesMax) : 0,
        themeId: formValues.themeId ? Number(formValues.themeId) : 0,
        niveau: formValues.niveau || '',
        prerequis: formValues.prerequis || '',
        statut: formValues.statut || 'Actif',
        objectifsFormation: formValues.objectifsFormation || '',
        programmeDetaille: formValues.programmeDetaille || '',
        // CORRECTION: Gestion améliorée de la photo lors de la mise à jour
        photo: this.determinePhotoValue(formValues.photo),
      };

      console.log('Sending formation data:', formationData);
      console.log('JSON sent to API:', JSON.stringify(formationData));

      // Choix de l'appel API en fonction du mode
      const apiCall = this.isEditMode
        ? this.formationService.updateFormation(formationData)
        : this.formationService.saveFormation(formationData);

      apiCall.subscribe({
        next: (response) => {
          console.log('API Response:', response);

          // Message de confirmation
          this.confirmationService.confirm({
            message: this.isEditMode
              ? `Formation "${formValues.titre}" mise à jour avec succès`
              : `Nouvelle formation "${formValues.titre}" ajoutée avec succès`,
            header: 'Confirmation',
            icon: 'pi pi-check-circle',
            acceptLabel: 'OK',
            rejectVisible: false,
            accept: () => {
              this.router.navigate(['dashboard/formations'], {
                queryParams: {
                  success: true,
                  message: this.isEditMode ? 'update' : 'create',
                },
              });
            },
          });

          // Notification de succès
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: this.isEditMode
              ? 'Formation mise à jour avec succès'
              : 'Formation ajoutée avec succès',
            life: 3000,
          });
        },
        error: (err) => {
          // Gestion détaillée des erreurs
          console.error('Erreur détaillée:', err);
          console.log('Erreur complète:', JSON.stringify(err, null, 2));

          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail:
              err.error?.message ||
              'Une erreur est survenue lors de la création/modification de la formation',
            life: 5000,
          });

          // Proposition de réessayer
          this.confirmationService.confirm({
            message:
              'Un problème est survenu lors de la sauvegarde. Voulez-vous réessayer ?',
            header: 'Erreur',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Réessayer',
            rejectLabel: 'Annuler',
            accept: () => {
              this.onSubmit();
            },
          });
        },
      });
    } else {
      // Marquer tous les champs comme touchés en cas de formulaire invalide
      this.markFormGroupTouched(this.formationForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez corriger les erreurs dans le formulaire',
        life: 3000,
      });
    }
  }

  // NOUVELLE MÉTHODE: Détermine la valeur correcte pour la photo
  determinePhotoValue(formPhotoValue: string): string {
    // Si un nouveau fichier a été téléchargé
    if (this.uploadedFile) {
      return this.uploadedFile.name;
    }

    // En mode édition, si aucun fichier n'a été téléchargé, conserver la photo originale
    if (this.isEditMode && this.originalPhotoName) {
      return this.originalPhotoName;
    }

    // Sinon utiliser la valeur du formulaire ou chaîne vide
    return formPhotoValue || '';
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
    if (this.isEditMode && this.formationId) {
      this.loadFormationDetails(this.formationId);
    } else {
      this.formationForm.reset();
      this.formationForm.patchValue({ statut: 'Actif' });
      this.imagePreview = null;
      this.uploadedFile = null;
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/formations']);
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
      if (control.errors?.['min']) {
        return `La valeur minimale est ${control.errors['min'].min}`;
      }
    }
    return '';
  }
}
