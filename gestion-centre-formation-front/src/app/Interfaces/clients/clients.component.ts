import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UtilisateursDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit, OnDestroy {
  listClient: Array<UtilisateursDto> = [];
  filteredClients: Array<UtilisateursDto> = [];
  errorMsg = '';
  loading = false;
  searchTerm = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private router: Router,
    private clientServices: ApiService
  ) {
    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.filterClients(term);
    });
  }

  ngOnInit(): void {
    this.findAllClients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  findAllClients(): void {
    this.loading = true;
    this.errorMsg = '';
    
    this.clientServices.findEtudiants()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clients) => {
          this.listClient = clients;
          this.filterClients(this.searchTerm);
          this.totalItems = clients.length;
          this.loading = false;
        },
        error: (error) => {
          this.errorMsg = 'Erreur lors de la récupération des étudiants. Veuillez réessayer.';
          console.error('Error fetching students:', error);
          this.loading = false;
        }
      });
  }

  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findAllClients();
    } else {
      this.errorMsg = event;
      setTimeout(() => this.errorMsg = '', 5000); // Clear error after 5 seconds
    }
  }

  onSearch(term: string): void {
    this.searchSubject.next(term.toLowerCase());
  }

  private filterClients(term: string): void {
    this.filteredClients = this.listClient.filter(client =>
      client.nom?.toLowerCase().includes(term) ||
      client.prenom?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term)
    );
    this.currentPage = 1; // Reset to first page when filtering
  }

  get paginatedClients(): UtilisateursDto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredClients.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
    // Add the missing onAddStudent method
    onAddStudent(): void {
      this.router.navigate(['/etudiants/nouveau']);
    }
}