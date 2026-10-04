// Mise à jour du modèle de données pour intégrer les nouveaux KPI

// Mise à jour de la classe component pour traiter les nouveaux champs
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/cni-api/src/services';
import { forkJoin, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import {
  FormationsDto,
  SallesDto,
  SessionsDto,
  Utilisateurs,
  UtilisateursDto,
} from 'src/cni-api/src/models';

@Component({
  selector: 'app-tableau-de-bord-formations',
  templateUrl: './tableau-de-bord-formations.component.html',
  styleUrls: ['./tableau-de-bord-formations.component.css'],
})
export class TableauDeBordFormationsComponent implements OnInit {
  legendPosition: LegendPosition = 'below' as LegendPosition;
  loading = true;
  error: string | null = null;
  currentTheme = 'light';
  // Dashboard sections visibility control
  visibleSections = {
    overview: true,
    formations: true,
    competences: true,
    instructors: true,
    finances: true, // Nouvelle section pour les tarifs et données financières
    participation: true, // Nouvelle section pour les détails de participation
  };
  // Data for charts - Existantes et nouvelles
  formationsByTheme: any[] = [];
  formationsByNiveau: any[] = [];
  formationsByStatut: any[] = [];
  formationsByDuree: any[] = [];
  formationsTendance: any[] = [];
  formationsByType: any[] = []; // Nouveau graphique pour TYPE FORMATION
  formationsBySalle: any[] = [];
  sessionsByMonth: any[] = [];
  sessionsByyear: any[] = [];
  formationsByParticipationType: any[] = [];
  tarifMoyenByType: any[] = [];
  participantsByYear: any[] = []; // Évolution participation par année
  competencesCouvertes: any[] = [];
  satisfactionByFormation: any[] = [];
  formationCompletionRate: any[] = [];
  formationAttendanceRate: any[] = [];
  formationsDemandees: any[] = [];
  dashboardStats = {
    totalFormations: 0,
    totalSessions: 0,
    totalStudents: 0,
    totalInstructors: 0,
    completionRate: 0,
    satisfactionRate: 0,
    avgAttendance: 0,
    tauxRemplissage: 0,
    nbFormationsActives: 0,
    hoursDelivered: 0,
    totalInstructorsinterne: 0,
    totalInstructorsexterne: 0,
    totalPersonnelCNI: 0,
    tarifMoyen: 0, // Nouveau
    nbFormationsParMois: 0,
    revenusTotal: 0, // Nouveau
  };
  selectedPrixMin: number | null = null;
  selectedPrixMax: number | null = null;
  // Données étendues pour les filtres
  selectedThemeFilter: string | null = null;
  selectedNiveauFilter: string | null = null;
  selectedTypeFilter: string | null = null; // Nouveau
  selectedDateRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };
  selectedFormateurFilter: string | null = null;
  selectedStatusFilter: string | null = null;
  selectedSalleFilter: string | null = null; // Nouveau
  selectedAnneeFilter: number | null = null; // Nouveau
  selectedMoisFilter: number | null = null; // Nouveau
  // Listes de référence pour les filtres (étendues)
  themesList: any[] = [];
  niveauxList: string[] = [];
  formateursList: any[] = [];
  sallesList: any[] = []; // Nouveau
  anneesList: number[] = []; // Nouveau
  moisList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  statusList: any[] = [];
  popularFormations: any[] = [];
  formationsAvenir: any[] = [];
  formateursPerformance: UtilisateursDto[] = [];
  formationsParticipants: any[] = [];
  formationsFinancialData: any[] = []; // Nouveau tableau avec données financières
  formationsDetailedData: any[] = []; // Nouveau tableau avec les détails complets
  viewPie: [number, number] = [350, 300];
  viewBar: [number, number] = [350, 300];
  viewLine: [number, number] = [800, 500];
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  timeline = true;
  colorSchemeBlue: Color = {
    name: 'colorSchemeBlue',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#a2d2ff', '#bde0fe', '#c7f0fa', '#d0f7ff', '#e0faff'], // Pastel bleus
  };
  colorSchemeMulti: Color = {
    name: 'colorSchemeMulti',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff'], // Palette multi en pastel
  };
  colorSchemeGreen: Color = {
    name: 'colorSchemeGreen',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#d0f0c0', '#c8e6c9', '#b9f6ca', '#dcedc1', '#e8f5e9'], // Nuances de vert pastel
  };
  colorSchemeWarm: Color = {
    name: 'colorSchemeWarm',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ffcccb', '#ffdab9', '#ffefd5', '#fffacd', '#f5deb3'], // Tons chauds et pastel
  };
  colorRed: Color = {
    name: 'colorRed',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF0000	'],
  };
  constructor(
    private apiService: ApiService,
    private themeService: ApiService
  ) {}
  ngOnInit(): void {
    this.loadDashboardData();
  }
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
    this.selectedTypeFilter = null;
    this.selectedDateRange = { start: null, end: null };
    this.selectedFormateurFilter = null;
    this.selectedStatusFilter = null;
    this.selectedSalleFilter = null;
    this.selectedAnneeFilter = null;
    this.selectedMoisFilter = null;
    this.loadDashboardData();
  }
  loadDashboardData(): void {
    this.loading = true;
    // Load all required data in parallel
    forkJoin({
      formations: this.apiService.findAllFormations(),
      themes: this.apiService.findAll_3(),
      salles: this.apiService.getAllSalles(),
      sessions: this.apiService.findAll_2(),
      upcomingSessions: this.apiService.findUpcomingSessions(),
      students: this.apiService.findEtudiants(),
      instructors: this.apiService.findFormateur(),
      instructorsinterne: this.apiService.findFormateurinterne(),
      instructorsexterne: this.apiService.findFormateurexterne(),
      personnelCNI: this.apiService.findPersonnelCNI(),
      janvier: this.apiService.findByDateBetween({
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      }),
      fevrier: this.apiService.findByDateBetween({
        startDate: '2025-02-01',
        endDate: '2025-02-28',
      }),
      mars: this.apiService.findByDateBetween({
        startDate: '2025-03-01',
        endDate: '2025-03-31',
      }),
      avril: this.apiService.findByDateBetween({
        startDate: '2025-04-01',
        endDate: '2025-04-30',
      }),
      mai: this.apiService.findByDateBetween({
        startDate: '2025-05-01',
        endDate: '2025-05-31',
      }),
      juin: this.apiService.findByDateBetween({
        startDate: '2025-06-01',
        endDate: '2025-06-30',
      }),
      juillet: this.apiService.findByDateBetween({
        startDate: '2025-07-01',
        endDate: '2025-07-31',
      }),
      aout: this.apiService.findByDateBetween({
        startDate: '2025-08-01',
        endDate: '2025-08-31',
      }),
      septembre: this.apiService.findByDateBetween({
        startDate: '2025-09-01',
        endDate: '2025-09-30',
      }),
      octobre: this.apiService.findByDateBetween({
        startDate: '2025-10-01',
        endDate: '2025-10-31',
      }),
      novembre: this.apiService.findByDateBetween({
        startDate: '2025-11-01',
        endDate: '2025-11-30',
      }),
      decembre: this.apiService.findByDateBetween({
        startDate: '2025-12-01',
        endDate: '2025-12-31',
      }),
      year_2024: this.apiService.findByDateBetween({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      }),
      2023: this.apiService.findByDateBetween({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      }),
      year_2025: this.apiService.findByDateBetween({
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      }),
    })
      .pipe(
        catchError((error) => {
          console.error('Error fetching dashboard data:', error);
          this.error =
            'Erreur lors du chargement des données du tableau de bord';
          this.loading = false;
          throw error;
        })
      )
      .subscribe((results) => {
        const {
          formations,
          themes,
          salles,
          sessions,
          upcomingSessions,
          students,
          instructors,
          instructorsinterne,
          instructorsexterne,
          personnelCNI,
          janvier,
          fevrier,
          mars,
          avril,
          mai,
          juin,
          juillet,
          aout,
          septembre,
          octobre,
          novembre,
          decembre,
        } = results;
        // Enrichir les formations avec les nouveaux champs
        const enrichedFormations = this.enrichFormationsData(formations);
        // Process formations data
        this.processFormationsData(
          enrichedFormations,
          themes,
          salles,
          sessions
        );
        // Process sessions data
        this.processSessionsData(sessions, enrichedFormations);
        // Process upcoming sessions
        this.processUpcomingSessions(upcomingSessions, enrichedFormations);
        // Traiter les données financières et de participation
        this.processFinancialData(enrichedFormations);
        this.processParticipationData(enrichedFormations);
        // Update summary stats
        this.updateDashboardStats(
          sessions,
          students,
          instructors,
          instructorsinterne,
          instructorsexterne,
          personnelCNI,
          [],
          [] // Add the missing evaluations argument
        );
        this.sessionsByMonth = [
          { name: 'Janvier', value: janvier.length },
          { name: 'Février', value: fevrier.length },
          { name: 'Mars', value: mars.length },
          { name: 'Avril', value: avril.length },
          { name: 'Mai', value: mai.length },
          { name: 'Juin', value: juin.length },
          { name: 'Juillet', value: juillet.length },
          { name: 'Août', value: aout.length },
          { name: 'Septembre', value: septembre.length },
          { name: 'Octobre', value: octobre.length },
          { name: 'Novembre', value: novembre.length },
          { name: 'Décembre', value: decembre.length },
        ];

        // Prepare filter options
        this.prepareFilterOptions(
          enrichedFormations,
          themes,
          instructors,
          salles
        );

        this.loading = false;
      });
  }
  // Enrichir les données des formations avec les champs manquants
  private enrichFormationsData(formations: any[]): any[] {
    const currentYear = new Date().getFullYear();
    return formations.map((formation) => {
      const dateDebut = formation.dateDebut
        ? new Date(formation.dateDebut)
        : this.generateRandomDate(currentYear);
      const dateFin = formation.dateFin
        ? new Date(formation.dateFin)
        : this.generateRandomEndDate(dateDebut);
      // Calculer le nombre de jours entre les dates
      const diffTime = Math.abs(dateFin.getTime() - dateDebut.getTime());
      const nombreJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      // Calculer des statistiques pertinentes concernant les participants
      const nbParticipants =
        0;
      const nbrPersonnesExternes = 0
      // Générer un tarif cohérent basé sur la durée et le niveau
      const niveauTarifMultiplier =
        formation.niveau === 'Avancé'
          ? 1.5
          : formation.niveau === 'Intermédiaire'
          ? 1.2
          : 1;
      const tarif = Math.round(
        (nombreJours * 300 + (formation.dureeHeures || 0) * 50) *
          niveauTarifMultiplier
      );
      return {
        ...formation,
        reference: `CNI-${formation.id}-${currentYear}`,
        annee: dateDebut.getFullYear(),
        mois: dateDebut.getMonth() + 1,
        dateDebut: dateDebut,
        dateFin: dateFin,
        nombreJours: nombreJours,
        formateurNom: formation.formateurNom || 'À désigner',
        salleNom: formation.salleNom || this.getSalleName(),
        tarif: tarif,
        nbrPersonnesExternes: nbrPersonnesExternes,
        themeName: '', // Sera rempli lors du traitement
      };
    });
  }

  private getSalleName(): string {
    let sallesList: any[] = [];
    this.apiService.getAllSalles().subscribe((salles) => {
      sallesList = salles;
    });

    return sallesList[Math.floor(Math.random() * sallesList.length)];
  }
  private generateRandomDate(year: number): Date {
    const month = 0;
    const day = 0;
    return new Date(year, month, day);
  }
  private generateRandomEndDate(startDate: Date): Date {
    const endDate = new Date();
    return endDate;
  }
  private processFormationsData(
    formations: any[],
    themes: any[],
    salles: any[],
    sessions: any[]
  ): void {
    const themeIdToName = new Map<number, string>();
    themes.forEach((theme) => {
      themeIdToName.set(theme.id, theme.nom);
    });
    const salleIdToName = new Map<number, string>();
    salles.forEach((salle) => {
      salleIdToName.set(salle.id, salle.nom);
    });
    formations.forEach((formation) => {
      if (formation.themeId) {
        formation.themeName = themeIdToName.get(formation.themeId) || 'Autre';
      }
    });
    const themeMap = new Map<string, number>();
    formations.forEach((formation) => {
      if (formation.themeId) {
        const themeName = themeIdToName.get(formation.themeId) || 'Autre';
        const count = themeMap.get(themeName) || 0;
        themeMap.set(themeName, count + 1);
      }
    });
    this.formationsByTheme = Array.from(themeMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    const salleMap = new Map<string, number>();
    console.log('Sessions:', sessions);
    console.log('Sessions length:', sessions.length);
    sessions.forEach((session) => {
      const correspondingSalle = salles.find(
        (salle) => salle.id === session.salleId
      );
      const salleName = correspondingSalle?.nom || 'Non définie';
      const count = salleMap.get(salleName) || 0;
      salleMap.set(salleName, count + 1);
    });
    this.formationsBySalle = Array.from(salleMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    console.log('Resulting salleMap:', salleMap);
    console.log('formationsBySalle:', this.formationsBySalle);

    // Process formations by niveau
    const niveauMap = new Map<string, number>();
    const niveauxSet = new Set<string>();
    formations.forEach((formation) => {
      if (formation.niveau) {
        niveauxSet.add(formation.niveau);
        const count = niveauMap.get(formation.niveau) || 0;
        niveauMap.set(formation.niveau, count + 1);
      }
    });
    this.niveauxList = Array.from(niveauxSet);
    this.formationsByNiveau = Array.from(niveauMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    // Process formations by month (nouveau)
    const monthMap = new Map<number, number>();
    sessions.forEach((session) => {
      if (session.dateDebut) {
        const month = new Date(session.dateDebut).getMonth() + 1; // getMonth() retourne 0 pour janvier
        const count = monthMap.get(month) || 0;
        monthMap.set(month, count + 1);
      }
    });

    // Transformation des données pour l'affichage par mois
    this.sessionsByMonth = Array.from(monthMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([month, value]) => ({
        name: this.getMonthName(month),
        value,
      }));

    // Comptage par année
    const yearMap = new Map<number, number>();
    sessions.forEach((session) => {
      if (session.dateDebut) {
        const year = new Date(session.dateDebut).getFullYear();
        const count = yearMap.get(year) || 0;
        yearMap.set(year, count + 1);
      }
    });

    // Transformation des données pour l'affichage par année
    this.sessionsByyear = Array.from(yearMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, value]) => ({
        name: year.toString(),
        value,
      }));

    console.log('Sessions par mois:', this.sessionsByMonth);
    console.log('Sessions par année:', this.sessionsByyear);

    // Process formations by statut
    const statutMap = new Map<string, number>();
    formations.forEach((formation) => {
      if (formation.statut) {
        const count = statutMap.get(formation.statut) || 0;
        statutMap.set(formation.statut, count + 1);
      } else {
        const count = statutMap.get('Non défini') || 0;
        statutMap.set('Non défini', count + 1);
      }
    });
    this.formationsByStatut = Array.from(statutMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    // Process formations by durée
    const dureeMap = new Map<string, number>();
    formations.forEach((formation) => {
      let dureeRange = 'Non définie';
      if (formation.nombreJours) {
        if (formation.nombreJours <= 1) dureeRange = '1 jour ou moins';
        else if (formation.nombreJours <= 2) dureeRange = '2 jours';
        else if (formation.nombreJours <= 3) dureeRange = '3 jours';
        else if (formation.nombreJours <= 5) dureeRange = '1 semaine';
        else dureeRange = "Plus d'une semaine";
      }
      const count = dureeMap.get(dureeRange) || 0;
      dureeMap.set(dureeRange, count + 1);
    });
    this.formationsByDuree = Array.from(dureeMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    // Process competences couvertes
    const competencesMap = new Map<string, number>();
    formations.forEach((formation) => {
      if (formation.competences && Array.isArray(formation.competences)) {
        formation.competences.forEach((competence: string) => {
          const count = competencesMap.get(competence) || 0;
          competencesMap.set(competence, count + 1);
        });
      }
    });
    this.competencesCouvertes = Array.from(competencesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({
        name,
        value,
      }));
    // Most popular formations (by enrollment)
    this.popularFormations = formations
      .sort((a, b) => (b.nbParticipants || 0) - (a.nbParticipants || 0))
      .slice(0, 5)
      .map((f) => ({
        name: f.titre,
        reference: f.reference,
        niveau: f.niveau,
        type: f.type,
        theme: f.themeName,
        participants: f.nbParticipants || 0,
      }));
    // Formations with most participants
    this.formationsParticipants = formations
      .filter((f) => f.statut === 'Active')
      .sort((a, b) => (b.nbParticipants || 0) - (a.nbParticipants || 0))
      .slice(0, 10)
      .map((f) => ({
        id: f.id,
        titre: f.titre,
        reference: f.reference,
        theme: f.themeName,
        niveau: f.niveau,
        type: f.type,
        duree: f.nombreJours || 0,
        nbParticipants: f.nbParticipants || 0,
        nbExternes: f.nbrPersonnesExternes || 0,
        nbCNI: f.nbrPersonnelCNI || 0,
        tauxRemplissage: Math.min(
          100,
          Math.floor(((f.nbParticipants || 0) / (f.capaciteMax || 20)) * 100)
        ),
      }));
    // Créer tableau détaillé avec tous les nouveaux champs
    this.formationsDetailedData = formations
      .sort(
        (a, b) =>
          new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime()
      ) // Tri sur la date de début
      .map((f) => ({
        id: f.id,
        anneeFormation: new Date(f.dateDebut).getFullYear(),
        mois: new Date(f.dateDebut).getMonth() + 1, // Mois commence à 0
        reference: f.reference,
        type: f.niveau,
        theme: f.themeName,
        dateDebut: f.dateDebut,
        dateFin: f.dateFin,
        nombreJours: f.nombreJours,
        formateur: f.formateurNom,
        salle: f.salleNom,
        tarif: f.tarif,
        nbParticipants: f.nbParticipants || 0,
        nbExternes: f.nbrPersonnesExternes || 0,
        nbCNI: f.nbrPersonnelCNI || 0,
        chiffreAffaire: f.chiffreAffaire || 0, // Ajouter un champ pour le chiffre d'affaire
        noteSatisfactionGlobale: f.noteSatisfactionGlobale || 'N/A', // Ajouter un champ pour la note de satisfaction
      }));
  }
  private processFinancialData(formations: any[]): void {
    // Calculate tarif moyen par type de formation
    const tarifByType = new Map<string, { total: number; count: number }>();

    formations.forEach((formation) => {
      if (formation.type && formation.tarif) {
        const data = tarifByType.get(formation.type) || { total: 0, count: 0 };
        data.total += formation.tarif;
        data.count += 1;
        tarifByType.set(formation.type, data);
      }
    });
    this.tarifMoyenByType = Array.from(tarifByType.entries()).map(
      ([type, data]) => ({
        name: type,
        value: Math.round(data.total / data.count),
      })
    );
    // Create financial table data
    this.formationsFinancialData = formations
      .filter((f) => f.tarif)
      .sort((a, b) => b.tarif - a.tarif)
      .slice(0, 10)
      .map((f) => ({
        id: f.id,
        titre: f.titre,
        reference: f.reference,
        type: f.type,
        theme: f.themeName,
        tarif: f.tarif,
        revenuEstime: f.tarif * f.nbParticipants,
        revenuExternes: f.tarif * f.nbrPersonnesExternes,
        revenuInterne: f.tarif * f.nbrPersonnelCNI,
      }));
    // Calculate total revenue
    this.dashboardStats.revenusTotal = formations.reduce(
      (total, f) => total + (f.tarif || 0) * (f.nbParticipants || 0),
      0
    );

    // Calculate average tarif
    this.dashboardStats.tarifMoyen = Math.round(
      formations.reduce((total, f) => total + (f.tarif || 0), 0) /
        formations.filter((f) => f.tarif).length
    );
  }
  private processParticipationData(formations: any[]): void {
    // Calculate participants by type (externe vs CNI)
    const totalExternes = formations.reduce(
      (sum, f) => sum + (f.nbrPersonnesExternes || 0),
      0
    );
    const totalCNI = formations.reduce(
      (sum, f) => sum + (f.nbrPersonnelCNI || 0),
      0
    );

    this.dashboardStats.totalInstructorsexterne = totalExternes;
    this.dashboardStats.totalPersonnelCNI = totalCNI;
    // Calculate participants by year
    const participantsByYear = new Map<
      number,
      { externe: number; cni: number }
    >();
    formations.forEach((f) => {
      if (f.annee) {
        const yearData = participantsByYear.get(f.annee) || {
          externe: 0,
          cni: 0,
        };
        yearData.externe += f.nbrPersonnesExternes || 0;
        yearData.cni += f.nbrPersonnelCNI || 0;
        participantsByYear.set(f.annee, yearData);
      }
    });
    // Format for multi-series chart
    const externesSeries = { name: 'Externes', series: [] as any[] };
    const cniSeries = { name: 'Personnel CNI', series: [] as any[] };
    Array.from(participantsByYear.entries())
      .sort((a, b) => a[0] - b[0])
      .forEach(([year, data]) => {
        externesSeries.series.push({
          name: year.toString(),
          value: data.externe,
        });
        cniSeries.series.push({ name: year.toString(), value: data.cni });
      });
    this.participantsByYear = [externesSeries, cniSeries];
    // Calculate formations for current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    this.dashboardStats.nbFormationsParMois = formations.filter(
      (f) => f.mois === currentMonth && f.annee === currentYear
    ).length;
  }
  private getMonthNumber(monthName: string): number {
    const monthNames = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    return monthNames.indexOf(monthName) + 1; // +1 car les mois sont indexés à partir de 1
  }
  private getMonthName(monthNumber: number): string {
    const monthNames = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    return monthNames[monthNumber - 1]; // -1 car les tableaux sont indexés à partir de 0
  }
  // Autres méthodes existantes...
  private processSessionsData(sessions: any[], formations: any[]): void {
    // Map formation ids to formation objects
    const formationMap = new Map();
    formations.forEach((f) => {
      formationMap.set(f.id, f);
    });

    // Calculate total hours delivered
    let totalHoursDelivered = 0;
    sessions.forEach((session) => {
      const formation = formationMap.get(session.formationId);
      if (formation && formation.dureeHeures) {
        totalHoursDelivered += formation.dureeHeures;
      }
    });
    this.dashboardStats.hoursDelivered = totalHoursDelivered;

    // Calculate completion rates by formation
    const completionMap = new Map<
      string,
      { completed: number; total: number }
    >();
    sessions.forEach((session) => {
      if (!session.formationId) return;
      const formation = formationMap.get(session.formationId);
      if (!formation) return;
      const formationTitle = formation.titre || 'Formation inconnue';
      let stats = completionMap.get(formationTitle) || {
        completed: 0,
        total: 0,
      };
      stats.total += session.nbInscrits || 0;
      stats.completed += Math.floor(
        ((session.nbInscrits || 0) * (session.tauxCompletion || 0)) / 100
      );
      completionMap.set(formationTitle, stats);
    });
    this.formationCompletionRate = Array.from(completionMap.entries())
      .filter(([_, stats]) => stats.total > 0)
      .map(([name, stats]) => ({
        name,
        value: Math.round((stats.completed / stats.total) * 100),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Calculate attendance rates by formation
    const attendanceMap = new Map<
      string,
      { attended: number; total: number }
    >();
    sessions.forEach((session) => {
      if (!session.formationId) return;
      const formation = formationMap.get(session.formationId);
      if (!formation) return;
      const formationTitle = formation.titre || 'Formation inconnue';
      let stats = attendanceMap.get(formationTitle) || {
        attended: 0,
        total: 0,
      };
      stats.total += session.nbInscrits || 0;
      stats.attended += Math.floor(
        ((session.nbInscrits || 0) * (session.tauxPresence || 0)) / 100
      );
      attendanceMap.set(formationTitle, stats);
    });
    this.formationAttendanceRate = Array.from(attendanceMap.entries())
      .filter(([_, stats]) => stats.total > 0)
      .map(([name, stats]) => ({
        name,
        value: Math.round((stats.attended / stats.total) * 100),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Trend of formations over time (by month)
    const monthlyData = new Map<string, number>();
    const last12Months = this.getLast12Months();

    // Initialize all months with zero
    last12Months.forEach((month) => {
      monthlyData.set(month, 0);
    });

    // Count sessions per month
    sessions.forEach((session) => {
      if (session.dateDebut) {
        const sessionDate = new Date(session.dateDebut);
        const monthYear = `${this.getMonthName(
          sessionDate.getMonth() + 1
        )} ${sessionDate.getFullYear()}`;
        if (monthlyData.has(monthYear)) {
          monthlyData.set(monthYear, monthlyData.get(monthYear)! + 1);
        }
      }
    });

    // Format for chart
    this.formationsTendance = [
      {
        name: 'Sessions par mois',
        series: Array.from(monthlyData.entries())
          .sort((a, b) => {
            // Trier les mois chronologiquement
            const [monthA, yearA] = a[0].split(' ');
            const [monthB, yearB] = b[0].split(' ');
            const dateA = new Date(
              `${yearA}-${this.getMonthNumber(monthA)}-01`
            );
            const dateB = new Date(
              `${yearB}-${this.getMonthNumber(monthB)}-01`
            );
            return dateA.getTime() - dateB.getTime();
          })
          .map(([name, value]) => ({
            name,
            value,
          })),
      },
    ];

    // Satisfaction by formation
    const satisfactionMap = new Map<string, number>();
    sessions.forEach((session) => {
      if (!session.formationId || !session.satisfaction) return;
      const formation = formationMap.get(session.formationId);
      if (!formation) return;
      const formationTitle = formation.titre || 'Formation inconnue';
      satisfactionMap.set(formationTitle, session.satisfaction);
    });
    this.satisfactionByFormation = Array.from(satisfactionMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  } /********************************************************************* */
  private processUpcomingSessions(
    upcomingSessions: SessionsDto[],
    formations: FormationsDto[]
  ): void {
    // Map formation ids to formation objects
    const formationMap = new Map<number, FormationsDto>();
    formations.forEach((formation) => {
      if (formation.id) {
        formationMap.set(formation.id, formation);
      }
    });

    // Create a list to store observables for each session
    const sessionObservables = upcomingSessions
      .filter((session) => session.formationId)
      .map((session) => {
        const formation = session.formationId
          ? formationMap.get(session.formationId)
          : undefined;
        const nbInscrits = session.capacite
          ? session.capacite - (session.placesDisponibles || 0)
          : 0;
        const capaciteMax = formation?.placesMax || 0;

        // Calculate registration rate
        const tauxInscription =
          capaciteMax > 0
            ? Math.min(100, Math.floor((nbInscrits / capaciteMax) * 100))
            : 0;

        // Get formateur data as observable
        return this.apiService.getFormateur(session.sessionId).pipe(
          map((formateurs: Array<Utilisateurs>) => {
            console.log(session.sessionId);
            console.log(this.apiService.getFormateur(session.sessionId));

            // Concaténer tous les noms des formateurs dans une seule chaîne
            const formateurNom =
              formateurs.length > 0
                ? formateurs
                    .map((f) => `${f.nom || ''} ${f.prenom || ''}`.trim())
                    .join(', ')
                : 'Formateur inconnu';

            // Get salle data as observable
            return this.apiService.findById_4(session.salleId).pipe(
              map((salle: SallesDto) => {
                const salleNom = salle?.nom || 'Salle inconnue';

                return {
                  id: session.sessionId,
                  titre: formation?.titre || 'Formation inconnue',
                  reference: formation?.id?.toString() || '',
                  referenceSession: session.sessionId || '',
                  theme: formation?.themeId?.toString() || '',
                  dateDebut: session.dateDebut || '',
                  dateFin: session.dateFin || '',
                  formateur: formateurNom,
                  salle: salleNom,
                  nbInscrits,
                  capaciteMax,
                  tauxInscription,
                };
              }) // Fermeture de la deuxième parenthèse
            ); // Fermeture de la première parenthèse
          }) // Fermeture de la première parenthèse
        ); // Fermeture du pipe de getFormateur
      });

    // Combine all observables and subscribe to the result
    forkJoin(sessionObservables).subscribe(
      (processedSessions) => {
        forkJoin(processedSessions).subscribe((sessions) => {
          this.formationsAvenir = sessions
            .sort(
              (a, b) =>
                new Date(a.dateDebut).getTime() -
                new Date(b.dateDebut).getTime()
            )
            .slice(0, 5);
          // Log for debugging
          console.log('Formations à venir:', this.formationsAvenir);
        });
      },
      (error) => {
        console.error('Error processing upcoming sessions:', error);
        this.formationsAvenir = [];
      }
    );
  }

  private updateDashboardStats(
    formations: any[],
    sessions: any[],
    students: any[],
    instructors: any[],
    instructorsinterne: any[],
    instructorsexterne: any[],
    personnelCNI: any[],
    evaluations: any[]
  ): void {
    this.dashboardStats.totalFormations = formations.length;
    this.dashboardStats.totalSessions = sessions.length;
    this.dashboardStats.totalStudents = students.length;
    this.dashboardStats.totalInstructors = instructors.length;
    this.dashboardStats.totalInstructorsinterne = instructorsinterne.length;
    this.dashboardStats.totalInstructorsexterne = instructorsexterne.length;
    this.dashboardStats.totalPersonnelCNI = personnelCNI.length;

    // Calculate completion rate
    const completedSessions = sessions.filter(
      (s) => s.tauxCompletion >= 90
    ).length;
    this.dashboardStats.completionRate =
      Math.round((completedSessions / sessions.length) * 100) || 0;

    // Calculate satisfaction rate
    const totalSatisfaction = sessions.reduce(
      (sum, session) => sum + (session.satisfaction || 0),
      0
    );
    this.dashboardStats.satisfactionRate =
      Math.round(totalSatisfaction / sessions.length) || 0;

    // Calculate average attendance
    const totalAttendance = sessions.reduce(
      (sum, session) => sum + (session.tauxPresence || 0),
      0
    );
    this.dashboardStats.avgAttendance =
      Math.round(totalAttendance / sessions.length) || 0;
    // Calculate taux de remplissage
    let totalCapacity = 0;
    let totalParticipants = 0;

    sessions.forEach((session) => {
      const formation = formations.find((f) => f.id === session.formationId);
      if (formation) {
        totalCapacity += formation.capaciteMax || 0;
        totalParticipants += session.nbInscrits || 0;
      }
    });
    this.dashboardStats.tauxRemplissage =
      Math.round((totalParticipants / totalCapacity) * 100) || 0;

    // Formations actives
    this.dashboardStats.nbFormationsActives = formations.filter(
      (f) => f.statut === 'Active'
    ).length;
  }
  private prepareFilterOptions(
    formations: any[],
    themes: any[],
    instructors: any[],
    salles: any[]
  ): void {
    // Prepare theme options
    this.themesList = themes.map((theme) => ({
      id: theme.id,
      nom: theme.nom,
    }));
    // Prepare formateur options
    this.formateursList = instructors;

    // Prepare salle options
    this.sallesList = salles;
    // Extract unique années from formations
    const yearsSet = new Set<number>();
    formations.forEach((formation) => {
      if (formation.annee) {
        yearsSet.add(formation.annee);
      }
    });
    this.anneesList = Array.from(yearsSet).sort();
  }
  private loadFilteredData(): void {
    this.loading = true;
    const prixMin = this.selectedPrixMin || 0;
    const prixMax = this.selectedPrixMax || Number.MAX_SAFE_INTEGER;

    // Utiliser le service web pour filtrer par prix
    this.apiService
      .findAllFormations()
      .pipe(
        map((prixFilteredFormations: FormationsDto[]) => {
          // Filtrer davantage les formations
          return prixFilteredFormations.filter((formation: FormationsDto) => {
            // Filtre par thème
            if (
              this.selectedThemeFilter &&
              formation.themeId !== parseInt(this.selectedThemeFilter)
            ) {
              return false;
            }

            // Filtre par niveau
            if (
              this.selectedNiveauFilter &&
              formation.niveau !== this.selectedNiveauFilter
            ) {
              return false;
            }

            // Filtre par statut
            if (
              this.selectedStatusFilter &&
              formation.statut !== this.selectedStatusFilter
            ) {
              return false;
            }

            return true;
          });
        }),
        catchError((error) => {
          console.error(
            'Erreur lors du chargement des données filtrées:',
            error
          );
          this.error = 'Erreur lors du chargement des données filtrées';
          this.loading = false;
          throw error;
        })
      )
      .subscribe((filteredFormations) => {
        // Reprocess data with filtered formations
        forkJoin({
          themes: this.apiService.findAll_3(),
          salles: this.apiService.getAllSalles(),
          sessions: this.apiService.findAll_2(),
          upcomingSessions: this.apiService.findUpcomingSessions(),
          students: this.apiService.findEtudiants(),
          instructors: this.apiService.findFormateur(),
          instructorsinterne: this.apiService.findFormateurinterne(),
          instructorsexterne: this.apiService.findFormateur(),
          personnelCNI: this.apiService.findPersonnelCNI(),
        }).subscribe((results) => {
          const {
            themes,
            salles,
            sessions,
            upcomingSessions,
            students,
            instructors,
            instructorsinterne,
            instructorsexterne,
            personnelCNI,
          } = results;

          // Filtrer sessions correspondant aux formations filtrées
          const filteredSessions = sessions.filter((session) =>
            filteredFormations.some((f) => f.id === session.formationId)
          );

          // Update summary stats
          this.updateDashboardStats(
            filteredFormations,
            filteredSessions,
            students,
            instructors,
            instructorsinterne,
            instructorsexterne,
            personnelCNI,
            []
          );

          this.loading = false;
        });
      });
  }
  private getLast12Months(): string[] {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(`${this.getMonthName(d.getMonth() + 1)} ${d.getFullYear()}`);
    }
    return months.reverse();
  }
  // Export data to CSV
  exportToCSV(data: any[], filename: string): void {
    if (!data || !data.length) {
      console.warn('No data to export');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
      // Header row
      headers.join(','),
      // Data rows
      ...data.map((row) =>
        headers
          .map((header) => {
            let value = row[header];
            // Format dates
            if (value instanceof Date) {
              value = value.toLocaleDateString('fr-FR');
            }
            // Handle commas and quotes in string values
            if (
              typeof value === 'string' &&
              (value.includes(',') || value.includes('"'))
            ) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(',')
      ),
    ];
    // Create and download the CSV file
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // Print dashboard
  printDashboard(): void {
    window.print();
  }
}
