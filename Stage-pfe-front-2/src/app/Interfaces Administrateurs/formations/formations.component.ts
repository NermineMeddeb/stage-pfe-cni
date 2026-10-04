import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { FormationsDto, ThemesDto } from 'src/cni-api/src/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css'],
})
export class FormationsComponent implements OnInit {
  formations: FormationsDto[] = [];
  formationsAffichees: FormationsDto[] = [];
  themes: ThemesDto[] = [];
  selectedTheme: string = '';
  loading: boolean = true;
  errorMsg: string | null = null;
  searchInput: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;

  // Selected theme ID
  selectedThemeId: number = 0;

  // Popup properties
  showDeleteConfirmation: boolean = false;
  showSuccessPopup: boolean = false;
  showErrorPopup: boolean = false;
  currentFormation: FormationsDto | null = null;
  popupMessage: string = '';

  constructor(private service: ApiService, private router: Router) {}

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
      this.service.findByThemeId(this.selectedThemeId).subscribe({
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
    this.formations = data; // Changed from formationsDto to formations
    this.totalItems = data.length;
    this.updateFormationsAffichees();
  }

  private handleError(message: string): void {
    this.errorMsg = message;
    console.error(message);
  }

  updateFormationsAffichees(): void {
    let filteredFormations = this.formations; // Changed from formationsDto to formations

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
    // Reset to all formations if we click on an already selected theme or "Tous" option
    if (this.selectedTheme === themeName || themeName === 'Tous') {
      this.selectedTheme = '';
      this.selectedThemeId = 0;
    } else {
      const selected = this.themes.find((t) => t.nom === themeName);
      if (selected) {
        this.selectedTheme = selected.nom!;
        this.selectedThemeId = selected.id!;
      }
    }

    this.currentPage = 1; // Reset pagination
    this.loadItems();
  }

  nouvelleformation(): void {
    // Navigate directly to the add page
    this.router.navigate(['/dashboard/nouvelle-formation']);
  }

  // Popup handling methods
  onShowDeleteConfirmation(formation: FormationsDto): void {
    this.currentFormation = formation;
    this.showDeleteConfirmation = true;
  }

  onShowSuccessPopup(message: string): void {
    this.popupMessage = message;
    this.showSuccessPopup = true;

    // Auto close and refresh data after success
    setTimeout(() => {
      this.showSuccessPopup = false;
      this.chargerFormations();
    }, 2000);
  }

  onShowErrorPopup(message: string): void {
    this.popupMessage = message;
    this.showErrorPopup = true;
  }

  confirmerSuppression(): void {
    if (this.currentFormation && this.currentFormation.id) {
      this.service // Changed from formationService to service
        .deleteFormation(this.currentFormation.id.toString())
        .subscribe({
          next: () => {
            this.showDeleteConfirmation = false;
            this.onShowSuccessPopup(
              'La formation a été supprimée avec succès.'
            );
            this.chargerFormations(); // Refresh the data
          },
          error: (error) => {
            this.showDeleteConfirmation = false;
            const errorMsg =
              error.error?.error || 'Erreur inconnue lors de la suppression';
            this.onShowErrorPopup(errorMsg);
          },
        });
    }
  }

  // Close popup methods
  fermerConfirmationPopup(): void {
    this.showDeleteConfirmation = false;
    this.currentFormation = null;
  }

  fermerSuccessPopup(): void {
    this.showSuccessPopup = false;
  }

  fermerErrorPopup(): void {
    this.showErrorPopup = false;
  }
}
