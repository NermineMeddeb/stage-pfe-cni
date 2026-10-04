// sessions.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  finalize,
  catchError,
} from 'rxjs/operators';
import { FormationsDto, SessionsDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';
import { Router } from '@angular/router';

interface SessionViewModel extends SessionsDto {
  formation?: FormationsDto;
  capacityPercentage: number;
  statusClass: string;
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css'],
})
export class SessionsComponent implements OnInit, OnDestroy {
  sessions: SessionViewModel[] = [];
  filteredSessions: SessionViewModel[] = [];
  formations: FormationsDto[] = [];

  loading = false;
  error = false;
  
  // Ajout des variables pour les notifications
  showSuccessAlert = false;
  successMessage = '';

  searchForm: FormGroup;
  sortKey = 'dateDebut';
  sortDirection = 'asc';

  private destroy$ = new Subject<void>();
  private searchTerms = new Subject<string>();

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      formation: [''],
      dateStart: [''],
      dateEnd: [''],
      availablePlacesMin: [''],
    });
  }

  ngOnInit(): void {
    this.initSearchListener();
    this.loadAllData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initSearchListener(): void {
    // Listen to form value changes
    this.searchForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private loadAllData(): void {
    this.loading = true;
    this.error = false;

    forkJoin({
      sessions: this.apiService.findAll_2(),
      formations: this.apiService.findAllFormations(),
    })
      .pipe(
        finalize(() => (this.loading = false)),
        catchError((err) => {
          this.error = true;
          //  this.toastr.error('Erreur lors du chargement des données', 'Erreur');
          console.error('Error loading data:', err);
          throw err;
        })
      )
      .subscribe(({ sessions, formations }) => {
        this.formations = formations;

        // Map sessions with formation data and computed properties
        this.sessions = sessions.map((session) => {
          const formation = formations.find(
            (f) => f.id === session.formationId
          );
          const placesOccupied =
            (session.capacite || 0) - (session.placesDisponibles || 0);
          const capacityPercentage = session.capacite
            ? (placesOccupied / session.capacite) * 100
            : 0;

          return {
            ...session,
            formation,
            capacityPercentage,
            statusClass: this.getCapacityStatusClass(capacityPercentage),
          };
        });

        this.filteredSessions = [...this.sessions];
        this.sortSessions();
      });
  }

  applyFilters(): void {
    const { searchTerm, formation, dateStart, dateEnd, availablePlacesMin } =
      this.searchForm.value;

    this.filteredSessions = this.sessions.filter((session) => {
      // Filter by search term
      const matchesSearch =
        !searchTerm ||
        session.formation?.titre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(session.sessionId).includes(searchTerm);

      // Filter by formation
      const matchesFormation =
        !formation || session.formationId === Number(formation); // Ensure type match

      // Filter by date range
      const sessionStartDate = session.dateDebut
        ? new Date(session.dateDebut)
        : null;
      const sessionEndDate = session.dateFin ? new Date(session.dateFin) : null;
      const filterStartDate = dateStart ? new Date(dateStart) : null;
      const filterEndDate = dateEnd ? new Date(dateEnd) : null;

      const matchesDateRange =
        (!filterStartDate ||
          (sessionStartDate && sessionStartDate >= filterStartDate)) &&
        (!filterEndDate || (sessionEndDate && sessionEndDate <= filterEndDate));

      // Filter by available places
      const minPlaces = availablePlacesMin
        ? parseInt(availablePlacesMin, 10)
        : 0;
      const matchesAvailablePlaces =
        !availablePlacesMin || (session.placesDisponibles || 0) >= minPlaces;

      return (
        matchesSearch &&
        matchesFormation &&
        matchesDateRange &&
        matchesAvailablePlaces
      );
    });

    // Log filtered sessions to check if filtering is correct
    console.log(this.filteredSessions);

    this.sortSessions();
  }

  sortSessions(key?: string): void {
    if (key) {
      this.sortDirection =
        this.sortKey === key && this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.sortKey = key;
    }

    this.filteredSessions.sort((a, b) => {
      let comparison = 0;

      switch (this.sortKey) {
        case 'formation':
          comparison = this.compareValues(
            a.formation?.titre,
            b.formation?.titre
          );
          break;
        case 'dateDebut':
          comparison = this.compareDates(a.dateDebut, b.dateDebut);
          break;
        case 'dateFin':
          comparison = this.compareDates(a.dateFin, b.dateFin);
          break;
        case 'placesDisponibles':
          comparison = this.compareValues(
            a.placesDisponibles,
            b.placesDisponibles
          );
          break;
        default:
          comparison = 0;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  private compareValues(a?: any, b?: any): number {
    if (a === b) return 0;
    if (a === undefined) return 1;
    if (b === undefined) return -1;
    return a < b ? -1 : 1;
  }

  private compareDates(a?: string, b?: string): number {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  }

  getCapacityStatusClass(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  }

  formatDate(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  editSession(session: SessionViewModel): void {
    this.router.navigate(['/edit', session.sessionId]);
  }
  viewSessionDetails(session: SessionViewModel): void {
    this.router.navigate(['/dashboard/sessions/details-sessions', session.sessionId]);
  }
  delite(session: any) {
    if (!session.sessionId) {
      console.error("L'ID de la session est manquant", session);
      this.showError("La suppression a échoué: ID de session manquant");
      return;
    }

    // Ajout d'une confirmation avant suppression
    if (confirm(`Êtes-vous sûr de vouloir supprimer la session #${session.sessionId} ?`)) {
      this.loading = true; // Indiquer le chargement pendant la suppression
      
      this.apiService.delete_1(session.sessionId).subscribe(
        (response) => {
          console.log('Session supprimée avec succès', response);
          
          // Mise à jour de la liste des sessions
          this.sessions = this.sessions.filter(s => s.sessionId !== session.sessionId);
          this.filteredSessions = this.filteredSessions.filter(s => s.sessionId !== session.sessionId);
          
          // Afficher le message de succès
          this.showSuccess(`La session #${session.sessionId} a été supprimée avec succès`);
          
          this.loading = false;
        },
        (error) => {
          console.error('Erreur lors de la suppression de la session', error);
          this.showError("La suppression a échoué. Veuillez réessayer.");
          this.loading = false;
        }
      );
    }
  }

  // Méthodes pour gérer les notifications
  showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessAlert = true;
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 5000);
  }
  
  showError(message: string): void {
    this.error = true;
    this.successMessage = message;
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
      this.error = false;
    }, 5000);
  }
  
  hideAlert(): void {
    this.showSuccessAlert = false;
    this.error = false;
  }

  refreshData(): void {
    this.loadAllData();
  }
  
  navigte(): void {
    console.log('navigating to new session');
    this.router.navigate(['dashboard/nouvelle-sessions']);
  }
}