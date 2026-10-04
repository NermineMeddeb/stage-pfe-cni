import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateursDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';
@Component({
  selector: 'app-administrateurs',
  templateUrl: './administrateurs.component.html',
  styleUrls: ['./administrateurs.component.css']
})
export class AdministrateursComponent implements OnInit {

listClient: Array<UtilisateursDto> = [];
  errorMsg = '';
  loading = false;
  searchTerm = '';

  constructor(
    private router: Router,
    private clientServices: ApiService
  ) { }

  ngOnInit(): void {
    this.findAllClients();
  }

  findAllClients(): void {
    this.loading = true;
    this.clientServices.findAdministrateurs()
      .subscribe({
        next: (clients) => {
          this.listClient = clients;
          this.loading = false;
        },
        error: (error) => {
          this.errorMsg = 'Erreur lors de la récupération des étudiants.';
          console.error(error);
          this.loading = false;
        }
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
    return this.listClient.filter(client =>
      client.nom?.toLowerCase().includes(this.searchTerm) ||
      client.prenom?.toLowerCase().includes(this.searchTerm) ||
      client.email?.toLowerCase().includes(this.searchTerm)
    );
  }

}
