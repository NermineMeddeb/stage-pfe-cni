import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; // <-- Ajoutez cette ligne

export class PlanningFormateurModule { }


// planning-formateur.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, catchError, of, Subscription, BehaviorSubject } from 'rxjs';
import { FormationsDto, SessionsDto, UtilisateursDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface FormationAvecSessions extends FormationsDto {
  sessions?: SessionsDto[];
  color?: string;
}

interface FormateurAvecSessions {
  formateur: UtilisateursDto;
  sessions: {
    session: SessionsDto;
    formation: FormationAvecSessions;
  }[];
  totalSessions: number;
  upcomingSessions: number;
}

interface CalendarEvent {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  formationId: number;
  formateurId: number;
  formateurNom: string;
  color: string;
  lieu?: string;
  participants?: number;
  description?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

@Component({
  selector: 'app-planning-formateur',
  templateUrl: './planning-formateur.component.html',
  styleUrls: ['./planning-formateur.component.css']
})
export class PlanningFormateurComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  today: Date = new Date();
  formations: FormationAvecSessions[] = [];
  sessions: SessionsDto[] = [];
  formateurs: UtilisateursDto[] = [];
  formationColors: Map<number, string> = new Map();
  calendarEvents: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  formateursSessions: FormateurAvecSessions[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  
  private searchSubject = new BehaviorSubject<string>('');
  searchTerm: string = '';
  filterOptions = {
    showUpcoming: true,
    showOngoing: true,
    showCompleted: false
  };
  sortOption: 'name' | 'sessions' | 'upcoming' = 'upcoming';
  viewMode: 'list' | 'calendar' = 'list';
  autoRefreshEnabled: boolean = false;
  private autoRefreshInterval: any;
  private subscriptions: Subscription = new Subscription();

  readonly colorList: string[] = [
    '#4285F4', '#DB4437', '#F4B400', '#0F9D58',
    '#FF6347', '#4682B4', '#32CD32', '#9370DB',
    '#FF69B4', '#20B2AA', '#F4A460', '#6495ED',
    '#7B68EE', '#00CED1', '#e6e6fa', '#FF7F50',
    '#DB7093', '#40E0D0', '#8A2BE2', '#FFA500'
  ];

  constructor(private apiService: ApiService) {
    this.subscriptions.add(
      this.searchSubject
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(term => {
          this.searchTerm = term;
          this.filterAndSortData();
        })
    );
  }

  ngOnInit() {
    this.loadAllData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.stopAutoRefresh();
  }

  public toggleAutoRefresh() {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
    if (this.autoRefreshEnabled) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  private startAutoRefresh() {
    this.autoRefreshInterval = setInterval(() => {
      this.loadAllData();
    }, 300000); // 5 minutes
  }

  private stopAutoRefresh() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }

  public onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  public filterAndSortData() {
    let filteredData = this.formateursSessions.filter(formateurData => {
      const searchLower = this.searchTerm.toLowerCase();
      const matchesSearch = !this.searchTerm || 
        formateurData.formateur.nom?.toLowerCase().includes(searchLower) ||
        formateurData.sessions.some(s => 
          s.formation.titre?.toLowerCase().includes(searchLower)
        );

      const hasMatchingSessions = formateurData.sessions.some(item => {
        const status = this.getSessionStatus(item.session);
        return (
          (this.filterOptions.showUpcoming && status === 'upcoming') ||
          (this.filterOptions.showOngoing && status === 'ongoing') ||
          (this.filterOptions.showCompleted && status === 'completed')
        );
      });

      return matchesSearch && hasMatchingSessions;
    });

    filteredData.sort((a, b) => {
      switch (this.sortOption) {
        case 'name':
          return (a.formateur.nom || '').localeCompare(b.formateur.nom || '');
        case 'sessions':
          return b.totalSessions - a.totalSessions;
        case 'upcoming':
          return b.upcomingSessions - a.upcomingSessions;
        default:
          return 0;
      }
    });

    this.formateursSessions = filteredData;
  }

  public getSessionStatus(session: SessionsDto): 'upcoming' | 'ongoing' | 'completed' {
    const now = new Date().getTime();
    const startDate = session.dateDebut ? new Date(session.dateDebut).getTime() : 0;
    const endDate = session.dateFin ? new Date(session.dateFin).getTime() : 0;

    if (startDate > now) return 'upcoming';
    if (endDate < now) return 'completed';
    return 'ongoing';
  }

  public exportToCSV() {
    const headers = ['Formateur', 'Formation', 'Date début', 'Date fin', 'Statut'];
    const data = this.formateursSessions.flatMap(formateurData => 
      formateurData.sessions.map(item => [
        formateurData.formateur.nom || '',
        item.formation.titre || '',
        this.formatDate(item.session.dateDebut),
        this.formatDate(item.session.dateFin),
        this.getSessionStatus(item.session)
      ])
    );

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `planning-formateurs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  private formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  public formatDateRange(startDate: Date | string | undefined, endDate: Date | string | undefined): string {
    if (!startDate) return 'Date non définie';
    
    const start = new Date(startDate);
    const formattedStart = start.toLocaleDateString('fr-FR');
    
    if (!endDate) return formattedStart;
    
    const end = new Date(endDate);
    const formattedEnd = end.toLocaleDateString('fr-FR');
    
    if (formattedStart === formattedEnd) {
      return formattedStart;
    }
    
    return `${formattedStart} - ${formattedEnd}`;
  }

  public loadAllData() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const subscription = forkJoin({
      formations: this.apiService.findAllFormations().pipe(
        catchError(err => {
          console.error('Erreur chargement formations', err);
          this.errorMessage = 'Erreur lors du chargement des formations';
          return of([]);
        })
      ),
      sessions: this.apiService.findAll_2().pipe(
        catchError(err => {
          console.error('Erreur chargement sessions', err);
          this.errorMessage = 'Erreur lors du chargement des sessions';
          return of([]);
        })
      ),
      formateurs: this.apiService.findFormateur().pipe(
        catchError(err => {
          console.error('Erreur chargement formateurs', err);
          this.errorMessage = 'Erreur lors du chargement des formateurs';
          return of([]);
        })
      )
    }).subscribe({
      next: (result) => {
        this.formations = result.formations;
        this.sessions = result.sessions;
        this.formateurs = result.formateurs;
        
        this.assignColorsToFormations();
        this.prepareCalendarEvents();
        this.groupSessionsByFormateur();
        this.filterAndSortData();
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur globale', err);
        this.errorMessage = 'Une erreur est survenue lors du chargement des données';
        this.isLoading = false;
      }
    });
    
    this.subscriptions.add(subscription);
  }

  private assignColorsToFormations() {
    this.formations.forEach((formation, index) => {
      if (formation.id) {
        const colorIndex = index % this.colorList.length;
        this.formationColors.set(formation.id, this.colorList[colorIndex]);
        formation.color = this.colorList[colorIndex];
      }
    });
  }

  private groupSessionsByFormateur() {
    this.formateursSessions = [];
    
    const formateursTries = [...this.formateurs].sort((a, b) => {
      return (a.nom || '').localeCompare(b.nom || '');
    });
    
    formateursTries.forEach(formateur => {
      const formateurSessions = {
        formateur,
        sessions: [] as {session: SessionsDto, formation: FormationAvecSessions}[],
        totalSessions: 0,
        upcomingSessions: 0
      };
      
      this.sessions.forEach(session => {
        if (session.utilisateurId === formateur.id) {
          const formation = this.formations.find(f => f.id === session.formationId);
          if (formation) {
            formateurSessions.sessions.push({
              session,
              formation
            });
            formateurSessions.totalSessions++;
            if (this.getSessionStatus(session) === 'upcoming') {
              formateurSessions.upcomingSessions++;
            }
          }
        }
      });
      
      formateurSessions.sessions.sort((a, b) => {
        const dateA = a.session.dateDebut ? new Date(a.session.dateDebut).getTime() : 0;
        const dateB = b.session.dateDebut ? new Date(b.session.dateDebut).getTime() : 0;
        return dateA - dateB;
      });
      
      if (formateurSessions.sessions.length > 0) {
        this.formateursSessions.push(formateurSessions);
      }
    });
  }

  private prepareCalendarEvents() {
    this.calendarEvents = [];
    
    this.sessions.forEach(session => {
      if (!session.formationId || !session.utilisateurId) return;
      
      const formation = this.formations.find(f => f.id === session.formationId);
      if (!formation) return;
      
      const formateur = this.formateurs.find(f => f.id === session.utilisateurId);
      if (!formateur) return;
      
      const startDate = session.dateDebut ? new Date(session.dateDebut) : new Date();
      
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
        formateurId: session.utilisateurId,
        formateurNom: formateur.nom || 'Sans nom',
        color: this.getFormationColor(formation.id!),
        status: this.getSessionStatus(session)
      });
    });
    
    this.calendarEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  public getFormationColor(formationId: number): string {
    return this.formationColors.get(formationId) || '#CCCCCC';
  }

  public createCalendarEvent(item: { session: SessionsDto; formation: FormationAvecSessions }, formateur: UtilisateursDto): CalendarEvent {
    const startDate = item.session.dateDebut ? new Date(item.session.dateDebut) : new Date();
    let endDate: Date;
    
    if (item.session.dateFin) {
      endDate = new Date(item.session.dateFin);
    } else {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    }

    return {
      id: item.session.sessionId || 0,
      title: item.formation.titre || 'Formation sans titre',
      startDate,
      endDate,
      formationId: item.formation.id!,
      formateurId: formateur.id!,
      formateurNom: formateur.nom || 'Sans nom',
      color: item.formation.color || '#CCCCCC',
      status: this.getSessionStatus(item.session)
    };
  }

  public selectEvent(event: CalendarEvent) {
    this.selectedEvent = event;
  }

  public closeEventDetails() {
    this.selectedEvent = null;
  }

  public refreshData() {
    this.loadAllData();}}