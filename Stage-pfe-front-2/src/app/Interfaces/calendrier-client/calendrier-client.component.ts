import { Component, OnInit } from '@angular/core';
import { forkJoin, catchError, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FormationsDto,
  SessionsDto,
  ThemesDto,
  UtilisateursDto,
} from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { Router } from '@angular/router';
import { UserService } from 'src/cni-api/src/services/user/user.service';

interface FormationAvecSessions extends FormationsDto {
  sessions?: SessionsDto[];
  color?: string;
}

interface CalendarDay {
  day: number;
  date: Date | null; // Permettre null pour les jours vides
  formationSessions: {
    formation: FormationAvecSessions;
    session: SessionsDto;
  }[];
  isToday: boolean;
}

interface CalendarEvent {
  id: number | undefined;
  title: string;
  startDate: Date;
  endDate: Date;
  formationId: number;
  color: string;
  formateurId?: number | number[];
  formateurs?: UtilisateursDto[];
  formateurNom?: string;
  availablePlaces?: number;
  participants?: number;
  lieu?: string;
  description?: string;
}

@Component({
  selector: 'app-calendrier-client',
  templateUrl: './calendrier-client.component.html',
  styleUrls: ['./calendrier-client.component.css'],
})
export class CalendrierClientComponent implements OnInit {
  currentDate: Date = new Date();
  today: Date = new Date();
  daysInMonth: CalendarDay[] = [];
  formations: FormationAvecSessions[] = [];
  sessions: SessionsDto[] = [];
  themes: ThemesDto[] = [];
  formateurs: UtilisateursDto[] = [];
  formationColors: Map<number, string> = new Map();
  calendarEvents: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  currentTab: string = 'general';

  // Formulaire pour les filtres
  filterForm: FormGroup;

  // État des filtres
  showFilters: boolean = false;
  showSessionsList: boolean = false;

  // Propriété pour la vue actuelle
  currentView: 'calendar' | 'list' = 'calendar';

  // Événements originaux (pour les filtres)
  originalCalendarEvents: CalendarEvent[] = [];

  // Couleurs prédéfinies pour les formations
  readonly colorList: string[] = [
    '#4285F4',
    '#DB4437',
    '#F4B400',
    '#0F9D58',
    '#FF6347',
    '#4682B4',
    '#32CD32',
    '#9370DB',
    '#FF69B4',
    '#20B2AA',
    '#F4A460',
    '#6495ED',
    '#7B68EE',
    '#00CED1',
    '#e6e6fa',
    '#FF7F50',
    '#DB7093',
    '#40E0D0',
    '#8A2BE2',
    '#FFA500',
  ];

  weekDays: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // ID de l'utilisateur connecté
  userId!: number;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    // Initialisation du formulaire de filtres
    this.filterForm = this.fb.group({
      formationId: [''],
      themeId: [''],
      formateurId: [''],
      dateDebut: [''],
      dateFin: [''],
      statut: [''],
    });

    // Récupérer l'ID utilisateur depuis le stockage local
    const user = this.userService.getConnectedUser();
    if (user && user.id) {
      this.userId = user.id;
      this.loadUserData();
    } else {
      // Rediriger vers la page de connexion si aucun utilisateur n'est connecté
      //this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loadUserData();
  }

  /**
   * Charge les données spécifiques à l'utilisateur
   */
  loadUserData() {
    if (!this.userId) {
      console.error('ID utilisateur non disponible');
      return;
    }

    forkJoin({
      // Utiliser le service getFormationsByUserId pour récupérer les formations de l'utilisateur
      userFormations: this.apiService.getFormationsByUserId(this.userId).pipe(
        catchError((err) => {
          console.error('Erreur chargement formations utilisateur', err);
          return of([]);
        })
      ),
      themes: this.apiService.findAll_3().pipe(
        catchError((err) => {
          console.error('Erreur chargement thèmes', err);
          return of([]);
        })
      ),
      formateurs: this.apiService.findFormateur().pipe(
        catchError((err) => {
          console.error('Erreur chargement formateurs', err);
          return of([]);
        })
      ),
    }).subscribe((result) => {
      this.formations = result.userFormations;
      this.themes = result.themes;
      this.formateurs = result.formateurs;

      // Récupérer les sessions pour ces formations
      this.loadSessionsForFormations();
    });
  }

  /**
   * Charge les sessions pour les formations de l'utilisateur
   */
  loadSessionsForFormations() {
    if (this.formations.length === 0) {
      this.generateCalendar(); // Générer un calendrier vide
      return;
    }

    const formationIds = this.formations
      .filter((f) => f.id !== undefined)
      .map((f) => f.id!);

    // Charger toutes les sessions
    this.apiService
      .findAll_2()
      .pipe(
        catchError((err) => {
          console.error('Erreur chargement sessions', err);
          return of([]);
        })
      )
      .subscribe((allSessions) => {
        // Filtrer les sessions pour ne garder que celles liées aux formations de l'utilisateur
        this.sessions = allSessions.filter(
          (s) =>
            s.formationId !== undefined && formationIds.includes(s.formationId)
        );

        // Assigner des couleurs aux formations
        this.assignColorsToFormations();

        // Préparer les événements du calendrier
        this.prepareCalendarEvents();

        // Générer le calendrier
        this.generateCalendar();
      });
  }

  /**
   * Attribue une couleur unique à chaque formation
   */
  assignColorsToFormations() {
    this.formations.forEach((formation, index) => {
      if (formation.id) {
        const colorIndex = index % this.colorList.length;
        this.formationColors.set(formation.id, this.colorList[colorIndex]);
        formation.color = this.colorList[colorIndex];
      }
    });
  }

  /**
   * Prépare les événements du calendrier avec des informations détaillées
   */
  prepareCalendarEvents() {
    this.calendarEvents = [];

    const eventPromises = this.sessions.map((session) => {
      // Vérifier si les informations nécessaires sont présentes
      if (!session.dateDebut || !session.formationId || !session.sessionId) {
        return Promise.resolve(null);
      }

      const formation = this.formations.find(
        (f) => f.id === session.formationId
      );
      if (!formation) return Promise.resolve(null);

      const startDate = new Date(session.dateDebut);

      // Déterminer la date de fin
      let endDate: Date;
      if (session.dateFin) {
        endDate = new Date(session.dateFin);
      } else {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }

      // Récupérer les détails complets pour chaque session
      return forkJoin({
        formateurs: this.apiService
          .getFormateur(session.sessionId)
          .pipe(catchError(() => of(null))),
        availablePlaces: this.apiService
          .getAvailablePlaces(session.sessionId)
          .pipe(catchError(() => of(0))),
        participants: this.apiService
          .getParticipants(session.sessionId)
          .pipe(catchError(() => of([]))),
        salle: session.salleId
          ? this.apiService
              .findById_4(session.salleId)
              .pipe(catchError(() => of(null)))
          : of(null),
      })
        .toPromise()
        .then((details) => {
          if (!details) return null;

          // Normaliser les formateurs
          const formateursArray = details.formateurs
            ? Array.isArray(details.formateurs)
              ? details.formateurs
              : [details.formateurs]
            : [];

          // Créer la liste des noms de formateurs
          const formateurNoms =
            formateursArray
              .map((f) => `${f.prenom || ''} ${f.nom || ''}`.trim())
              .filter((name) => name !== '')
              .join(', ') || 'Non assigné';

          // Déterminer le nom du lieu
          const lieu = details.salle
            ? details.salle.nom || `Salle ${details.salle.id}`
            : 'Lieu non spécifié';

          const event: CalendarEvent = {
            id: session.sessionId,
            title: formation.titre || 'Formation sans titre',
            startDate,
            endDate,
            formationId: formation.id!,
            color: this.getFormationColor(formation.id!),
            formateurId: session.utilisateursIds || undefined,
            formateurs: formateursArray,
            formateurNom: formateurNoms,
            availablePlaces: details.availablePlaces || 0,
            participants: details.participants?.length || 0,
            lieu: lieu,
            description: formation.description,
          };

          this.calendarEvents.push(event);

          return event;
        });
    });

    Promise.all(eventPromises).then((events) => {
      // Filtrer les événements null
      const validEvents = events.filter((e) => e !== null) as CalendarEvent[];

      // Sauvegarder les événements originaux pour les filtres
      this.originalCalendarEvents = [...this.calendarEvents];

      // Appliquer les filtres si nécessaire
      this.applyFilters();
    });
  }

  /**
   * Génère le calendrier avec les sessions et formations associées
   */
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Obtenir le jour de la semaine pour le premier jour du mois (0 = Dimanche, 1 = Lundi, etc.)
    let firstDay = new Date(year, month, 1).getDay();
    // Ajuster pour le calendrier européen (Lundi est le premier jour)
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const lastDay = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];

    // Ajout des cellules vides pour alignement du calendrier
    for (let i = 0; i < firstDay; i++) {
      this.daysInMonth.push({
        day: 0,
        date: null, // Utiliser null pour les jours vides
        formationSessions: [],
        isToday: false,
      });
    }

    const todayDate = new Date();

    // Ajout des jours du mois
    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month, day);

      // Vérifier si c'est aujourd'hui
      const isToday =
        todayDate.getDate() === day &&
        todayDate.getMonth() === month &&
        todayDate.getFullYear() === year;

      this.daysInMonth.push({
        day,
        date,
        formationSessions: [], // On utilise getEventsForDate() à la place
        isToday,
      });
    }
  }

  /**
   * Change de mois (précédent ou suivant)
   */
  changeMonth(direction: 'prev' | 'next') {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + (direction === 'prev' ? -1 : 1),
      1
    );
    this.generateCalendar();
  }

  /**
   * Retourne le nom du mois actuel
   */
  getMonthName(): string {
    return this.currentDate.toLocaleString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Obtient la couleur pour une formation
   */
  getFormationColor(formationId: number): string {
    return this.formationColors.get(formationId) || '#CCCCCC';
  }

  /**
   * Vérifie si l'événement couvre cette date
   */
  eventCoversDate(event: CalendarEvent, date: Date): boolean {
    const eventStart = new Date(event.startDate);
    eventStart.setHours(0, 0, 0, 0);

    const eventEnd = new Date(event.endDate);
    eventEnd.setHours(23, 59, 59, 999);

    const checkDate = new Date(date);
    checkDate.setHours(12, 0, 0, 0);

    return checkDate >= eventStart && checkDate <= eventEnd;
  }

  /**
   * Obtient les événements pour une date spécifique
   */
  getEventsForDate(date: Date | null): CalendarEvent[] {
    if (!date) return []; // Retourner un tableau vide pour les jours vides

    return this.calendarEvents.filter((event) =>
      this.eventCoversDate(event, date)
    );
  }

  /**
   * Sélectionne un événement pour afficher les détails
   */
  selectEvent(event: CalendarEvent, e?: Event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (event.id) {
      forkJoin({
        sessionDetails: this.apiService
          .findById_1(event.id)
          .pipe(catchError(() => of(null))),
        formateurs: this.apiService
          .getFormateur(event.id)
          .pipe(catchError(() => of([]))),
        participants: this.apiService
          .getParticipants(event.id)
          .pipe(catchError(() => of([]))),
      }).subscribe((details) => {
        this.selectedEvent = {
          ...event,
          formateurs: details.formateurs || [],
          formateurNom: details.formateurs
            ? details.formateurs.map((f) => `${f.prenom} ${f.nom}`).join(', ')
            : 'Non assigné',
          participants: details.participants?.length || 0,
        };
      });
    } else {
      this.selectedEvent = event;
    }
  }

  /**
   * Ferme le modal de détails d'événement
   */
  closeEventDetails() {
    this.selectedEvent = null;
  }

  /**
   * Bascule l'affichage des filtres
   */
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  /**
   * Bascule l'affichage de la liste des sessions
   */
  toggleSessionsList() {
    this.showSessionsList = !this.showSessionsList;
  }

  /**
   * Applique les filtres sur les événements
   */
  applyFilters() {
    // Commencer avec tous les événements d'origine
    let filteredEvents = [...this.originalCalendarEvents];
    const filters = this.filterForm.value;

    if (filters.formationId) {
      const formationId = parseInt(filters.formationId);
      filteredEvents = filteredEvents.filter(
        (event) => event.formationId === formationId
      );
    }

    if (filters.themeId) {
      const themeId = parseInt(filters.themeId);
      const formationsWithTheme = this.formations
        .filter((formation) => {
          return this.themes.some(
            (theme) =>
              theme.id === themeId &&
              theme.formationsIds?.includes(formation.id!)
          );
        })
        .map((f) => f.id);

      filteredEvents = filteredEvents.filter((event) =>
        formationsWithTheme.includes(event.formationId)
      );
    }

    if (filters.formateurId) {
      const formateurId = parseInt(filters.formateurId);
      filteredEvents = filteredEvents.filter((event) =>
        Array.isArray(event.formateurId)
          ? event.formateurId.includes(formateurId)
          : event.formateurId === formateurId
      );
    }

    if (filters.dateDebut) {
      const startDate = new Date(filters.dateDebut);
      startDate.setHours(0, 0, 0, 0);
      filteredEvents = filteredEvents.filter(
        (event) => new Date(event.endDate) >= startDate
      );
    }

    if (filters.dateFin) {
      const endDate = new Date(filters.dateFin);
      endDate.setHours(23, 59, 59, 999);
      filteredEvents = filteredEvents.filter(
        (event) => new Date(event.startDate) <= endDate
      );
    }

    // Mise à jour des événements filtrés
    this.calendarEvents = filteredEvents;

    // Regénérer le calendrier pour refléter les changements
    this.generateCalendar();
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters() {
    this.filterForm.reset();
    this.calendarEvents = [...this.originalCalendarEvents];
    this.generateCalendar();
  }

  /**
   * Définit la vue actuelle (calendrier ou liste)
   */
  setView(view: 'calendar' | 'list') {
    this.currentView = view;
  }

  /**
   * Groupe les événements par date pour la vue liste
   */
  getGroupedEvents() {
    if (!this.calendarEvents.length) return [];

    // Obtenir uniquement les événements du mois courant
    const start = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const end = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    const filteredEvents = this.calendarEvents.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart <= end && eventEnd >= start;
    });

    // Trier les événements par date
    filteredEvents.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );

    // Regrouper par date
    const groupedByDate: { date: Date; events: CalendarEvent[] }[] = [];

    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.startDate);
      eventDate.setHours(0, 0, 0, 0);

      let group = groupedByDate.find(
        (g) =>
          g.date.getFullYear() === eventDate.getFullYear() &&
          g.date.getMonth() === eventDate.getMonth() &&
          g.date.getDate() === eventDate.getDate()
      );

      if (!group) {
        group = { date: eventDate, events: [] };
        groupedByDate.push(group);
      }

      group.events.push(event);
    });

    return groupedByDate;
  }

  /**
   * Formate une date pour l'affichage dans la vue liste
   */
  formatListDate(date: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === today.getTime()) {
      return "Aujourd'hui";
    } else if (checkDate.getTime() === tomorrow.getTime()) {
      return 'Demain';
    } else {
      return checkDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
  }

  /**
   * Formate le temps d'un événement (horaires)
   */
  formatEventTime(event: CalendarEvent): string {
    if (!event.startDate || !event.endDate) return 'Horaire non spécifié';

    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    // Si l'événement dure plusieurs jours
    if (
      start.getDate() !== end.getDate() ||
      start.getMonth() !== end.getMonth() ||
      start.getFullYear() !== end.getFullYear()
    ) {
      return `Du ${start.toLocaleDateString(
        'fr-FR'
      )} au ${end.toLocaleDateString('fr-FR')}`;
    }

    // Si c'est le même jour
    return `${start.toLocaleDateString('fr-FR')}`;
  }

  /**
   * Formate l'heure d'une date
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  /**
   * Retourne l'heure de début d'un événement
   */
  getEventStartTime(event: CalendarEvent): string {
    if (!event?.startDate) return '--:--';
    const date = new Date(event.startDate);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  /**
   * Retourne l'heure de fin d'un événement
   */
  getEventEndTime(event: CalendarEvent): string {
    if (!event?.endDate) return '--:--';
    const date = new Date(event.endDate);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  /**
   * Retourne la date de début d'un événement
   */
  getEventStartDate(event: CalendarEvent): string {
    if (!event?.startDate) return '';
    const date = new Date(event.startDate);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  /**
   * Retourne la date de fin d'un événement
   */
  getEventEndDate(event: CalendarEvent): string {
    if (!event?.endDate) return '';
    const date = new Date(event.endDate);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  /**
   * Formate une date pour l'affichage détaillé
   */
  formatDisplayDate(dateString: string | Date): string {
    if (!dateString) return 'Non spécifié';

    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * S'inscrire à une session
   */
  /* inscriptionSession(sessionId: number | undefined) {
    if (!sessionId || !this.userId) {
      console.error('ID session ou utilisateur non disponible');
      return;
    }

    this.apiService
      .inscrireParticipant({
        sessionId: sessionId,
        utilisateurId: this.userId,
      })
      .subscribe(
        () => {
          alert('Inscription réussie !');
          // Recharger les détails de l'événement pour mettre à jour le nombre de places
          if (this.selectedEvent && this.selectedEvent.id === sessionId) {
            this.selectEvent(this.selectedEvent);
          }
        },
        (error) => {
          console.error("Erreur lors de l'inscription", error);
          alert("Erreur lors de l'inscription. Veuillez réessayer.");
        }
      );
  } */

  /**
   * Se désinscrire d'une session
   */
  /* desinscriptionSession(sessionId: number | undefined) {
    if (!sessionId || !this.userId) {
      console.error('ID session ou utilisateur non disponible');
      return;
    }

    this.apiService
      .desinscrireParticipant({
        sessionId: sessionId,
        utilisateurId: this.userId,
      })
      .subscribe(
        () => {
          alert('Désinscription réussie !');
          // Recharger les détails de l'événement
          if (this.selectedEvent && this.selectedEvent.id === sessionId) {
            this.selectEvent(this.selectedEvent);
          }
        },
        (error) => {
          console.error('Erreur lors de la désinscription', error);
          alert('Erreur lors de la désinscription. Veuillez réessayer.');
        }
      );
  } */

  /**
   * Vérifie si l'utilisateur est inscrit à une session
   */
  isUserInscrit(sessionId: number | undefined): boolean {
    // Cette méthode devrait faire un appel à l'API pour vérifier l'inscription
    // Pour l'instant, on fait une vérification côté client basée sur une propriété temporaire
    if (!sessionId || !this.selectedEvent) return false;

    // On pourrait implémenter un appel API ici
    return false; // À remplacer par une vérification réelle
  }
}
