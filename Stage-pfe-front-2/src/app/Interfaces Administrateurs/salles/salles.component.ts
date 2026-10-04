import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SallesDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';

@Component({
  selector: 'app-salles',
  templateUrl: './salles.component.html',
  styleUrls: ['./salles.component.css'],
})
export class SallesComponent implements OnInit {
  loading: boolean = false;
  searchTerm: string = '';
  salles: SallesDto[] = [];
  showDeletePopup: boolean = false;
  salleToDelete: number | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadSalles();
  }

  loadSalles(): void {
    this.loading = true;
    this.apiService.getAllSalles().subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        this.salles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des salles:', error);
        this.loading = false;
      },
    });
  }

  openDeletePopup(id: number): void {
    this.salleToDelete = id;
    this.showDeletePopup = true;
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false;
    this.salleToDelete = null;
  }

  confirmDelete(): void {
    if (this.salleToDelete) {
      this.loading = true;
      this.apiService.delete_4(this.salleToDelete).subscribe({
        next: () => {
          this.loadSalles(); // Recharger la liste après suppression
          this.closeDeletePopup();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.loading = false;
          this.closeDeletePopup();
          alert('Erreur lors de la suppression de la salle');
        },
      });
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['dashboard/salles/edit-salle']);
    console.log('Navigating to add salle ', this.router.navigate);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['dashboard/salles/edit-salle', id]);
  }

  getFilteredSalles(): SallesDto[] {
    if (!this.searchTerm.trim()) {
      return this.salles;
    }

    return this.salles.filter(
      (salle) =>
        salle.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        salle.equipement?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
