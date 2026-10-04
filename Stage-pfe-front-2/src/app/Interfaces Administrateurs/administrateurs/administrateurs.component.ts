import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateursDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-administrateurs',
  templateUrl: './administrateurs.component.html',
  styleUrls: ['./administrateurs.component.css'],
})
export class AdministrateursComponent implements OnInit {
  listClient: Array<UtilisateursDto> = [];
  errorMsg = '';
  loading = false;
  searchTerm = '';

  constructor(private router: Router, private clientServices: ApiService) {}

  ngOnInit(): void {
    this.findAllClients();
  }

  findAllClients(): void {
    this.loading = true;

    forkJoin({
      personnels: this.clientServices.findPersonnelCNI(),
      administrateurs: this.clientServices.findAdministrateurs(),
    }).subscribe({
      next: ({ personnels, administrateurs }) => {
        this.listClient = [...personnels, ...administrateurs];
        this.loading = false;
      },
      error: (error) => {
        this.errorMsg = 'Erreur lors de la récupération des utilisateurs.';
        console.error(error);
        this.loading = false;
      },
    });
  }
  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findAllClients();
    } else {
      this.errorMsg = event;
    }
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
  }

  get filteredClients(): UtilisateursDto[] {
    return this.listClient.filter(
      (client) =>
        client.nom?.toLowerCase().includes(this.searchTerm) ||
        client.prenom?.toLowerCase().includes(this.searchTerm) ||
        client.email?.toLowerCase().includes(this.searchTerm)
    );
  }
  editClient(id: number): void {
    this.router.navigate(['/dashboard/nouveau-admin', id]);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/dashboard/admin/details-admin/', id]);
  }

  deleteClient(id: number): void {
    this.clientServices.delete_3(id).subscribe({
      next: () => {
        this.findAllClients();
      },
      error: (error) => {
        console.error('Error deleting formateur:', error);
        this.errorMsg = 'Erreur lors de la suppression du formateur.';
      },
    });
  }
}
