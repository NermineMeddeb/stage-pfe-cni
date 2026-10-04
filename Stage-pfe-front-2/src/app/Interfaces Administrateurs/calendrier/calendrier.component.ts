import { Component, OnInit } from '@angular/core';
import { forkJoin, catchError, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FormationsDto,
  SessionsDto,
  ThemesDto,
  UtilisateursDto,
} from 'src/cni-api/src/models';
import { Router } from '@angular/router';
import { ApiService } from 'src/cni-api/src/services/api.service';

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
  id: number | undefined; // Changé de 'number' à 'number | undefined'
  title: string;
  startDate: Date;
  endDate: Date;
  formationId: number;
  color: string;
  formateurId?: number | number[];
  formateurs?: UtilisateursDto[]; // Changé pour accepter un tableau ou un nombre
  formateurNom?: string;
  availablePlaces?: number;
  participants?: number;
  lieu?: string;
  description?: string;
}

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css'],
})
export class CalendrierComponent implements OnInit {
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
  showAddSessionModal: boolean = false;
  currentTab: string = 'general'; // 'general' ou 'details'
  // Formulaires pour les filtres et l'ajout de session
  filterForm: FormGroup;
  newSessionForm: FormGroup;
  selectedParticipants: any[] = [];
  showParticipantsModal: boolean = false;

  // État des filtres et du formulaire d'ajout de session
  showFilters: boolean = false;
  showAddSessionForm: boolean = false;
  showSessionsList: boolean = false;
  // Propriété manquante pour la vue actuelle
  currentView: 'calendar' | 'list' = 'calendar';

  // Predefined list of colors for formations
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

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialisation des formulaires
    this.filterForm = this.fb.group({
      formationId: [''],
      themeId: [''],
      formateurId: [''],
      dateDebut: [''],
      dateFin: [''],
      statut: [''],
    });

    this.newSessionForm = this.fb.group({
      formationId: ['', []], // Validation à ajouter
      formateurId: ['', []],
      dateDebut: ['', []],
      dateFin: ['', []],
      capacite: [20, []],
      lieu: ['', []],
      statut: ['PLANIFIEE', []],
    });
  }

  ngOnInit() {
    this.loadAllData();
  }

  /**
   * Charge toutes les données nécessaires
   */
  loadAllData() {
    forkJoin({
      formations: this.apiService.findAllFormations().pipe(
        catchError((err) => {
          console.error('Erreur chargement formations', err);
          return of([]);
        })
      ),
      sessions: this.apiService.findAll_2().pipe(
        catchError((err) => {
          console.error('Erreur chargement sessions', err);
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
      this.formations = result.formations;
      this.sessions = result.sessions;
      this.themes = result.themes;
      this.formateurs = result.formateurs;

      // Assign colors to formations
      this.assignColorsToFormations();

      // Prepare calendar events
      this.prepareCalendarEvents();

      this.generateCalendar();
    });
  }
  toggleAddSessionModal() {
    this.showAddSessionModal = !this.showAddSessionModal;
    if (this.showAddSessionModal) {
      // Réinitialiser le formulaire et l'onglet actif
      this.newSessionForm.reset({
        statut: 'PLANIFIEE', // Valeur par défaut
      });
      this.currentTab = 'general';
      // Bloquer le scroll de la page
      document.body.classList.add('modal-open');
    } else {
      // Réactiver le scroll
      document.body.classList.remove('modal-open');
    }
  } //Méthode pour fermer le modal lors d'un clic sur l'overlay
  closeModal(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.toggleAddSessionModal();
    }
  }

  // Méthode pour changer d'onglet
  setCurrentTab(tab: string) {
    this.currentTab = tab;
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

    const formateurPromises = this.sessions.map((session) => {
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
          };

          this.calendarEvents.push(event);
          console.log('Détails de la salle:', details.salle);

          return event;
        });
    });

    Promise.all(formateurPromises).then(() => {
      // Sauvegarder les événements originaux
      this.originalCalendarEvents = [...this.calendarEvents];
      // Appliquer les filtres si nécessaire
      this.applyFilters();
    });
  }

  // Modifiez resetFilters pour restaurer les événements originaux
  resetFilters() {
    this.filterForm.reset();
    this.calendarEvents = [...this.originalCalendarEvents];
    this.generateCalendar();
  }
  originalCalendarEvents: CalendarEvent[] = [];
  getFormateursDisplay(formateurs: UtilisateursDto[] | undefined): string {
    if (!formateurs || formateurs.length === 0) return 'Non assigné';

    return formateurs
      .map((f) => `${f.prenom || ''} ${f.nom || ''}`)
      .filter((name) => name.trim() !== '')
      .join(', ');
  }
  /**
   * Applique les filtres sur les événements
   */
  // Modifiez la méthode applyFilters() comme suit
  applyFilters() {
    // Commencer avec tous les événements d'origine, pas seulement ceux déjà filtrés
    let filteredEvents = [...this.originalCalendarEvents]; // Vous devrez ajouter cette propriété
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
        // Vérifier si formateurId est un tableau ou une valeur unique
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
   * Ajoute une nouvelle session
   */
  addNewSession() {
    if (this.newSessionForm.valid) {
      const newSession: SessionsDto = {
        formationId: parseInt(this.newSessionForm.value.formationId),
        utilisateursIds: [parseInt(this.newSessionForm.value.formateurId)], // Format correct pour le tableau
        dateDebut: this.newSessionForm.value.dateDebut, // Garder en string pour respecter l'interface
        dateFin: this.newSessionForm.value.dateFin, // Garder en string pour respecter l'interface
        capacite: this.newSessionForm.value.capacite,
        salleId: this.newSessionForm.value.lieu
          ? parseInt(this.newSessionForm.value.lieu)
          : undefined,
      };

      this.apiService.save_1(newSession).subscribe(
        (response) => {
          console.log('Session ajoutée avec succès', response);
          this.newSessionForm.reset({
            capacite: 20,
          });
          this.showAddSessionForm = false;

          // Recharger les données pour mettre à jour le calendrier
          this.loadAllData();
          this.toggleAddSessionModal();
        },
        (error) => {
          console.error("Erreur lors de l'ajout de la session", error);
          // Gérer l'erreur (afficher un message, etc.)
        }
      );
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.newSessionForm.controls).forEach((key) => {
        this.newSessionForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * Charge les sessions par date
   */
  loadSessionsByDateRange() {
    const filters = this.filterForm.value;
    if (filters.dateDebut && filters.dateFin) {
      this.apiService
        .findByDateBetween({
          startDate: new Date(filters.dateDebut).toISOString(), // Utiliser les noms de propriétés corrects
          endDate: new Date(filters.dateFin).toISOString(),
        })
        .subscribe(
          (sessions) => {
            this.sessions = sessions;
            this.prepareCalendarEvents();
          },
          (error) => {
            console.error(
              'Erreur lors du chargement des sessions par date',
              error
            );
          }
        );
    }
  }

  /**
   * Supprime une session
   */
  deleteSession(sessionId: number) {
    // Au lieu d'utiliser confirm(), activez votre popup personnalisé
    this.sessionToDelete = sessionId;
    this.showDeleteConfirmModal = true;
  }

  // Ajoutez cette nouvelle méthode pour confirmer la suppression
  confirmDeleteSession() {
    const sessionId = this.sessionToDelete;

    this.apiService.delete_1(sessionId).subscribe(
      () => {
        console.log('Session supprimée avec succès');
        // Supprimer l'événement localement
        this.calendarEvents = this.calendarEvents.filter(
          (event) => event.id !== sessionId
        );
        this.sessions = this.sessions.filter(
          (session) => session.sessionId !== sessionId
        );

        // Si l'événement sélectionné est celui qui vient d'être supprimé, le désélectionner
        if (this.selectedEvent && this.selectedEvent.id === sessionId) {
          this.selectedEvent = null;
        }

        // Mettre à jour le calendrier
        this.generateCalendar();

        // Fermer le modal
        this.closeDeleteConfirmModal();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la session', error);
        this.closeDeleteConfirmModal();
      }
    );
  }

  // Méthode pour fermer le modal sans supprimer
  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.sessionToDelete = null;
  }
  sessionToDelete: number | null = null;
  showDeleteConfirmModal: boolean = false;

  /**
   * Génère le calendrier avec les sessions et formations associées
   */
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Get the day of week for the first day of month (0 = Sunday, 1 = Monday, etc.)
    let firstDay = new Date(year, month, 1).getDay();
    // Adjust for European calendar (Monday is first day)
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

    // Ajout des jours du mois avec leurs formations
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
        formationSessions: [], // On n'utilise plus cette propriété directement
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
   * Get color for a formation
   */
  getFormationColor(formationId: number): string {
    return this.formationColors.get(formationId) || '#CCCCCC';
  }

  /**
   * Sélectionne un événement pour afficher les détails
   */
  electEvent(event: CalendarEvent) {
    // Charger des informations supplémentaires si nécessaire
    if (event.id) {
      forkJoin({
        sessionDetails: this.apiService
          .findById_1(event.id)
          .pipe(catchError(() => of(null))),
        formateur: this.apiService
          .getFormateur(event.id)
          .pipe(catchError(() => of(null))),
        participants: this.apiService
          .getParticipants(event.id)
          .pipe(catchError(() => of([]))),
      }).subscribe((details) => {
        // Enrichir l'événement avec plus de détails
        event = {
          ...event,
          formateurNom: details.formateur
            ? Array.isArray(details.formateur)
              ? `${details.formateur[0]?.nom || ''} ${
                  details.formateur[0]?.prenom || ''
                }`
              : `${(details.formateur as UtilisateursDto).nom || ''} ${
                  (details.formateur as UtilisateursDto).prenom || ''
                }`
            : 'Non assigné',
          participants: details.participants?.length || 0,
        };

        this.selectedEvent = event;
      });
    } else {
      this.selectedEvent = event;
    }
  }
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
   * Ferme le modal de détails d'événement
   */
  closeEventDetails() {
    this.selectedEvent = null;
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
    if (!date) return []; // Retourner un tableau vide pour les jours avant le 1er

    return this.calendarEvents.filter((event) =>
      this.eventCoversDate(event, date)
    );
  }

  /**
   * Bascule l'affichage des filtres
   */
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  /**
   * Bascule l'affichage du formulaire d'ajout de session
   */
  toggleAddSessionForm() {
    this.router.navigate(['dashboard/calandrier/nouvelle-sessions']);
  }

  /**
   * Bascule l'affichage de la liste des sessions
   */
  toggleSessionsList() {
    this.showSessionsList = !this.showSessionsList;
  }

  /**
   * Obtient le nom d'une formation à partir de son ID
   */
  getFormationTitle(formationId: number): string {
    const formation = this.formations.find((f) => f.id === formationId);
    return formation ? formation.titre || 'Sans titre' : 'Formation inconnue';
  }

  /**
   * Obtient le nom d'un formateur à partir de son ID
   */
  getFormateurName(formateurId: number | undefined): string {
    if (!formateurId) return 'Non assigné';
    const formateur = this.formateurs.find((f) => f.id === formateurId);
    return formateur
      ? `${formateur.nom} ${formateur.prenom}`
      : 'Formateur inconnu';
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
        formateurs: this.apiService.getFormateur(event.id).pipe(
          // Utilisez une méthode spécifique
          catchError(() => of([]))
        ),
        participants: this.apiService
          .getParticipants(event.id)
          .pipe(catchError(() => of([]))),
      }).subscribe((details) => {
        this.selectedEvent = {
          ...event,
          formateurs: details.formateurs || [], // Stocke les formateurs de la session
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
    const startHour = new Date(event.startDate);

    const end = new Date(event.endDate);
    const endHour = new Date(event.endDate);

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
  getEventStartTime(event: CalendarEvent): string {
    if (!event?.startDate) return '--:--';
    const date = new Date(event.startDate);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  getEventEndTime(event: CalendarEvent): string {
    if (!event?.endDate) return '--:--';
    const date = new Date(event.endDate);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  getEventStartDate(event: CalendarEvent): string {
    if (!event?.startDate) return '';
    const date = new Date(event.startDate);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

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
   * Extrait les horaires d'un événement (heure début et fin)
   */
  getEventHours(event: CalendarEvent): string {
    if (!event.startDate || !event.endDate) return 'Horaire non spécifié';

    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    // Si c'est le même jour
    if (start.toDateString() === end.toDateString()) {
      return `${this.formatTime(start)} - ${this.formatTime(end)}`;
    }

    // Si l'événement s'étend sur plusieurs jours
    return `${this.formatTime(start)} (${start.toLocaleDateString(
      'fr-FR'
    )}) - ${this.formatTime(end)} (${end.toLocaleDateString('fr-FR')})`;
  }

  /**
   * Retourne l'étiquette du statut en français
   */
  getStatusLabel(statut: string | undefined): string {
    if (!statut) return 'Inconnu';

    const statusMap: { [key: string]: string } = {
      PLANIFIEE: 'Planifiée',
      EN_COURS: 'En cours',
      TERMINEE: 'Terminée',
      ANNULEE: 'Annulée',
    };

    return statusMap[statut] || statut;
  }

  /**
   * Modifie une session
   */
  editSession(session: SessionsDto) {
    // Naviguer vers la page d'édition ou ouvrir un formulaire d'édition
    console.log('Édition de la session', session);
    this.router.navigate([
      'dashboard/calandrier/update-sessions/',
      session.sessionId,
    ]);
  }

  /**
   * Modifie un événement
   */
  editEvent(event: CalendarEvent) {
    // Retrouver la session correspondante et l'éditer
    const session = this.sessions.find((s) => s.sessionId === event.id);
    if (session) {
      this.editSession(session);
    } else {
      console.error("Session non trouvée pour l'événement", event);
    }

    // Fermer le modal de détails
    this.closeEventDetails();
  }

  /**
   * Supprime un événement
   */
  deleteEvent(event: CalendarEvent) {
    if (event.id) {
      this.deleteSession(event.id);
    }
    // Fermer le modal
    this.closeEventDetails();
  }

  /**
   * Affiche les participants d'une session
   */

  viewParticipants(sessionId: number) {
    // Charger les participants
    this.apiService.getParticipants(sessionId).subscribe(
      (participants) => {
        console.log('Participants de la session', participants);

        // Créer un popup personnalisé au lieu d'une alerte
        this.selectedParticipants = participants;
        this.showParticipantsModal = true; // Variable pour contrôler l'affichage du modal
      },
      (error) => {
        console.error('Erreur lors du chargement des participants', error);
      }
    );
  } // Méthode pour fermer le modal
  closeParticipantsModal() {
    this.showParticipantsModal = false;
  }

  /**
   * Définit la vue actuelle (calendrier ou liste)
   */
  setView(view: 'calendar' | 'list') {
    this.currentView = view;
  }
}
