import { Component, OnInit } from '@angular/core';
import { forkJoin, catchError, of } from 'rxjs';
import { FormationsDto, SessionsDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';

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
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  formationId: number;
  color: string;
}

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css']
})
export class CalendrierComponent implements OnInit {
  currentDate: Date = new Date();
  today: Date = new Date();
  daysInMonth: CalendarDay[] = [];
  formations: FormationAvecSessions[] = [];
  sessions: SessionsDto[] = [];
  formationColors: Map<number, string> = new Map();
  calendarEvents: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  
  // Predefined list of colors for formations
  colorList: string[] = [
    '#FFD700', '#FF6347', '#4682B4', '#32CD32', '#9370DB',
    '#FF69B4', '#20B2AA', '#F4A460', '#6495ED', '#7B68EE',
    '#00CED1', '#e6e6fa', '#FF7F50', '#DB7093', '#40E0D0'
  ];

  weekDays: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadFormationsWithSessions();
  }

  /**
   * Charge les formations et sessions en parallèle
   */
  loadFormationsWithSessions() {
    forkJoin({
      formations: this.apiService.findAllFormations().pipe(catchError(err => {
        console.error('Erreur chargement formations', err);
        return of([]);
      })),
      sessions: this.apiService.findAll_2().pipe(catchError(err => {
        console.error('Erreur chargement sessions', err);
        return of([]);
      }))
    }).subscribe(result => {
      this.formations = result.formations;
      this.sessions = result.sessions;
      
      // Assign colors to formations
      this.assignColorsToFormations();
      
      // Prepare calendar events
      this.prepareCalendarEvents();
      
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
   * Prépare les événements du calendrier
   */
  prepareCalendarEvents() {
    this.calendarEvents = [];
    
    this.sessions.forEach(session => {
      if (!session.dateDebut || !session.formationId) return;
      
      const formation = this.formations.find(f => f.id === session.formationId);
      if (!formation) return;
      
      const startDate = new Date(session.dateDebut);
      
      // Déterminer la date de fin (utiliser dateFin si disponible, sinon ajouter 1 jour à dateDebut)
      let endDate: Date;
      if (session.dateFin) {
        endDate = new Date(session.dateFin);
      } else {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }
      
      this.calendarEvents.push({
        id: session.sessionId || 0,
        title: formation.titre || 'Formation sans titre',
        startDate,
        endDate,
        formationId: formation.id!,
        color: this.getFormationColor(formation.id!)
      });
    });
  }

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
        date: null,  // Utiliser null pour les jours vides
        formationSessions: [],
        isToday: false
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
        formationSessions: [],  // On n'utilise plus cette propriété directement
        isToday
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
    return this.currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
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
  selectEvent(event: CalendarEvent) {
    this.selectedEvent = event;
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
    if (!date) return [];  // Retourner un tableau vide pour les jours avant le 1er
    
    return this.calendarEvents.filter(event => 
      this.eventCoversDate(event, date)
    );
  }
}