import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/cni-api/src/services';
import { FormationsDto } from 'src/cni-api/src/models';

interface Theme {
  name: string;
  id: number;
}

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css'],
})
export class FormationsComponent implements OnInit {
  formationsDto: FormationsDto[] = [];
  formationsAffichees: FormationsDto[] = [];
  errorMsg: string = '';
  searchInput: string = '';

  // Pagination parameters
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // Themes hardcoded for now - can be replaced with API data later
  themes: Theme[] = [
    { name: 'Tous', id: 0 },
    { name: 'Développement', id: 1 },
    { name: 'Design', id: 2 },
    { name: 'Marketing', id: 3 },
    { name: 'Data Science', id: 4 },
  ];

  selectedTheme: string = 'Tous';
  selectedThemeId: number = 0;

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.chargerFormations();
  }

  chargerFormations(): void {
    this.loadItems();
  }

  loadItems(): void {
    if (this.selectedThemeId === 0) {
      this.service.findAllFormations().subscribe(
        (data: FormationsDto[]) => {
          this.handleFormationsResponse(data);
        },
        (error) => {
          this.handleError(
            "Une erreur s'est produite lors du chargement des formations"
          );
        }
      );
    } else {
      // Using findByStatut instead of searchFormations since that's what's available
      this.service.findByStatut(this.selectedThemeId.toString()).subscribe(
        (data: FormationsDto[]) => {
          this.handleFormationsResponse(data);
        },
        (error) => {
          this.handleError(
            "Une erreur s'est produite lors du chargement des formations par thème"
          );
        }
      );
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

  applyFilter(theme: string): void {
    const selected = this.themes.find((t) => t.name === theme);
    if (selected) {
      this.selectedTheme = selected.name;
      this.selectedThemeId = selected.id;
      this.currentPage = 1; // Reset pagination
      this.loadItems();
    }
  }
}
