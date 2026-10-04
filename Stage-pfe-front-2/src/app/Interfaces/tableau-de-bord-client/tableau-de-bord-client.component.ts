import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  FormationsDto,
  Notifications,
  SessionsDto,
  UtilisateursDto,
} from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { UserService } from 'src/cni-api/src/services/user/user.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface FormationSummary {
  id: number;
  titre: string;
  statut: string;
  progression: number;
  prochaineSessions?: SessionsDto;
  totalSessions: number;
  sessionsCompletes: number;
  categorie?: string;
}

@Component({
  selector: 'app-tableau-de-bord-client',
  templateUrl: './tableau-de-bord-client.component.html',
  styleUrls: ['./tableau-de-bord-client.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(10px)' })
        ),
      ]),
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class TableauDeBordClientComponent implements OnInit, AfterViewInit {
  // Charts
  @ViewChild('progressionChart') progressionChart!: ElementRef;
  @ViewChild('statsChart') statsChart!: ElementRef;
  progressionChartInstance!: Chart;
  statsChartInstance!: Chart;
  // Theme
  isDarkMode = false;
  // Search and Filter
  searchForm: FormGroup;
  filtreStatut: string = 'TOUS';
  // Informations utilisateur
  userData: UtilisateursDto | null = null;
  userId: number | null = null;
  // Données formations
  formations: FormationSummary[] = [];
  formationsFiltered: FormationSummary[] = [];
  prochainesSessions: SessionsDto[] = [];
  categories: string[] = [];
  // Vue calendrier
  afficherCalendrier: boolean = false;
  eventList: any[] = [];
  selectedMonth: Date = new Date();

  // Statistiques
  formationsEnCours = 0;
  formationsTerminees = 0;
  formationsAVenir = 0;
  progressionGlobale = 0;

  // Notifications
  notifications: Notifications[] = [];
  showNotificationsPanel: boolean = false;

  // Loading state
  loading = true;
  error = '';

  // Animation des stats
  animateStats = false;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router
  ) {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl(''),
    });
  }

  ngOnInit(): void {
    // Vérifier le mode thème dans localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }

    // Initialiser le formulaire de recherche
    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.filterFormations();
      });

    this.loadUserData();
    this.loadNotifications();

    // Animation des stats après un délai
    setTimeout(() => {
      this.animateStats = true;
    }, 500);
  }

  ngAfterViewInit() {
    // Les charts seront initialisés après le chargement des données
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleNotificationsPanel(): void {
    this.showNotificationsPanel = !this.showNotificationsPanel;
  }

  toggleCalendarView(): void {
    this.afficherCalendrier = !this.afficherCalendrier;
    if (this.afficherCalendrier) {
      this.prepareCalendarEvents();
      setTimeout(() => {
        this.renderCalendar();
      }, 0);
    }
  }

  prepareCalendarEvents(): void {
    this.eventList = [];
    this.formations.forEach((formation) => {
      if (
        formation.prochaineSessions &&
        formation.prochaineSessions.dateDebut
      ) {
        this.eventList.push({
          title: formation.titre,
          date: new Date(formation.prochaineSessions.dateDebut),
          type: 'formation',
          formationId: formation.id,
        });
      }
    });
  }

  renderCalendar(): void {
    // Cette méthode serait implémentée avec une lib de calendrier comme FullCalendar
    console.log('Render calendar with events:', this.eventList);
  }

  loadUserData(): void {
    this.loading = true;
    const user = this.userService.getConnectedUser();
    if (user && user.id) {
      this.userId = user.id;
      this.userData = user;
      this.loadUserFormations(user.id);
    } else {
      // Rediriger vers la page de connexion si aucun utilisateur n'est connecté
      this.router.navigate(['/login']);
    }
  }

  loadUserFormations(userId: number): void {
    this.apiService.getFormationsByUserId(userId).subscribe(
      (formations) => {
        this.processFormations(formations, userId);
        this.loadProchainesSessions(userId);
      },
      (error) => {
        this.error = 'Erreur lors du chargement des formations';
        this.loading = false;
        console.error('Erreur:', error);
      }
    );
  }

  processFormations(formations: FormationsDto[], userId: number): void {
    this.formationsEnCours = 0;
    this.formationsTerminees = 0;
    this.formationsAVenir = 0;
    let totalProgress = 0;
    const categories = new Set<string>();

    this.apiService.findAll_2().subscribe(
      (allSessions) => {
        const formationSummaries: FormationSummary[] = [];

        formations.forEach((formation) => {
          if (!formation.id) return;

          const sessions = allSessions.filter(
            (session) =>
              session.formationId === formation.id &&
              session.utilisateursIds?.includes(userId)
          );

          if (sessions.length === 0) return;

          const totalSessions = sessions.length;
          const sessionsCompletes = sessions.filter((s) =>
            this.isSessionTerminee(s)
          ).length;
          const progression = Math.round(
            (sessionsCompletes / totalSessions) * 100
          );

          // Ajout à la progression globale
          totalProgress += progression;

          let statut = 'A_VENIR';
          if (sessionsCompletes === totalSessions) {
            statut = 'TERMINEE';
            this.formationsTerminees++;
          } else if (sessionsCompletes > 0) {
            statut = 'EN_COURS';
            this.formationsEnCours++;
          } else {
            this.formationsAVenir++;
          }

          const prochaineSessions = sessions.find(
            (s) => !this.isSessionTerminee(s)
          );

          formationSummaries.push({
            id: formation.id,
            titre: formation.titre || 'Formation sans titre',
            statut,
            progression,
            prochaineSessions,
            totalSessions,
            sessionsCompletes,
            categorie: formation.description,
          });

          if (formation.description) {
            categories.add(formation.description);
          }
        });

        this.formations = formationSummaries;
        this.formationsFiltered = [...formationSummaries];
        this.categories = Array.from(categories);

        // Calcul de la progression globale moyenne
        this.progressionGlobale =
          this.formations.length > 0
            ? Math.round(totalProgress / this.formations.length)
            : 0;

        this.loading = false;

        // Initialiser les charts après chargement des données
        setTimeout(() => {
          this.initializeCharts();
        }, 300);
      },
      (error) => {
        console.error('Erreur lors du chargement des sessions:', error);
        this.loading = false;
        this.error = 'Erreur lors du chargement des sessions';
      }
    );
  }

  // Méthode pour initialiser les graphiques
  initializeCharts() {
    if (!this.progressionChart || !this.statsChart) {
      console.error('References to chart canvases not available');
      return;
    }

    // Détruire les instances existantes si elles existent
    if (this.progressionChartInstance) {
      this.progressionChartInstance.destroy();
    }

    if (this.statsChartInstance) {
      this.statsChartInstance.destroy();
    }

    // Créer le graphique de progression par formation
    this.progressionChartInstance = new Chart(
      this.progressionChart.nativeElement,
      {
        type: 'bar',
        data: {
          labels: this.formations.map((f) => this.truncateTitle(f.titre)),
          datasets: [
            {
              label: 'Progression (%)',
              data: this.formations.map((f) => f.progression),
              backgroundColor: this.formations.map((f) => {
                if (f.statut === 'TERMINEE') return 'rgba(75, 192, 192, 0.7)';
                if (f.statut === 'EN_COURS') return 'rgba(54, 162, 235, 0.7)';
                return 'rgba(153, 102, 255, 0.7)';
              }),
              borderColor: this.formations.map((f) => {
                if (f.statut === 'TERMINEE') return 'rgb(75, 192, 192)';
                if (f.statut === 'EN_COURS') return 'rgb(54, 162, 235)';
                return 'rgb(153, 102, 255)';
              }),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          animation: {
            duration: 1500,
          },
        },
      }
    );

    // Créer le graphique de répartition des formations
    this.statsChartInstance = new Chart(this.statsChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Terminées', 'En cours', 'À venir'],
        datasets: [
          {
            data: [
              this.formationsTerminees,
              this.formationsEnCours,
              this.formationsAVenir,
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
            borderColor: [
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: {
          animateRotate: true,
          animateScale: true,
        },
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  // Méthode pour rafraîchir les graphiques quand les données changent
  refreshCharts() {
    if (this.progressionChartInstance && this.statsChartInstance) {
      // Mettre à jour les données du graphique de progression
      this.progressionChartInstance.data.labels = this.formations.map((f) =>
        this.truncateTitle(f.titre)
      );
      this.progressionChartInstance.data.datasets[0].data = this.formations.map(
        (f) => f.progression
      );
      this.progressionChartInstance.update();

      // Mettre à jour les données du graphique de répartition
      this.statsChartInstance.data.datasets[0].data = [
        this.formationsTerminees,
        this.formationsEnCours,
        this.formationsAVenir,
      ];
      this.statsChartInstance.update();
    }
  }

  // Helper pour tronquer les titres longs
  truncateTitle(title: string): string {
    return title.length > 20 ? `${title.substring(0, 20)}...` : title;
  }

  // Fonction propre pour savoir si une session est terminée
  private isSessionTerminee(session: SessionsDto): boolean {
    if (!session.dateFin) return false;
    const dateFin = new Date(session.dateFin);
    return dateFin.getTime() < Date.now(); // Session terminée si sa date de fin est passée
  }

  loadProchainesSessions(userId: number): void {
    this.apiService.findAll_2().subscribe(
      (allSessions) => {
        // Filtrer les sessions de l'utilisateur à venir
        const now = new Date();
        this.prochainesSessions = allSessions
          .filter((s) => s.dateDebut && s.utilisateursIds?.includes(userId))
          .filter((s) => s.dateDebut && new Date(s.dateDebut) > now)
          .sort(
            (a, b) =>
              new Date(a.dateDebut!).getTime() -
              new Date(b.dateDebut!).getTime()
          )
          .slice(0, 5);
      },
      (error) => {
        console.error('Erreur lors du chargement des sessions:', error);
      }
    );
  }

  loadNotifications(): void {
    if (!this.userId) return;

    this.apiService.getNotificationsByUser(this.userId).subscribe({
      next: (notifications) => {
        this.notifications = notifications.map((n) => ({
          ...n,
          lue: n.estLue ?? false,
          type: this.determineNotificationType(n.contenu || ''),
        }));
        console.log('Notifications chargées:', this.notifications);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications:', err);
        this.notifications = []; // Initialiser comme tableau vide en cas d'erreur
      },
    });
  }

  getNotificationsForPanel(): Notifications[] {
    // Limiter à 5 notifications pour le panneau
    return this.notifications.slice(0, 5);
  }

  determineNotificationType(contenu: string): 'info' | 'warning' | 'success' {
    // Logique pour déterminer le type basé sur le contenu
    if (
      contenu.toLowerCase().includes('réussi') ||
      contenu.toLowerCase().includes('succès')
    ) {
      return 'success';
    } else if (
      contenu.toLowerCase().includes('attention') ||
      contenu.toLowerCase().includes('rappel')
    ) {
      return 'warning';
    }
    return 'info';
  }

  // Filtrage des formations
  filterFormations(): void {
    const searchControl = this.searchForm.get('searchTerm');
    const searchTerm =
      searchControl && searchControl.value
        ? searchControl.value.toLowerCase()
        : '';

    this.formationsFiltered = this.formations.filter((formation) => {
      const matchesSearch =
        searchTerm === '' || formation.titre.toLowerCase().includes(searchTerm);

      const matchesStatus =
        this.filtreStatut === 'TOUS' || formation.statut === this.filtreStatut;

      return matchesSearch && matchesStatus;
    });
  }

  setFiltreStatut(statut: string): void {
    this.filtreStatut = statut;
    this.filterFormations();
  }

  // Méthode pour marquer une notification comme lue
  markAsRead(notification: Notifications): void {
    notification.estLue = true;
  }

  // Méthode pour obtenir le nombre de notifications non lues
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.estLue).length;
  }

  // Méthode pour obtenir la classe de statut CSS
  getStatusClass(statut: string): string {
    switch (statut) {
      case 'EN_COURS':
        return 'status-in-progress';
      case 'TERMINEE':
        return 'status-completed';
      case 'A_VENIR':
        return 'status-upcoming';
      default:
        return '';
    }
  }

  // Méthode pour formater une date
  formatDate(date: string | undefined): string {
    if (!date) return 'Date non spécifiée';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // Méthode pour formater l'heure
  formatTime(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Obtenir un message d'encouragement selon la progression
  getEncouragementMessage(): string {
    if (this.progressionGlobale === 100)
      return 'Félicitations pour votre parcours complet !';
    if (this.progressionGlobale >= 75)
      return 'Vous êtes sur la bonne voie ! Continuez ainsi !';
    if (this.progressionGlobale >= 50)
      return 'Vous avancez bien, ne lâchez pas !';
    if (this.progressionGlobale >= 25) return 'Bon début ! Gardez le rythme !';
    return "C'est le moment de commencer votre aventure de formation !";
  }

  // Navigation vers la page détaillée d'une formation
  viewFormationDetails(formationId: number): void {
    this.router.navigate(['/formation', formationId]);
  }

  // Navigation vers le calendrier
  viewCalendar(): void {
    this.router.navigate(['/calendrier']);
  }

  // Navigation vers la liste des formations
  viewAllFormations(): void {
    this.router.navigate(['/mes-formations']);
  }

  // Méthode pour obtenir le jour à partir d'une date
  getDayFromDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).getDate().toString();
  }

  // Méthode pour obtenir le mois abrégé à partir d'une date
  getMonthFromDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { month: 'short' });
  }

  // Méthode pour obtenir le titre de la formation par son ID
  getFormationTitleById(formationId: number | undefined): string {
    if (!formationId) return 'Formation inconnue';
    const formation = this.formations.find((f) => f.id === formationId);
    return formation ? formation.titre : 'Formation inconnue';
  }

  // Méthode pour voir les détails d'une session
  viewSessionDetails(sessionId: number | undefined): void {
    if (sessionId) {
      this.router.navigate(['/session', sessionId]);
    }
  }

  previousMonth() {
    this.selectedMonth = new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth() - 1
    );
  }

  nextMonth() {
    this.selectedMonth = new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth() + 1
    );
  }

  formatMonth(dateString: string): string {
    if (!dateString) {
      return '--';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'short' });
  }

  getNotificationClasses(notification: any): string[] {
    const classes = [];

    if (!notification.lue) {
      classes.push('unread');
    }

    if (notification.type) {
      classes.push(notification.type);
    }

    return classes;
  }
}
