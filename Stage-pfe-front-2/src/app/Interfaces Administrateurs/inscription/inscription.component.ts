import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/cni-api/src/services/api.service';
import {
  FormationsDto,
  InscriptionDto,
  SessionsDto,
  UtilisateursDto,
} from 'src/cni-api/src/models';
import { Router } from '@angular/router';

interface StatisticsData {
  totalInscriptions: number;
  enAttente: number;
  confirmees: number;
  annulees: number;
  terminees: number;
  trendPercentage?: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout?: any;
}

@Component({
  selector: 'app-inscriptions-management',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class InscriptionComponent implements OnInit {
  // Propriétés pour le mode d'affichage
  viewMode: 'list' | 'dashboard' | 'calendar' = 'list';
  displayMode: 'cards' | 'table' = 'table';
  calendarDisplayMode: 'month' | 'week' | 'day' = 'month';

  // Propriétés pour les données
  inscriptions: InscriptionDto[] = [];
  filteredInscriptions: InscriptionDto[] = [];
  etudiants: UtilisateursDto[] = [];
  formateurs: UtilisateursDto[] = [];
  formations: FormationsDto[] = [];
  sessions: SessionsDto[] = [];
  filteredSessions: SessionsDto[] = [];

  // Propriétés pour les modales
  showInscriptionModal = false;
  showDeleteModal = false;
  showDetailsModal = false;
  isEditMode = false;
  selectedInscription: InscriptionDto | null = null;
  inscriptionToDelete: InscriptionDto | null = null;

  // Propriétés pour le formulaire
  inscriptionForm: FormGroup;
  isSubmitting = false;
  availablePlaces: number | null = null;

  // Propriétés pour la recherche et le filtrage
  filterKeyword = '';
  showFilterMenu = false;
  selectedFormationId: number | null = null;
  statusFilters: { [key: string]: boolean } = {};
  dateRange = { start: '', end: '' };
  statusOptions = ['En attente', 'Confirmée', 'Annulée', 'Terminée'];

  // Propriétés pour le tri et la pagination
  sortColumn = 'dateInscription';
  sortDirection: 'asc' | 'desc' = 'desc';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Propriétés pour le calendrier
  currentMonth = new Date();

  // Propriétés pour le tableau de bord
  stats: StatisticsData = {
    totalInscriptions: 0,
    enAttente: 0,
    confirmees: 0,
    annulees: 0,
    terminees: 0,
    trendPercentage: 0,
  };

  // Propriétés pour les notifications
  toasts: Toast[] = [];
  currentInscriptionId: number | null = null;

  // État de l'application
  isLoading = false;
  dataLoaded = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router
  ) {
    // Initialisation du formulaire d'inscription
    this.inscriptionForm = this.fb.group({
      id: [null],
      etudiantId: ['', Validators.required],
      sessionId: ['', Validators.required],
      dateInscription: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      statut: ['En attente', Validators.required],
    });
  }

  ngOnInit(): void {
    // Initialiser les filtres de statut
    this.statusOptions.forEach((status) => {
      this.statusFilters[status] = true;
    });

    // Charger toutes les données nécessaires
    this.loadAllData();

    // Initialiser les graphiques du tableau de bord
    this.initializeCharts();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.dataLoaded = false;

    // Utilisez forkJoin pour exécuter plusieurs requêtes en parallèle
    forkJoin({
      inscriptions: this.apiService.findAll_1(),
      etudiants: this.apiService.findAll_4(),
      formateurs: this.apiService.findFormateur(),
      formations: this.apiService.findAllFormations(),
      sessions: this.apiService.findAll_2(),
    }).subscribe({
      next: (result) => {
        this.inscriptions = result.inscriptions;
        this.etudiants = result.etudiants;
        this.formateurs = result.formateurs;
        this.formations = result.formations;
        this.sessions = result.sessions;

        // Appliquer le filtre initial et calculer les statistiques
        this.filterInscriptions();
        this.calculateStatistics();

        this.isLoading = false;
        this.dataLoaded = true;
        this.showToast('Données chargées avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données', error);
        this.isLoading = false;
        this.showToast('Erreur lors du chargement des données', 'error');
      },
    });
  }

  // Méthodes pour la gestion des inscriptions
  openAddModal(): void {
    this.router.navigate(['/dashboard/inscriptions/nouvelle-inscription']);
  }

  openEditModal(inscription: InscriptionDto): void {
    this.router.navigate([
      '/dashboard/inscriptions/nouvelle-inscription/' + inscription.id,
    ]);
  }

  closeModal(): void {
    this.showInscriptionModal = false;
    this.availablePlaces = null;
  }

  submitInscription(): void {}

  confirmDelete(inscription: InscriptionDto, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Empêche la propagation de l'événement
    }
    this.inscriptionToDelete = inscription;
    this.showDeleteModal = true;
    console.log('Modal de suppression ouverte:', this.showDeleteModal); // Débogage
  }

  cancelDelete(): void {
    this.inscriptionToDelete = null;
    this.showDeleteModal = false;
  }

  deleteInscription(): void {
    if (!this.inscriptionToDelete || !this.inscriptionToDelete.id) return;

    this.apiService.deleteInscription(this.inscriptionToDelete.id).subscribe({
      next: () => {
        // Supprimer l'inscription de la liste
        this.inscriptions = this.inscriptions.filter(
          (i) => i.id !== this.inscriptionToDelete?.id
        );
        this.filterInscriptions();
        this.calculateStatistics();
        this.cancelDelete();
        this.showToast('Inscription supprimée avec succès', 'success');
      },
      error: (error) => {
        console.error("Erreur lors de la suppression de l'inscription", error);
        this.showToast(
          "Erreur lors de la suppression de l'inscription",
          'error'
        );
      },
    });
  }
  // Méthode modifiée pour inclure le chemin assets dans l'URL de la photo
  getStudentPhoto(userId: number): string {
    const etudiant = this.etudiants.find((e) => e.id === userId);

    // Si l'étudiant a un nom de fichier photo, construire le chemin complet
    if (etudiant && etudiant.photo) {
      return `assets/${etudiant.photo}`;
    }

    // Sinon, retourner une image par défaut
    return 'assets/photos/default-user.png';
  }
  shouldShowPhoto(userId: number): boolean {
    return !!this.getStudentPhoto(userId);
  }
  viewDetails(inscription: InscriptionDto, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Empêche la propagation de l'événement
    }
    this.selectedInscription = inscription;
    this.showDetailsModal = true;
    console.log('Modal de détails ouverte:', this.showDetailsModal); // Débogage
  }
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedInscription = null;
  }

  // Méthodes pour les filtres et la recherche
  filterInscriptions(): void {
    let filtered = [...this.inscriptions];

    // Appliquer le filtre de recherche
    if (this.filterKeyword) {
      const keyword = this.filterKeyword.toLowerCase();
      filtered = filtered.filter((inscription) => {
        const etudiant = this.getEtudiantName(
          inscription.utilisateurId || 0
        ).toLowerCase();
        const formation = this.getFormationForSession(
          inscription.sessionId || 0
        ).toLowerCase();
        const statut = inscription.statut?.toLowerCase() || '';

        return (
          etudiant.includes(keyword) ||
          formation.includes(keyword) ||
          statut.includes(keyword)
        );
      });
    }

    // Appliquer le filtre de formation
    if (this.selectedFormationId !== null) {
      filtered = filtered.filter((inscription) => {
        const session = this.sessions.find(
          (s) => s.sessionId === inscription.sessionId
        );
        return session && session.formationId === this.selectedFormationId;
      });
    }

    // Appliquer les filtres de statut
    const activeStatuses = Object.entries(this.statusFilters)
      .filter(([_, isActive]) => isActive)
      .map(([status]) => status);

    if (activeStatuses.length < this.statusOptions.length) {
      filtered = filtered.filter(
        (inscription) =>
          inscription.statut && activeStatuses.includes(inscription.statut)
      );
    }

    // Appliquer le filtre de période
    if (this.dateRange.start && this.dateRange.end) {
      const startDate = new Date(this.dateRange.start);
      const endDate = new Date(this.dateRange.end);
      endDate.setHours(23, 59, 59); // Pour inclure le jour de fin

      filtered = filtered.filter((inscription) => {
        if (!inscription.dateInscription) return false; // Exclure les inscriptions sans date

        const inscriptionDate = new Date(inscription.dateInscription);
        return inscriptionDate >= startDate && inscriptionDate <= endDate;
      });
    }

    // Appliquer le tri
    filtered = this.sortInscriptions(filtered);

    // Calculer le nombre total de pages
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Appliquer la pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredInscriptions = filtered.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  sortInscriptions(inscriptions: InscriptionDto[]): InscriptionDto[] {
    return [...inscriptions].sort((a, b) => {
      let valA, valB;

      switch (this.sortColumn) {
        case 'id':
          valA = a.id || 0;
          valB = b.id || 0;
          break;
        case 'etudiant':
          valA = this.getEtudiantName(a.utilisateurId || 0);
          valB = this.getEtudiantName(b.utilisateurId || 0);
          break;
        case 'formation':
          valA = this.getFormationForSession(a.sessionId || 0);
          valB = this.getFormationForSession(b.sessionId || 0);
          break;
        case 'statut':
          valA = a.statut || '';
          valB = b.statut || '';
          break;
        case 'dateInscription':
        default:
          valA = a.dateInscription ? new Date(a.dateInscription).getTime() : 0;
          valB = b.dateInscription ? new Date(b.dateInscription).getTime() : 0;
          break;
      }

      const comparison =
        typeof valA === 'string'
          ? valA.localeCompare(valB as string)
          : (valA as number) - (valB as number);

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filterInscriptions();
  }

  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }

  onFormationSelect(): void {
    // Filtrer les sessions en fonction de la formation sélectionnée
    if (this.selectedFormationId !== null) {
      this.filteredSessions = this.sessions.filter(
        (s) => s.formationId === this.selectedFormationId
      );
    } else {
      this.filteredSessions = this.sessions;
    }

    this.filterInscriptions();
  }

  clearSearch(): void {
    this.filterKeyword = '';
    this.filterInscriptions();
  }

  resetFilters(): void {
    this.filterKeyword = '';
    this.selectedFormationId = null;
    this.dateRange = { start: '', end: '' };

    // Réinitialiser les filtres de statut
    this.statusOptions.forEach((status) => {
      this.statusFilters[status] = true;
    });

    this.filterInscriptions();
  }

  applyFilters(): void {
    this.showFilterMenu = false;
    this.filterInscriptions();
  }

  setDisplayMode(mode: 'cards' | 'table'): void {
    this.displayMode = mode;
  }

  // Méthodes pour la pagination
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.filterInscriptions();
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.inscriptions.length / this.itemsPerPage);
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }

  // Méthodes pour le calendrier
  prevMonth(): void {
    const date = new Date(this.currentMonth);
    date.setMonth(date.getMonth() - 1);
    this.currentMonth = date;
  }

  nextMonth(): void {
    const date = new Date(this.currentMonth);
    date.setMonth(date.getMonth() + 1);
    this.currentMonth = date;
  }

  setCalendarMode(mode: 'month' | 'week' | 'day'): void {
    this.calendarDisplayMode = mode;
  }

  // Méthodes utilitaires
  checkAvailability(): void {
    const sessionId = this.inscriptionForm.get('sessionId')?.value;
    if (!sessionId) {
      this.availablePlaces = null;
      return;
    }

    this.http
      .get<number>(`/api/sessions/${sessionId}/available-places`)
      .subscribe({
        next: (places) => {
          this.availablePlaces = places;
        },
        error: (error) => {
          console.error(
            'Erreur lors de la récupération des places disponibles',
            error
          );
          this.availablePlaces = null;
        },
      });
  }

  getEtudiantName(id: number): string {
    const etudiant = this.etudiants.find((e) => e.id === id);
    return etudiant ? `${etudiant.nom} ${etudiant.prenom}` : 'Étudiant inconnu';
  }

  getFormationForSession(sessionId: number): string {
    const session = this.sessions.find((s) => s.sessionId === sessionId);
    if (!session) return 'Formation inconnue';

    const formation = this.formations.find((f) => f.id === session.formationId);
    return formation && formation.titre
      ? formation.titre
      : 'Formation inconnue';
  }

  getSessionDate(sessionId: number): Date | string {
    const session = this.sessions.find((s) => s.sessionId === sessionId);
    return session && session.dateDebut ? session.dateDebut : '';
  }

  getSessionStartDate(sessionId: number): Date | string {
    const session = this.sessions.find((s) => s.sessionId === sessionId);
    return session && session.dateDebut !== undefined ? session.dateDebut : '';
  }

  getSessionEndDate(sessionId: number): Date | string {
    const session = this.sessions.find((s) => s.sessionId === sessionId);
    return session && session.dateFin ? session.dateFin : '';
  }

  getFormateurName(sessionId: number): string {
    const session = this.sessions.find((s) => s.sessionId === sessionId);
    if (!session) return 'Formateur inconnu';

    const formateur = this.formateurs.find(
      (f) => f.id === session.utilisateursIds
    );
    return formateur
      ? `${formateur.nom} ${formateur.prenom}`
      : 'Formateur inconnu';
  }

  getInitials(userId: number): string {
    const etudiant = this.etudiants.find((e) => e.id === userId);
    if (!etudiant || !etudiant.nom || !etudiant.prenom) return '?'; // Vérifier si nom et prenom sont définis

    return `${etudiant.nom.charAt(0)}${etudiant.prenom.charAt(
      0
    )}`.toUpperCase();
  }

  getStudentInfo(userId: number): UtilisateursDto | undefined {
    return this.etudiants.find((e) => e.id === userId);
  }

  selectInscription(inscription: InscriptionDto): void {
    this.currentInscriptionId = inscription.id || null;
  }

  // Méthodes pour le tableau de bord
  calculateStatistics(): void {
    // Calculer les statistiques de base
    this.stats.totalInscriptions = this.inscriptions.length;

    // Compter par statut
    this.stats.enAttente = this.inscriptions.filter(
      (i) => i.statut === 'En attente'
    ).length;
    this.stats.confirmees = this.inscriptions.filter(
      (i) => i.statut === 'Confirmée'
    ).length;
    this.stats.annulees = this.inscriptions.filter(
      (i) => i.statut === 'Annulée'
    ).length;
    this.stats.terminees = this.inscriptions.filter(
      (i) => i.statut === 'Terminée'
    ).length;

    // Calculer la tendance (comparaison avec le mois précédent)
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    // Fonction générique pour obtenir le nombre d'inscriptions par mois
    const getInscriptionsForMonth = (month: number, year: number): number => {
      return this.inscriptions.filter((i) => {
        // Vérifier que la date d'inscription est valide
        const date = i.dateInscription ? new Date(i.dateInscription) : null;

        // Si la date est valide, comparer le mois et l'année
        return date && date.getMonth() === month && date.getFullYear() === year;
      }).length;
    };

    // Nombre d'inscriptions pour ce mois-ci et le mois dernier
    const inscriptionsThisMonth = getInscriptionsForMonth(
      today.getMonth(),
      today.getFullYear()
    );
    const inscriptionsLastMonth = getInscriptionsForMonth(
      lastMonth.getMonth(),
      lastMonth.getFullYear()
    );

    // Affichage des résultats ou calcul de la tendance
    console.log(`Inscriptions ce mois-ci: ${inscriptionsThisMonth}`);
    console.log(`Inscriptions le mois dernier: ${inscriptionsLastMonth}`);

    if (inscriptionsLastMonth > 0) {
      this.stats.trendPercentage = Math.round(
        ((inscriptionsThisMonth - inscriptionsLastMonth) /
          inscriptionsLastMonth) *
          100
      );
    } else {
      this.stats.trendPercentage = inscriptionsThisMonth > 0 ? 100 : 0;
    }
  }

  initializeCharts(): void {
    // Cette méthode serait implémentée pour initialiser les graphiques
    // avec Chart.js ou une autre bibliothèque de graphiques
    setTimeout(() => {
      // Simulation d'initialisation de graphiques
      console.log('Graphiques initialisés');
    }, 500);
  }

  // Méthodes pour les notifications
  showToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ): void {
    const id = Date.now();
    const toast: Toast = { id, message, type };

    this.toasts.push(toast);

    // Auto-dismiss après 5 secondes
    toast.timeout = setTimeout(() => {
      this.dismissToast(id);
    }, 5000);
  }

  dismissToast(id: number): void {
    const index = this.toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      const toast = this.toasts[index];
      if (toast.timeout) {
        clearTimeout(toast.timeout);
      }
      this.toasts.splice(index, 1);
    }
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
      default:
        return 'fa-info-circle';
    }
  }

  // Méthodes pour le changement de vue
  switchViewMode(mode: 'list' | 'dashboard' | 'calendar'): void {
    this.viewMode = mode;
  }

  // Méthode pour l'exportation
  exportToCSV(): void {
    // Implémenter l'exportation des données au format CSV
    this.showToast('Export CSV en cours de développement', 'info');
  } // Propriétés à ajouter
  showNotificationModal = false;
  currentNotification: { type: string; message: string } | null = null;

  // Méthodes à ajouter
  showNotification(type: string, message: string) {
    this.currentNotification = { type, message };
    this.showNotificationModal = true;
    // Fermeture automatique après 3 secondes
    setTimeout(() => {
      this.closeNotificationModal();
    }, 3000);
  }

  closeNotificationModal() {
    this.showNotificationModal = false;
    setTimeout(() => {
      this.currentNotification = null;
    }, 300); // délai pour permettre l'animation de fermeture
  }

  getNotificationIcon(type: string | undefined): string {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-info-circle';
    }
  }

  getNotificationTitle(type: string | undefined): string {
    switch (type) {
      case 'success':
        return 'Succès';
      case 'error':
        return 'Erreur';
      case 'warning':
        return 'Attention';
      case 'info':
        return 'Information';
      default:
        return 'Notification';
    }
  }
}
