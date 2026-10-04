import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/cni-api/src/services';

interface SallesDto {
  id?: number;
  nom?: string;
  capacite?: number;
  equipement?: string;
  statut?: string;
}

@Component({
  selector: 'app-salles',
  templateUrl: './salles.component.html',
  styleUrls: ['./salles.component.css']
})
export class SallesComponent implements OnInit {
   loading: boolean = false;
   searchTerm: string = '';
   salles: SallesDto[] = [];

   constructor(private sallesService: ApiService) {}

   ngOnInit(): void {
     this.loadSalles();
   }

   loadSalles(): void {
     this.loading = true;
     this.sallesService.getAllSalles().subscribe({
       next: (data) => {
         console.log('Données reçues:', data);
         this.salles = data; // Correction ici
         this.loading = false;
       },
       error: (error) => {
         console.error('Erreur lors du chargement des salles:', error);
         this.loading = false;
       }
     });
   }
}
