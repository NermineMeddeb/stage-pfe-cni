import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { ThemesDto, FormationsDto } from 'src/cni-api/src/models';
import { finalize } from 'rxjs/operators';

// Interface étendue pour inclure les propriétés d'UI
interface ThemeUIModel extends ThemesDto {
  color: string; // Renommé de hexColor à color
}

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css'],
})
export class ThemesComponent implements OnInit {
  themes: ThemeUIModel[] = [];
  formations: FormationsDto[] = [];
  filteredThemes: ThemeUIModel[] = [];
  selectedTheme: ThemeUIModel | null = null;
  themeForm: FormGroup;
  assignForm: FormGroup;

  // Palette de couleurs
  colorPalette: string[] = [
    '#3498db', // Bleu
    '#2ecc71', // Vert
    '#e74c3c', // Rouge
    '#f39c12', // Orange
    '#9b59b6', // Violet
    '#1abc9c', // Turquoise
    '#34495e', // Bleu marine
    '#d35400', // Orange foncé
    '#16a085', // Vert foncé
    '#8e44ad', // Violet foncé
  ];

  searchTerm: string = '';
  loading: boolean = false;
  loadingFormations: boolean = false;
  loadingSearch: boolean = false;
  loadingAssign: boolean = false;
  loadingSave: boolean = false;
  loadingDelete: boolean = false;
  isEditMode: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  showThemeModal: boolean = false;
  showAssignModal: boolean = false;
  showDeleteConfirm: boolean = false;
  themeDetailsVisible: boolean = false;

  currentThemeFormations: FormationsDto[] = [];

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.themeForm = this.fb.group({
      id: [null],
      nom: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.assignForm = this.fb.group({
      themeId: [null, Validators.required],
      formationId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadThemes();
    this.loadFormations();
  }

  // Fonction pour assigner une couleur aléatoire à partir de la palette
  assignRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colorPalette.length);
    return this.colorPalette[randomIndex];
  }

  // Pour les thèmes existants, garder leur couleur en mémoire
  loadThemes(): void {
    this.loading = true;
    this.apiService
      .findAll_3()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data: ThemesDto[]) => {
          // Conserver les couleurs existantes si possible
          const updatedThemes = data.map((theme) => {
            // Chercher si le thème existe déjà pour garder sa couleur
            const existingTheme = this.themes.find((t) => t.id === theme.id);
            return {
              ...theme,
              color: existingTheme
                ? existingTheme.color
                : this.assignRandomColor(),
            } as ThemeUIModel;
          });

          this.themes = updatedThemes;
          this.filteredThemes = [...this.themes];
        },
        error: (error) => {
          console.error('Erreur de chargement des thèmes:', error);
          this.errorMessage =
            'Une erreur est survenue lors du chargement des thèmes';
        },
      });
  }

  loadFormations(): void {
    this.loadingFormations = true;
    this.apiService
      .findAllFormations()
      .pipe(finalize(() => (this.loadingFormations = false)))
      .subscribe({
        next: (data: FormationsDto[]) => {
          this.formations = data;
        },
        error: (error) => {
          this.errorMessage =
            'Une erreur est survenue lors du chargement des formations';
        },
      });
  }

  searchThemes(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredThemes = [...this.themes];
      return;
    }

    this.loadingSearch = true;
    this.apiService
      .findByName(this.searchTerm)
      .pipe(finalize(() => (this.loadingSearch = false)))
      .subscribe({
        next: (data: ThemesDto[]) => {
          // Convertir les résultats en ThemeUIModel avec couleurs
          this.filteredThemes = data.map((theme) => {
            // Vérifier si ce thème existe déjà dans notre liste avec une couleur assignée
            const existingTheme = this.themes.find((t) => t.id === theme.id);
            return {
              ...theme,
              color: existingTheme
                ? existingTheme.color
                : this.assignRandomColor(),
            } as ThemeUIModel;
          });
        },
        error: (error) => {
          this.errorMessage = 'Une erreur est survenue lors de la recherche';
          this.filteredThemes = this.themes.filter((theme) =>
            theme.nom?.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        },
      });
  }

  // Initialiser le formulaire sans color/hexColor
  openThemeModal(theme?: ThemeUIModel): void {
    if (theme) {
      this.isEditMode = true;
      this.themeForm.patchValue({
        id: theme.id,
        nom: theme.nom,
      });
    } else {
      this.isEditMode = false;
      this.themeForm.reset();
    }
    this.showThemeModal = true;
  }

  closeThemeModal(): void {
    this.showThemeModal = false;
    this.themeForm.reset();
    this.errorMessage = '';
  }

  openAssignModal(theme?: ThemeUIModel): void {
    this.showAssignModal = true;
    this.assignForm.reset();

    // Si un thème est fourni, préselectionner ce thème
    if (theme && theme.id) {
      this.assignForm.patchValue({ themeId: theme.id });
    } else if (this.selectedTheme && this.selectedTheme.id) {
      this.assignForm.patchValue({ themeId: this.selectedTheme.id });
    }
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.assignForm.reset();
    this.errorMessage = '';
  }

  saveTheme(): void {
    if (this.themeForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
      return;
    }

    const themeData = this.themeForm.value;
    this.loadingSave = true;

    if (this.isEditMode && themeData.id) {
      // Créer un objet avec la structure attendue par updateTheme
      const themeId = themeData.id;

      // Créer un objet ThemesDto propre pour l'API
      const themeDto: ThemesDto = {
        id: themeId,
        nom: themeData.nom,
      };

      // Préparer les paramètres selon l'interface UpdateThemeParams
      const params: ApiService.UpdateThemeParams = {
        id: themeId,
        body: themeDto,
      };

      console.log('Paramètres envoyés à updateTheme:', params);

      this.apiService
        .updateTheme(params)
        .pipe(finalize(() => (this.loadingSave = false)))
        .subscribe({
          next: () => {
            this.successMessage = 'Thème mis à jour avec succès';
            this.loadThemes();
            this.closeThemeModal();
            setTimeout(() => (this.successMessage = ''), 3000);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du thème:', error);
            this.errorMessage =
              'Une erreur est survenue lors de la mise à jour du thème';
          },
        });
    } else {
      this.apiService
        .save_2({
          nom: themeData.nom,
        })
        .pipe(finalize(() => (this.loadingSave = false)))
        .subscribe({
          next: () => {
            this.successMessage = 'Thème créé avec succès';
            this.loadThemes();
            this.closeThemeModal();
            setTimeout(() => (this.successMessage = ''), 3000);
          },
          error: (error) => {
            console.error('Erreur lors de la création du thème:', error);
            this.errorMessage =
              'Une erreur est survenue lors de la création du thème';
          },
        });
    }
  }

  assignThemeToFormation(): void {
    if (this.assignForm.invalid) {
      this.errorMessage = 'Veuillez sélectionner un thème et une formation';
      return;
    }

    const { themeId, formationId } = this.assignForm.value;
    this.loadingAssign = true;

    // D'abord, récupérer les informations de la formation actuelle
    this.apiService.findFormationById(Number(formationId)).subscribe({
      next: (formation: FormationsDto) => {
        // Mettre à jour le themeId dans l'objet formation
        const updatedFormation: FormationsDto = {
          ...formation,
          themeId: Number(themeId),
        };

        console.log('Formation à mettre à jour:', updatedFormation);

        // Appeler updateFormation pour mettre à jour la formation avec le nouveau thème
        this.apiService
          .updateFormation(updatedFormation)
          .pipe(finalize(() => (this.loadingAssign = false)))
          .subscribe({
            next: () => {
              this.successMessage = 'Thème assigné à la formation avec succès';
              this.closeAssignModal();

              // Rechargez les formations si nous avons un thème sélectionné pour voir les mises à jour
              if (this.selectedTheme && this.themeDetailsVisible) {
                this.viewThemeDetails(this.selectedTheme);
              }

              setTimeout(() => (this.successMessage = ''), 3000);
            },
            error: (error) => {
              console.error("Erreur d'assignation:", error);
              this.errorMessage =
                "Une erreur est survenue lors de l'assignation du thème";
            },
          });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la formation:', error);
        this.errorMessage =
          'Impossible de récupérer les informations de la formation';
        this.loadingAssign = false;
      },
    });
  }

  confirmDelete(theme: ThemeUIModel): void {
    this.selectedTheme = theme;
    this.showDeleteConfirm = true;
  }

  deleteTheme(): void {
    if (!this.selectedTheme || !this.selectedTheme.id) {
      return;
    }

    this.loadingDelete = true;
    this.apiService
      .delete_2(this.selectedTheme.id)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Thème supprimé avec succès';
          this.loadThemes();
          this.showDeleteConfirm = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage =
            'Une erreur est survenue lors de la suppression du thème';
          this.showDeleteConfirm = false;
        },
      });
  }

  viewThemeDetails(theme: ThemeUIModel): void {
    this.selectedTheme = theme;
    this.themeDetailsVisible = true;
    this.currentThemeFormations = [];

    if (theme.id) {
      this.loading = true;
      this.apiService
        .findByThemeId(theme.id)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (formations: FormationsDto[]) => {
            this.currentThemeFormations = formations;
          },
          error: (error) => {
            this.errorMessage =
              'Une erreur est survenue lors du chargement des formations associées';
          },
        });
    }
  }

  closeThemeDetails(): void {
    this.themeDetailsVisible = false;
    this.selectedTheme = null;
  }

  checkThemeExists(themeName: string): void {
    this.apiService.themeExists(themeName).subscribe({
      next: (exists: boolean) => {
        if (exists) {
          this.errorMessage = `Un thème avec le nom "${themeName}" existe déjà`;
        } else {
          this.errorMessage = '';
        }
      },
    });
  }

  onThemeNameChange(): void {
    const themeName = this.themeForm.get('nom')?.value;
    if (themeName && themeName.length > 2 && !this.isEditMode) {
      this.checkThemeExists(themeName);
    }
  }
}
