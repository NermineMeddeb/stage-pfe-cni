import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/cni-api/src/services';
import { forkJoin, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-tableau-de-bord',
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.css'],
})
export class TableauDeBordComponent implements OnInit {
  loading = true;
  error: string | null = null;
  currentTheme = 'light';
  
  // Dashboard sections visibility control
  visibleSections = {
    overview: true,
    formations: true,
    sessions: true,
    users: true,
    insights: true
  };
  
  // Data for charts
  formationsByTheme: any[] = [];
  formationsByNiveau: any[] = [];
  formationsByStatut: any[] = [];
  upcomingSessions: any[] = [];
  userDistribution: any[] = [];
  studentProgressByMonth: any[] = [];
  revenueByMonth: any[] = [];
  satisfactionByFormation: any[] = [];
  
  // Recent activities
  recentActivities: any[] = [];
  
  // Chart options
  viewPie: [number, number] = [300, 250];
  viewBar: [number, number] = [500, 300];
  viewLine: [number, number] = [700, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Formations';
  yAxisLabel = 'Nombre';
  timeline = true;
  
  // Color schemes - fixed to match ngx-charts expected format
  colorSchemeBlue: Color = {
    name: 'colorSchemeBlue',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']
  };
  
  colorSchemeMulti: Color = {
    name: 'colorSchemeMulti',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  };
  
  colorSchemeGreen: Color = {
    name: 'colorSchemeGreen',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7']
  };
  
  colorSchemeWarm: Color = {
    name: 'colorSchemeWarm',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b91c1c', '#c2410c', '#b45309', '#a16207', '#854d0e']
  };

  // Summary stats
  dashboardStats = {
    totalFormations: 0,
    totalSessions: 0,
    totalStudents: 0,
    totalInstructors: 0,
    completionRate: 0,
    satisfactionRate: 0,
    avgAttendance: 0,
    mostPopularFormation: '',
    mostActiveInstructor: ''
  };
  
  // Filtered data
  selectedThemeFilter: string | null = null;
  selectedNiveauFilter: string | null = null;
  selectedDateRange: { start: Date | null, end: Date | null } = { start: null, end: null };
  
  // Themes list for filter
  themesList: any[] = [];
  niveauxList: string[] = [];
  
  // Most popular formations
  popularFormations: any[] = [];

  constructor(
    private apiService: ApiService,
    private themeService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.themeService.findAll_3().subscribe(theme => {
      // Process theme data if needed
    });
  }
  
  // Add missing methods
  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  }
  
  toggleSection(section: keyof typeof this.visibleSections): void {
    this.visibleSections[section] = !this.visibleSections[section];
  }
  
  applyFilters(): void {
    this.loading = true;
    this.loadFilteredData();
  }
  
  resetFilters(): void {
    this.selectedThemeFilter = null;
    this.selectedNiveauFilter = null;
    this.selectedDateRange = { start: null, end: null };
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load all required data in parallel
    forkJoin({
      formations: this.apiService.findAllFormations(),
      themes: this.apiService.findAll_3(),
      sessions: this.apiService.findUpcomingSessions(),
      students: this.apiService.findEtudiants(),
      instructors: this.apiService.findFormateur(),
      admins: this.apiService.findAdministrateurs()
    }).pipe(
      catchError(error => {
        console.error('Error fetching dashboard data:', error);
        this.error = 'Erreur lors du chargement des données du tableau de bord';
        this.loading = false;
        throw error;
      })
    ).subscribe(results => {
      const { formations, themes, sessions, students, instructors, admins } = results;
      
      // Process formations data
      this.processFormationsData(formations, themes);
      
      // Process sessions data
      this.processSessionsData(sessions, formations);
      
      // Process user data
      this.processUserData(students, instructors, admins);
      
      // Generate mock/sample data for additional widgets
      this.generateSampleData();
      
      // Update summary stats
      this.updateDashboardStats(formations, sessions, students, instructors);
      
      // Get unique niveaux for filters
      
      // Themes list for filters
      this.themesList = themes;
      
      this.loading = false;
    });
  }
  
  private processFormationsData(formations: any[], themes: any[]): void {
    // Process formations by theme
    const themeMap = new Map<string, number>();
    const themeIdToName = new Map<number, string>();
    
    // Create a map of theme ids to names
    themes.forEach(theme => {
      themeIdToName.set(theme.id, theme.nom);
    });
    
    // Count formations by theme
    formations.forEach(formation => {
      if (formation.themeId) {
        const themeName = themeIdToName.get(formation.themeId) || 'Autre';
        const count = themeMap.get(themeName) || 0;
        themeMap.set(themeName, count + 1);
      }
    });
    
    this.formationsByTheme = Array.from(themeMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
    
    // Process formations by niveau
    const niveauMap = new Map<string, number>();
    formations.forEach(formation => {
      if (formation.niveau) {
        const count = niveauMap.get(formation.niveau) || 0;
        niveauMap.set(formation.niveau, count + 1);
      }
    });
    
    this.formationsByNiveau = Array.from(niveauMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
    
    // Process formations by statut
    const statutMap = new Map<string, number>();
    formations.forEach(formation => {
      if (formation.statut) {
        const count = statutMap.get(formation.statut) || 0;
        statutMap.set(formation.statut, count + 1);
      } else {
        const count = statutMap.get('Non défini') || 0;
        statutMap.set('Non défini', count + 1);
      }
    });
    
    this.formationsByStatut = Array.from(statutMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
    
    // Most popular formations
    this.popularFormations = formations
      .sort((a, b) => (b.nbParticipants || 0) - (a.nbParticipants || 0))
      .slice(0, 5)
      .map(f => ({
        name: f.titre,
        niveau: f.niveau,
        theme: themeIdToName.get(f.themeId) || 'Autre',
        participants: f.nbParticipants || 0
      }));
  }
  
  private processSessionsData(sessions: any[], formations: any[]): void {
    // Map formation ids to titles
    const formationIdToTitle = new Map();
    formations.forEach(f => {
      formationIdToTitle.set(f.id, f.titre);
    });
    
    // Process upcoming sessions
    this.upcomingSessions = sessions
      .slice(0, 5)
      .map(session => ({
        name: formationIdToTitle.get(session.formationId) || 'Formation inconnue',
        value: session.nbPlaces || 0,
        extra: {
          id: session.id,
          dateDebut: new Date(session.dateDebut),
          dateFin: new Date(session.dateFin),
          lieu: session.lieu || 'Non défini',
          nbInscrits: session.nbInscrits || 0,
          formateur: session.formateurNom || 'Non assigné'
        }
      }));
      
    // Generate recent activities
    this.recentActivities = sessions
      .slice(0, 10)
      .map(session => {
        const formationTitle = formationIdToTitle.get(session.formationId) || 'Formation inconnue';
        const dateDebut = new Date(session.dateDebut);
        const now = new Date();
        
        let action;
        if (dateDebut > now) {
          action = 'Nouvelle session programmée';
        } else {
          action = 'Session commencée';
        }
        
        return {
          type: 'session',
          action: action,
          title: formationTitle,
          date: dateDebut,
          details: `${session.nbInscrits || 0} participants, ${session.lieu || 'Lieu non défini'}`
        };
      });
  }
  
  private processUserData(students: any[], instructors: any[], admins: any[]): void {
    // Process user distribution
    this.userDistribution = [
      {
        name: 'Étudiants',
        value: students.length
      },
      {
        name: 'Formateurs',
        value: instructors.length
      },
      {
        name: 'Administrateurs',
        value: admins.length
      }
    ];
  }
  
  private generateSampleData(): void {
    // Generate student progress by month (sample data)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentMonth = new Date().getMonth();
    
    this.studentProgressByMonth = months
      .slice(0, currentMonth + 1)
      .map((month, index) => ({
        name: month,
        value: Math.floor(Math.random() * 30) + 70 // Random completion rate between 70-100%
      }));
      
    // Generate revenue by month (sample data)
    this.revenueByMonth = months
      .slice(0, currentMonth + 1)
      .map((month, index) => ({
        name: month,
        value: Math.floor(Math.random() * 50000) + 30000 // Random revenue between 30000-80000
      }));
      
    // Generate satisfaction by formation (sample data)
    this.satisfactionByFormation = this.popularFormations.map(formation => ({
      name: formation.name,
      value: Math.floor(Math.random() * 30) + 70 // Random satisfaction between 70-100%
    }));
  }
  
  private updateDashboardStats(formations: any[], sessions: any[], students: any[], instructors: any[]): void {
    this.dashboardStats = {
      totalFormations: formations.length,
      totalSessions: sessions.length,
      totalStudents: students.length,
      totalInstructors: instructors.length,
      completionRate: Math.floor(Math.random() * 20) + 80, // Sample: 80-100%
      satisfactionRate: Math.floor(Math.random() * 20) + 75, // Sample: 75-95%
      avgAttendance: Math.floor(Math.random() * 30) + 70, // Sample: 70-100%
      mostPopularFormation: this.popularFormations.length > 0 ? this.popularFormations[0].name : 'Aucune',
      mostActiveInstructor: instructors.length > 0 ? 
        instructors.sort((a, b) => (b.nbSessions || 0) - (a.nbSessions || 0))[0]?.nom || 'Aucun' : 'Aucun'
    };
  }
  
  private loadFilteredData(): void {
    // This would filter data based on selected filters
    // For this example, we'll just simulate a delay and reuse existing data
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  onSelect(event: any): void {
    console.log('Item clicked', event);
  }
  
  exportData(format: string): void {
    console.log(`Exporting data in ${format} format`);
    // Implementation for exporting data would go here
  }
  
  refreshData(): void {
    this.loadDashboardData();
  }
}