import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as saveAs from 'file-saver';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { ApiService } from 'src/cni-api/src/services/api.service';

// Interface améliorée pour les paiements
export interface PaiementsDto {
  id?: number;
  montant: number;
  datePaiement: string;
  utilisateurId: number;
  inscriptionId: number;
  formationId?: number;
  modePaiement: string;
  statut: string;
  reference?: string;
  dateEcheance?: string;
  commentaire?: string;
  source?: string; // Source du paiement pour l'analyse
}

@Component({
  selector: 'app-tableau-de-bord-finance',
  templateUrl: './tableau-de-bord-finance.component.html',
  styleUrls: ['./tableau-de-bord-finance.component.css'],
})
export class TableauDeBordFinanceComponent implements OnInit {
  // États
  loading = true;
  error = false;
  visibleSections = {
    finances: true,
  };

  // Statistiques financières enrichies
  financialStats = {
    chiffreAffaireTotal: 0,
    revenuMoyenFormation: 0,
    nbFormationsActives: 0, // Nombre de formations actives
    revenuParParticipant: 0,
    nbParticipantsTotal: 0, // Nombre total de participants
    tauxRentabilite: 0,
    coutTotalFormateurs: 0,
    pctCoutFormateurs: 0, // % des coûts totaux
    coutTotalEmployes: 0,
    pctCoutEmployes: 0, // % des coûts totaux
    profitTotal: 0,
    montantImpaye: 0, // Montant des paiements impayés
    pctImpaye: 0, // % du CA total
    tauxConversionProspects: 0, // Taux de conversion des prospects
    nbProspectsConvertis: 0, // Nombre de prospects convertis
  };

  // Données pour les graphiques
  chiffreAffaireByMonth: any[] = [];
  revenusComparison: any[] = [];
  rentabiliteByType: any[] = [];
  revenueBySource: any[] = [];
  financialAnalysisData: any[] = [];
  financialForecast: any[] = [];
  paiementsByStatus: any[] = [];
  paiementsByMode: any[] = [];
  coutsByPeriode: any[] = [];
  evolutionPaiements: any[] = [];

  // Données brutes (pour analyses et exports)
  formations: any[] = [];
  sessions: any[] = [];
  inscriptions: any[] = [];
  paiements: any[] = [];
  utilisateurs: any[] = [];

  // Configuration des graphiques
  viewBar: [number, number] = [500, 300];
  viewBar1: [number, number] = [1350, 300];

  viewPie: [number, number] = [500, 300];
  viewLine: [number, number] = [1350, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  colorSchemeMulti: Color = {
    name: 'colorSchemeMulti',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#a2d2ff', '#cdb4db', '#ffafcc', '#ffc8dd', '#bde0fe'],
  };
  RGB: Color = {
    name: 'RGB',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4CAF50', '#ff4d4d', '#2196F3'], // Rouge, Vert, Bleu
  };

  // Périodes pour les analyses
  periodeDebut: string = '';
  periodeFin: string = '';

  constructor(private http: HttpClient, private apiService: ApiService) {
    // Set period to current year, from January to current month (or December)
    const today = new Date();
    const currentYear = today.getFullYear();

    this.periodeDebut = `${currentYear}-01-01`;
    // Set end date to end of current month or December
    const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
    this.periodeFin = `${currentYear}-12-31`; // Show full year
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Utilisation des endpoints spécifiques pour les statistiques financières
    const financialStatsRequests = {
      chiffreAffaireTotal: this.apiService.ChiffreAffaireTotal(),
      revenuMoyenParEtudiant: this.apiService.revenuMoyenParEtudiant(),
      revenuMoyenParSession: this.apiService.revenuMoyenParSession(),
      coutTotalFormateursInterne:
        this.apiService.coutTotalDesFormateursInterne(),
      coutTotalFormateursExterne:
        this.apiService.coutTotalDesFormateursExterne(),
      coutTotalEmployes: this.apiService.coutTotalDesEmployee(),
      profitTotal: this.apiService.calculerProfitTotal({
        debut: this.periodeDebut,
        fin: this.periodeFin,
      }),
      formations: this.apiService.findAllFormations(),
      sessions: this.apiService.findAll_2(),
      inscriptions: this.apiService.findAll_1(),
      paiements: this.apiService.findAllPaiements(),
      utilisateurs: this.apiService.findAll_4(), // Ajoutez cette ligne
    };

    // Utiliser nos nouvelles méthodes pour la récupération des données périodiques
    const periodeRequests = {
      chiffreAffaireParPeriode: this.getChiffreAffaireParPeriode(),
      coutsEmployesParPeriode: this.getCoutsEmployesParPeriode(),
      coutsFormateursParPeriode: this.getCoutsFormateursParPeriode(),
    };

    // Combiner toutes les requêtes
    forkJoin({
      ...financialStatsRequests,
      ...periodeRequests,
    })
      .pipe(
        catchError((error) => {
          this.error = true;
          this.loading = false;
          console.error('Erreur lors du chargement des données:', error);
          return of({
            chiffreAffaireTotal: 0,
            revenuMoyenParEtudiant: 0,
            revenuMoyenParSession: 0,
            coutTotalFormateursInterne: 0,
            coutTotalFormateursExterne: 0,
            coutTotalEmployes: 0,
            profitTotal: 0,
            formations: [],
            sessions: [],
            inscriptions: [],
            paiements: [],
            chiffreAffaireParPeriode: [],
            coutsEmployesParPeriode: [],
            coutsFormateursParPeriode: [],
            utilisateurs: [], // Ajoutez cette ligne
          });
        })
      )
      .subscribe((data) => {
        console.log('Données reçues:', data);

        // Stocker les données brutes pour analyses et exports
        this.formations = data.formations;
        this.sessions = data.sessions;
        this.inscriptions = data.inscriptions;
        this.paiements = data.paiements;
        this.utilisateurs = data.utilisateurs; // Ajoutez cette ligne

        // Configurer les statistiques financières
        this.financialStats = {
          chiffreAffaireTotal: data.chiffreAffaireTotal || 0,
          revenuMoyenFormation: data.revenuMoyenParSession || 0,
          nbFormationsActives: 0,
          revenuParParticipant: data.revenuMoyenParEtudiant || 0,
          nbParticipantsTotal: 0,
          tauxRentabilite: this.calculateRentabilityRate(
            data.profitTotal,
            data.coutTotalFormateursInterne +
              data.coutTotalFormateursExterne +
              data.coutTotalEmployes
          ),
          coutTotalFormateurs:
            (data.coutTotalFormateursInterne || 0) +
            (data.coutTotalFormateursExterne || 0),
          pctCoutFormateurs: 0,
          coutTotalEmployes: data.coutTotalEmployes || 0,
          pctCoutEmployes: 0,
          profitTotal: data.profitTotal || 0,
          montantImpaye: 0,
          pctImpaye: 0,
          tauxConversionProspects: 0,
          nbProspectsConvertis: 0,
        };

        // Logger les données avant génération des graphiques
        console.log(
          "Chiffre d'affaires par période:",
          data.chiffreAffaireParPeriode
        );
        console.log(
          'Coûts employés par période:',
          data.coutsEmployesParPeriode
        );
        console.log(
          'Coûts formateurs par période:',
          data.coutsFormateursParPeriode
        );

        // Générer les graphiques avec les données récupérées
        this.generateCharts(data);
        this.prepareFinancialAnalysis();
        this.normalizeChartData();
        this.generatePaiementsEvolution();

        this.loading = false;
      });
  }
  /**
   * Génère les données d'évolution des paiements par mois
   */
  generatePaiementsEvolution(): void {
    // Vérifier que nous avons des paiements
    if (!this.paiements || this.paiements.length === 0) {
      console.warn(
        "Aucun paiement disponible pour générer l'évolution des paiements"
      );
      this.evolutionPaiements = [];
      return;
    }

    // Grouper les paiements par mois/année avec date de référence
    const paiementsByMonth: {
      [key: string]: { montant: number; dateRef: Date };
    } = {};

    this.paiements.forEach((paiement: PaiementsDto) => {
      if (!paiement.datePaiement) return;

      // Convertir la date de paiement en objet Date
      const dateObj = new Date(paiement.datePaiement);

      // Créer la clé au format "Mmm YYYY" (ex: Jan 2024)
      const monthYear =
        dateObj.toLocaleString('default', { month: 'short' }) +
        ' ' +
        dateObj.getFullYear();

      // Créer une date de référence pour le tri (1er jour du mois)
      const dateRef = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);

      // Ajouter le montant au mois correspondant
      if (!paiementsByMonth[monthYear]) {
        paiementsByMonth[monthYear] = { montant: 0, dateRef };
      }
      paiementsByMonth[monthYear].montant += paiement.montant;
    });

    // Trier les mois chronologiquement en utilisant les dates de référence
    const sortedMonths = Object.keys(paiementsByMonth).sort((a, b) => {
      return (
        paiementsByMonth[a].dateRef.getTime() -
        paiementsByMonth[b].dateRef.getTime()
      );
    });

    // Formater pour le graphique
    this.evolutionPaiements = [
      {
        name: 'Évolution des paiements',
        series: sortedMonths.map((month) => ({
          name: month,
          value: paiementsByMonth[month].montant,
        })),
      },
    ];

    console.log(
      "Données d'évolution des paiements générées:",
      this.evolutionPaiements
    );
  }
  /**
   * Récupère le chiffre d'affaires par mois en faisant des appels séparés pour chaque mois
   */
  getChiffreAffaireParPeriode(): Observable<any[]> {
    // Déterminer les mois entre periodeDebut et periodeFin
    const startDate = new Date(this.periodeDebut);
    const endDate = new Date(this.periodeFin);
    const monthsToFetch: { start: string; end: string; label: string }[] = [];

    // Générer une entrée pour chaque mois dans la période
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // getMonth() retourne 0-11

      // Créer la date de début du mois (1er jour)
      const startOfMonth = `${year}-${month.toString().padStart(2, '0')}-01`;

      // Créer la date de fin du mois (dernier jour)
      const lastDay = new Date(year, month, 0).getDate();
      const endOfMonth = `${year}-${month
        .toString()
        .padStart(2, '0')}-${lastDay}`;

      // Format pour l'affichage
      const monthName = currentDate.toLocaleString('default', {
        month: 'short',
      });
      const label = `${monthName} ${year}`;

      monthsToFetch.push({
        start: startOfMonth,
        end: endOfMonth,
        label: label,
      });

      // Passer au mois suivant
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    console.log('Mois à récupérer:', monthsToFetch);

    // Créer un tableau d'Observables, un pour chaque mois
    const requests = monthsToFetch.map((monthData) =>
      this.apiService
        .ChiffreAffaireEtudiantParPeriode({
          debut: monthData.start,
          fin: monthData.end,
        })
        .pipe(
          map((montant) => ({
            periode: monthData.label,
            montant: typeof montant === 'number' ? montant : 0,
          })),
          catchError((error) => {
            console.error(`Erreur pour la période ${monthData.label}:`, error);
            return of({ periode: monthData.label, montant: 0 });
          })
        )
    );

    // Combiner tous les résultats en un seul tableau
    return forkJoin(requests).pipe(
      catchError((error) => {
        console.error(
          'Erreur lors de la récupération des données mensuelles:',
          error
        );
        return of([]);
      })
    );
  }
  /**
   * Récupère les coûts des employés par mois en faisant des appels séparés
   */
  getCoutsEmployesParPeriode(): Observable<any[]> {
    // Même structure que getChiffreAffaireParPeriode
    const startDate = new Date(this.periodeDebut);
    const endDate = new Date(this.periodeFin);
    const monthsToFetch: { start: string; end: string; label: string }[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const startOfMonth = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endOfMonth = `${year}-${month
        .toString()
        .padStart(2, '0')}-${lastDay}`;

      const monthName = currentDate.toLocaleString('default', {
        month: 'short',
      });
      const label = `${monthName} ${year}`;

      monthsToFetch.push({
        start: startOfMonth,
        end: endOfMonth,
        label: label,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const requests = monthsToFetch.map((monthData) =>
      this.apiService
        .CoutsEmployesParPeriode({
          debut: monthData.start,
          fin: monthData.end,
        })
        .pipe(
          map((montant) => ({
            periode: monthData.label,
            montant: typeof montant === 'number' ? montant : 0,
          })),
          catchError((error) => {
            return of({ periode: monthData.label, montant: 0 });
          })
        )
    );

    return forkJoin(requests).pipe(
      catchError((error) => {
        console.error(
          'Erreur lors de la récupération des coûts employés mensuels:',
          error
        );
        return of([]);
      })
    );
  }

  /**
   * Récupère les coûts des formateurs par mois en faisant des appels séparés
   */
  getCoutsFormateursParPeriode(): Observable<any[]> {
    // Même structure que les deux méthodes précédentes
    const startDate = new Date(this.periodeDebut);
    const endDate = new Date(this.periodeFin);
    const monthsToFetch: { start: string; end: string; label: string }[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const startOfMonth = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endOfMonth = `${year}-${month
        .toString()
        .padStart(2, '0')}-${lastDay}`;

      const monthName = currentDate.toLocaleString('default', {
        month: 'short',
      });
      const label = `${monthName} ${year}`;

      monthsToFetch.push({
        start: startOfMonth,
        end: endOfMonth,
        label: label,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const requests = monthsToFetch.map((monthData) =>
      this.apiService
        .CoutsFormateursParPeriode({
          debut: monthData.start,
          fin: monthData.end,
        })
        .pipe(
          map((montant) => ({
            periode: monthData.label,
            montant: typeof montant === 'number' ? montant : 0,
          })),
          catchError((error) => {
            return of({ periode: monthData.label, montant: 0 });
          })
        )
    );

    return forkJoin(requests).pipe(
      catchError((error) => {
        console.error(
          'Erreur lors de la récupération des coûts formateurs mensuels:',
          error
        );
        return of([]);
      })
    );
  }

  /**
   * Calcule le nombre de mois entre deux dates
   */
  getMonthDiff(startDate: Date, endDate: Date): number {
    return (
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear()) +
      1
    ); // +1 pour inclure le mois en cours
  }

  /**
   * Calcule le taux de rentabilité
   */
  calculateRentabilityRate(profit: number, costs: number): number {
    return costs > 0 ? (profit / costs) * 100 : 0;
  }

  /**
   * Génère tous les graphiques et analyses visuelles
   */
  generateCharts(data: any): void {
    this.generateRevenueCharts(data);
    this.generateCostCharts(data);
    this.generatePaymentAnalysis();
    this.generateProfitabilityAnalysis();
  }

  /**
   * Génère les graphiques liés aux revenus
   */ /**
   * Génère les graphiques liés aux revenus
   */
  generateRevenueCharts(data: any): void {
    console.log(
      "generateRevenueCharts: Début de l'exécution avec les données :",
      data
    );

    // Vérifier que nous avons bien des données au format Array
    if (Array.isArray(data.chiffreAffaireParPeriode)) {
      console.log(
        "Données chiffre d'affaires par période:",
        data.chiffreAffaireParPeriode
      );

      this.chiffreAffaireByMonth = [
        {
          name: "Chiffre d'affaires",
          series: data.chiffreAffaireParPeriode.map((item: any) => {
            return {
              name: item.periode, // Le formatage est déjà fait dans getChiffreAffaireParPeriode
              value: item.montant || 0,
            };
          }),
        },
      ];
    } else {
      console.warn('Format de données inattendu pour chiffreAffaireParPeriode');
      this.chiffreAffaireByMonth = [{ name: "Chiffre d'affaires", series: [] }];
    }

    console.log(
      'Données finales pour chiffreAffaireByMonth:',
      this.chiffreAffaireByMonth
    );

    // Répartition des revenus par source
    try {
      this.generateRevenueBySource();
    } catch (error) {
      console.error(
        'Erreur lors de la génération de la répartition des revenus par source:',
        error
      );
    }
  }
  evolutionCombineeData: any[] = [];
  generateCostCharts(data: any): void {
    // Vérifier les données de coûts
    console.log('Données pour les graphiques de coûts:', {
      coutsEmployes: data.coutsEmployesParPeriode,
      coutsFormateurs: data.coutsFormateursParPeriode,
    });

    // Les données sont déjà au bon format grâce aux nouvelles méthodes
    if (
      Array.isArray(data.coutsEmployesParPeriode) &&
      Array.isArray(data.coutsFormateursParPeriode)
    ) {
      this.coutsByPeriode = [
        {
          name: 'Coûts employés',
          series: data.coutsEmployesParPeriode.map((item: any) => ({
            name: item.periode,
            value: item.montant || 0,
          })),
        },
        {
          name: 'Coûts formateurs',
          series: data.coutsFormateursParPeriode.map((item: any) => ({
            name: item.periode,
            value: item.montant || 0,
          })),
        },
      ];

      // Vérifier les données formatées
      console.log(
        'Données formatées pour coutsByPeriode:',
        this.coutsByPeriode
      );

      // Générer le graphique d'évolution combinée
      this.evolutionCombineeData = [
        {
          name: "Chiffre d'affaires",
          series: data.chiffreAffaireParPeriode.map((item: any) => ({
            name: item.periode,
            value: item.montant || 0,
          })),
        },
        {
          name: 'Coûts employés',
          series: data.coutsEmployesParPeriode.map((item: any) => ({
            name: item.periode,
            value: item.montant || 0,
          })),
        },
        {
          name: 'Coûts formateurs',
          series: data.coutsFormateursParPeriode.map((item: any) => ({
            name: item.periode,
            value: item.montant || 0,
          })),
        },
      ];

      console.log("Données d'évolution combinée:", this.evolutionCombineeData);
    } else {
      console.warn('Format de données inattendu pour les coûts');
      this.coutsByPeriode = [];
      this.evolutionCombineeData = [];
    }

    // Comparaison revenus internes/externes
  }

  /**
   * Génère des données factices pour les graphiques en cas d'erreur
   */

  // 3. Si les périodes ne correspondent pas, nous pouvons normaliser les données
  // Ajoutez cette méthode pour normaliser les données sur toutes les périodes
  normalizeChartData(): void {
    if (
      !this.evolutionCombineeData ||
      this.evolutionCombineeData.length === 0
    ) {
      console.warn('Aucune donnée à normaliser dans evolutionCombineeData');
      return;
    }

    // Recueillir toutes les périodes uniques
    const allPeriods = new Set<string>();

    this.evolutionCombineeData.forEach((series) => {
      if (series.series && Array.isArray(series.series)) {
        series.series.forEach((item: { name: string; value: number }) => {
          if (item && item.name) {
            allPeriods.add(item.name);
          }
        });
      }
    });

    // Si aucune période n'a été trouvée, il n'y a rien à normaliser
    if (allPeriods.size === 0) {
      console.warn('Aucune période trouvée dans les données');
      return;
    }

    // Trier les périodes chronologiquement
    const sortedPeriods = Array.from(allPeriods).sort((a, b) => {
      try {
        // Parser les périodes au format "MMM YYYY"
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');

        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        // Comparer d'abord par année
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }

        // Puis par mois
        return months.indexOf(monthA) - months.indexOf(monthB);
      } catch (error) {
        console.error('Erreur lors du tri des périodes:', error, a, b);
        return 0;
      }
    });

    // Normaliser chaque série pour inclure toutes les périodes
    this.evolutionCombineeData = this.evolutionCombineeData.map(
      (seriesData) => {
        const periodMap = new Map<string, number>();

        // Mapper les valeurs existantes
        if (seriesData.series && Array.isArray(seriesData.series)) {
          seriesData.series.forEach((item: { name: string; value: number }) => {
            if (item && item.name !== undefined && item.value !== undefined) {
              periodMap.set(item.name, item.value);
            }
          });
        }

        // Créer une nouvelle série avec toutes les périodes
        const normalizedSeries = sortedPeriods.map((period) => ({
          name: period,
          value: periodMap.has(period) ? periodMap.get(period)! : 0,
        }));

        return {
          name: seriesData.name,
          series: normalizedSeries,
        };
      }
    );
  }

  /**
   * Génère la répartition des revenus par source
   */
  generateRevenueBySource(): void {
    // Grouper les paiements par source
    const paiementsBySource = this.paiements.reduce(
      (acc: any, paiement: PaiementsDto) => {
        const source = paiement.source || 'Non spécifié';

        if (!acc[source]) {
          acc[source] = 0;
        }

        acc[source] += paiement.montant;
        return acc;
      },
      {}
    );

    // Transformer en format pour le graphique
    this.revenueBySource = Object.entries(paiementsBySource).map(
      ([source, amount]) => {
        return {
          name: source,
          value: amount as number,
        };
      }
    );
  }

  /**
   * Génère l'analyse des paiements
   */
  generatePaymentAnalysis(): void {
    // Grouper les paiements par statut
    const paiementsByStatusMap = this.paiements.reduce(
      (acc: any, paiement: PaiementsDto) => {
        const statut = paiement.statut || 'Non spécifié';

        if (!acc[statut]) {
          acc[statut] = 0;
        }

        acc[statut] += paiement.montant;
        return acc;
      },
      {}
    );

    // Transformer en format pour le graphique
    this.paiementsByStatus = Object.entries(paiementsByStatusMap).map(
      ([statut, amount]) => {
        return {
          name: statut,
          value: amount as number,
        };
      }
    );

    // Grouper les paiements par mode de paiement
    const paiementsByModeMap = this.paiements.reduce(
      (acc: any, paiement: PaiementsDto) => {
        const mode = paiement.modePaiement || 'Non spécifié';

        if (!acc[mode]) {
          acc[mode] = 0;
        }

        acc[mode] += paiement.montant;
        return acc;
      },
      {}
    );

    // Transformer en format pour le graphique
    this.paiementsByMode = Object.entries(paiementsByModeMap).map(
      ([mode, amount]) => {
        return {
          name: mode,
          value: amount as number,
        };
      }
    );
  }

  /**
   * Génère l'analyse de rentabilité par type de formation
   */
  generateProfitabilityAnalysis(): void {
    // Regrouper les formations par type
    const formationsByType = this.formations.reduce(
      (acc: any, formation: any) => {
        const type = formation.type || 'Non spécifié';

        if (!acc[type]) {
          acc[type] = {
            revenu: 0,
            cout: 0,
          };
        }

        // Trouver les sessions liées
        const sessionIds = this.sessions
          .filter((s: any) => s.formationId === formation.id)
          .map((s: any) => s.id);

        // Calculer les revenus (paiements)
        sessionIds.forEach((sessionId: number) => {
          const paiementsSession = this.paiements.filter(
            (p: PaiementsDto) => p.inscriptionId === sessionId
          );

          acc[type].revenu += paiementsSession.reduce(
            (sum: number, p: PaiementsDto) => sum + p.montant,
            0
          );
        });

        // Ajouter les coûts (estimation)
        // Note: ceci est simplifié, idéalement les coûts réels seraient récupérés
        acc[type].cout += formation.coutEstime || 0;

        return acc;
      },
      {}
    );

    // Calculer la rentabilité et formater pour le graphique
    this.rentabiliteByType = Object.entries(formationsByType).map(
      ([type, data]: [string, any]) => {
        const rentabilite =
          data.cout > 0 ? ((data.revenu - data.cout) / data.cout) * 100 : 0;

        return {
          name: type,
          value: parseFloat(rentabilite.toFixed(1)),
        };
      }
    );
  }

  /**
   * Prépare l'analyse financière détaillée
   */
  prepareFinancialAnalysis(): void {
    // Vérification que nous avons les données nécessaires
    if (
      !this.formations ||
      !this.sessions ||
      !this.inscriptions ||
      !this.paiements
    ) {
      console.warn("Données manquantes pour l'analyse financière");
      this.financialAnalysisData = [];
      return;
    }

    this.financialAnalysisData = this.formations.map((formation: any) => {
      // Trouver les sessions liées à cette formation
      const sessionIds = this.sessions
        .filter((s: any) => s.formationId === formation.id)
        .map((s: any) => s.id);

      // Calculer les revenus (paiements des étudiants)
      let revenuTotal = 0;
      sessionIds.forEach((sessionId: number) => {
        // Trouver les inscriptions pour cette session
        const inscriptionsSession = this.inscriptions.filter(
          (i: any) => i.sessionId === sessionId
        );

        inscriptionsSession.forEach((inscription: any) => {
          // Si nous avons des utilisateurs, vérifier si l'utilisateur est un étudiant
          // Sinon, considérer tous les paiements
          const isEtudiant =
            this.utilisateurs && this.utilisateurs.length > 0
              ? this.utilisateurs.find(
                  (u: any) => u.id === inscription.utilisateurId
                )?.role === 'ETUDIANT'
              : true; // Par défaut on considère que c'est un étudiant si pas d'info

          if (isEtudiant) {
            // Trouver les paiements associés à cette inscription
            const paiementsEtudiant = this.paiements.filter(
              (p: PaiementsDto) =>
                p.inscriptionId === inscription.id && p.statut === 'CONFIRME'
            );

            // Ajouter à la somme des revenus
            revenuTotal += paiementsEtudiant.reduce(
              (sum: number, p: PaiementsDto) => sum + (p.montant || 0),
              0
            );
          }
        });
      });

      // Coûts des formateurs (simplifiés sans dépendre strictement des utilisateurs)
      let coutFormateursInternes = 0;
      let coutFormateursExternes = 0;

      // Estimation simple des coûts basée sur les sessions
      const sessionCost = formation.coutEstime
        ? formation.coutEstime / (sessionIds.length || 1)
        : 0;

      // Répartition arbitraire des coûts (à adapter selon votre logique métier)
      coutFormateursInternes = sessionCost * 0.6; // 60% pour les formateurs internes
      coutFormateursExternes = sessionCost * 0.4; // 40% pour les formateurs externes

      // Coût total (formateurs internes + externes)
      const coutTotal = coutFormateursInternes + coutFormateursExternes;

      // Calculer marge et ROI
      const marge = revenuTotal - coutTotal;
      const margePct = coutTotal > 0 ? (marge / revenuTotal) * 100 : 0;
      const roi = coutTotal > 0 ? (marge / coutTotal) * 100 : 0;

      // Calculer seuil de rentabilité
      const tarifParPersonne = formation.prix || 0;
      const seuilRentabilite =
        tarifParPersonne > 0 ? Math.ceil(coutTotal / tarifParPersonne) : 'N/A';

      return {
        reference: formation.id || 'N/A',
        titre: formation.titre || 'Sans titre',
        type: formation.niveau || 'Non spécifié',
        tarif: formation.prix,
        coutTotal,
        coutFormateursInternes,
        coutFormateursExternes,
        revenuTotal,
        marge,
        margePct,
        seuilRentabilite,
        roi,
      };
    });

    console.log('Analyse financière préparée:', this.financialAnalysisData);
  }

  /**
   * Exporte les données vers un fichier CSV
   */
  exportToCSV(data: any[], filename: string): void {
    if (!data || data.length === 0) {
      console.error('Aucune donnée à exporter');
      return;
    }

    // Créer les en-têtes
    const headers = Object.keys(data[0]);

    // Convertir les données en format CSV
    const csvContent = [
      headers.join(','), // Ligne d'en-têtes
      ...data.map((row) => {
        return headers
          .map((header) => {
            const cell = row[header];
            // Échapper les virgules et les guillemets
            return typeof cell === 'string'
              ? `"${cell.replace(/"/g, '""')}"`
              : cell;
          })
          .join(',');
      }),
    ].join('\n');

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  }
  /**
   * Actualise les données avec les filtres de période
   */
  refreshData(): void {
    this.loadDashboardData();
  }
  onSelect(event: any): void {
    console.log('Item sélectionné:', event);
    // Vous pouvez ajouter ici une logique pour traiter la sélection
  }
}
