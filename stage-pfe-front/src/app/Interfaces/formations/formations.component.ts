import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/cni-api/src/services';
import { FormationsDto, ThemesDto } from 'src/cni-api/src/models';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css'],
})
export class FormationsComponent implements OnInit {
  formationsDto: FormationsDto[] = [];
  formationsAffichees: FormationsDto[] = [];
  searchInput: string = '';
  formationForm: FormGroup;
  selectedTheme: string = '';
  selectedThemeId: number = 0;
  themes: ThemesDto[] = [];

  // Pagination parameters
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalItems: number = 0;
  errorMsg: string = '';
  loading: boolean = true;
  isEditMode: boolean = false;
  editModalVisible: boolean = false;

  constructor(
    private service: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formationForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.chargerFormations();
    this.chargerthemes();
  }

  chargerthemes(): void {
    this.loadthemes();
  }

  chargerFormations(): void {
    this.loadItems();
  }

  loadthemes(): void {
    this.loading = true;
    this.service.findAll_3().subscribe({
      next: (data: ThemesDto[]) => {
        this.themes = data;
        this.loading = false;
      },
      error: (error) => {
        this.handleError(
          "Une erreur s'est produite lors du chargement des themes"
        );
        this.loading = false;
      },
    });
  }

  loadItems(): void {
    this.loading = true;
    if (this.selectedThemeId === 0) {
      this.service.findAllFormations().subscribe({
        next: (data: FormationsDto[]) => {
          this.handleFormationsResponse(data);
          this.loading = false;
        },
        error: (error) => {
          this.handleError(
            "Une erreur s'est produite lors du chargement des formations"
          );
          this.loading = false;
        },
      });
    } else {
      this.service.findByStatut(this.selectedThemeId.toString()).subscribe({
        next: (data: FormationsDto[]) => {
          this.handleFormationsResponse(data);
          this.loading = false;
        },
        error: (error) => {
          this.handleError(
            "Une erreur s'est produite lors du chargement des formations par thème"
          );
          this.loading = false;
        },
      });
    }
  }

  private handleFormationsResponse(data: FormationsDto[]): void {
    this.formationsDto = data;
    this.totalItems = data.length;
    this.updateFormationsAffichees();
  }

  private handleError(message: string): void {
    this.errorMsg = message;
    console.error(message);
  }

  updateFormationsAffichees(): void {
    let filteredFormations = this.formationsDto;

    // Apply search filter if there's a search term
    if (this.searchInput) {
      filteredFormations = filteredFormations.filter((formation) =>
        formation.titre?.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.formationsAffichees = filteredFormations.slice(startIndex, endIndex);
    this.totalItems = filteredFormations.length;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchInput = input.value;
    this.currentPage = 1; // Reset to first page when searching
    this.updateFormationsAffichees();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateFormationsAffichees();
  }

  applyFilter(themeName: string): void {
    const selected = this.themes.find((t) => t.nom === themeName);
    if (selected) {
      this.selectedTheme = selected.nom!;
      this.selectedThemeId = selected.id!;
      this.currentPage = 1; // Reset pagination
      this.loadItems();
    }
  }

  nouvelleformation(): void {
    // Navigate directly to the add page
    this.router.navigate(['/dashboard/nouvelle-formation']);
  }

  editFormation(formation: FormationsDto): void {
    // Pre-fill the form with formation data
    console.log('Formation à éditer:', formation);
    this.formationForm.patchValue({
      id: formation.id,
      name: formation.titre,
      description: formation.description,
      duration: formation.duree,
      price: formation.prix,
    });

    this.isEditMode = true;
    this.editModalVisible = true;
  }

  saveFormation(): void {
    if (this.formationForm.invalid) {
      this.errorMsg = 'Veuillez remplir tous les champs requis';
      return;
    }

    const formValues = this.formationForm.value;

    // Convert form values to FormationsDto
    const formationToUpdate: FormationsDto = {
      id: formValues.id,
      titre: formValues.name,
      description: formValues.description,
      duree: formValues.duration,
      prix: formValues.price,
    };

    if (this.isEditMode && formationToUpdate.id) {
      // Update existing formation
      this.service.saveFormation(formationToUpdate).subscribe({
        next: () => {
          this.loadItems(); // Reload formations after update
          this.closeModal();
        },
        error: (error) => {
          this.errorMsg = 'Erreur lors de la mise à jour de la formation';
          console.error('Erreur:', error);
        },
      });
    } else {
      // Create new formation
      // You might need to implement a separate create method or modify saveFormation to handle both
      this.service.saveFormation(formationToUpdate).subscribe({
        next: () => {
          this.loadItems();
          this.closeModal();
        },
        error: (error) => {
          this.errorMsg = 'Erreur lors de la création de la formation';
          console.error('Erreur:', error);
        },
      });
    }
  }

  closeModal(): void {
    this.editModalVisible = false;
    this.formationForm.reset();
    this.isEditMode = false;
  }
}
