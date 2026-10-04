/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import {
  FormationsDto,
  SallesDto,
  SessionsDto,
  UtilisateursDto,
  AvisDto,
} from 'src/cni-api/src/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tableau-de-bord',
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.css'],
})
export class TableauDeBordComponent implements OnInit {
  // Données pour les graphiques
  formationPopulariteData: any[] = [];
  noteGlobaleParFormationData: any[] = [];
  revenuParCategorieData: any[] = [];
  evaluationFormateursData: any[] = [];
  notesMoyennesData: any[] = [];
  topSessionsData: any[] = [];
  avisParLieuData: any[] = [];
  evolutionEvaluationsData: any[] = [];
  formateurs: UtilisateursDto[] = [];
  utilisateurs: UtilisateursDto[] = [];
  isLoading: boolean = true;

  // KPIs
  tauxNouveauxBesoins: number = 0;
  nombreFormateursEvalues: number = 0;
  volumeAvisTotal: number = 0;
  tauxCompletionAvis: number = 0;

  // Options communes pour les graphiques
  colorScheme: Color = {
    name: 'elegantBlue',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#2A3F54', // Bleu nuit profond - Pour les éléments principaux
      '#1ABB9C', // Turquoise élégant - Pour mettre en valeur
      '#3498DB', // Bleu clair raffiné
      '#9B59B6', // Violet sophistiqué
      '#E74C3C', // Rouge discret pour les alertes
      '#F39C12', // Or moderne pour les highlights
      '#BDC3C7', // Gris argenté neutre
    ],
  };

  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;

  // Statistiques globales
  totalFormations: number = 0;
  totalSessions: number = 0;
  totalUtilisateurs: number = 0;
  totalRevenu: number = 0;
  detailsAvis: AvisDto[] = [];
  tauxRemplissage: number = 0;
  revenuMoyenParEtudiant: number = 0;

  // Période d'analyse
  periodeDebut: Date = new Date();
  periodeFin: Date = new Date();
  formateurNamesMap = new Map<number, string>();
  UtilisateurNamesMap = new Map<number, string>();

  constructor(private apiService: ApiService, private router: Router) {
    // Définir période par défaut (6 derniers mois)
    this.periodeFin = new Date();
    this.periodeDebut = new Date();
    this.periodeDebut.setMonth(this.periodeFin.getMonth() - 6);
  }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): void {
    this.isLoading = true;

    // Chargement parallèle des données avec gestion d'erreurs améliorée
    forkJoin({
      formations: this.apiService.findAllFormations().pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des formations:', error);
          return of([]);
        })
      ),
      sessions: this.apiService.findAll_2().pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des sessions:', error);
          return of([]);
        })
      ),
      utilisateurs: this.apiService.findAll_4().pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
          return of([]);
        })
      ),
      avis: this.apiService.findAll().pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des avis:', error);
          return of([]);
        })
      ),
      salles: this.apiService.findAll_1().pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des salles:', error);
          return of([]);
        })
      ),
      chiffreAffaire: this.apiService.ChiffreAffaireTotal().pipe(
        catchError((error) => {
          console.error(
            "Erreur lors du chargement du chiffre d'affaires:",
            error
          );
          return of(0);
        })
      ),
      revenuMoyenParEtudiant: this.apiService.revenuMoyenParEtudiant().pipe(
        catchError((error) => {
          console.error(
            'Erreur lors du chargement du revenu moyen par étudiant:',
            error
          );
          return of(0);
        })
      ),
      formateurs: this.apiService.findFormateur().pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des formateurs:', error);
          return of([]);
        })
      ),
    }).subscribe({
      next: (results) => {
        try {
          // Traitement des données de base
          this.totalFormations = results.formations?.length || 0;
          this.totalSessions = results.sessions?.length || 0;
          this.totalUtilisateurs = results.utilisateurs?.length || 0;
          this.totalRevenu = results.chiffreAffaire || 0;
          this.detailsAvis = results.avis || [];
          this.formateurs = results.formateurs || [];
          this.utilisateurs = results.utilisateurs || [];
          this.revenuMoyenParEtudiant = results.revenuMoyenParEtudiant || 0;
          this.volumeAvisTotal = this.detailsAvis.length;

          // Construire les maps de noms
          this.buildNamesMap();

          // Calculer les KPIs et préparer les données des graphiques
          this.calculateAllMetrics(results);

          this.isLoading = false;
        } catch (error) {
          console.error('Erreur lors du traitement des données:', error);
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
      },
    });
  }
  private buildNamesMap(): void {
    // Map des formateurs
    this.formateurs.forEach((formateur) => {
      if (formateur?.id) {
        const nom = formateur.nom || '';
        const prenom = formateur.prenom || '';
        this.formateurNamesMap.set(
          formateur.id,
          `${prenom} ${nom}`.trim() || `Formateur #${formateur.id}`
        );
      }
    });

    // Map des utilisateurs
    this.utilisateurs.forEach((utilisateur) => {
      if (utilisateur?.id) {
        const nom = utilisateur.nom || '';
        const prenom = utilisateur.prenom || '';
        this.UtilisateurNamesMap.set(
          utilisateur.id,
          `${prenom} ${nom}`.trim() || `Utilisateur #${utilisateur.id}`
        );
      }
    });
  }

  private calculateAllMetrics(results: any): void {
    try {
      // Calculer tous les indicateurs et préparer les données des graphiques
      this.calculateTauxRemplissage(results.sessions || []);
      this.prepareFormationPopulariteData(
        results.sessions || [],
        results.formations || []
      );
      this.calculateNoteGlobaleParFormationData(
        results.formations || [],
        results.avis || [],
        results.sessions || []
      );
      this.prepareRevenuParCategorieData(
        results.formations || [],
        results.sessions || []
      );
      this.calculateEvaluationFormateursData(
        results.formateurs || [],
        results.avis || []
      );
      this.prepareNotesMoyennesData(results.avis || []);
      this.prepareTopSessionsData(
        results.avis || [],
        results.sessions || [],
        results.formations || []
      );
      this.prepareAvisParLieuData(results.avis || [], results.salles || []);
      this.calculateEvolutionEvaluationsData(results.avis || []);
      this.calculateTauxNouveauxBesoins(results.avis || []);
      this.calculateNombreFormateursEvalues(results.avis || []);
      this.calculateTauxCompletionAvis(results.avis || []);
    } catch (error) {
      console.error('Erreur lors du calcul des métriques:', error);
    }
  }

  // Méthode corrigée pour calculer les notes globales par formation
  calculateNoteGlobaleParFormationData(
    formations: FormationsDto[],
    avis: AvisDto[],
    sessions: SessionsDto[]
  ): void {
    try {
      // Créer une map pour associer les sessions à leurs formations
      const sessionFormationMap = new Map<number, number>();

      sessions.forEach((session) => {
        if (session?.sessionId && session?.formationId) {
          sessionFormationMap.set(session.sessionId, session.formationId);
        }
      });

      // Créer une map pour les noms de formations
      const formationNameMap = new Map<number, string>();
      formations.forEach((formation) => {
        if (formation?.id) {
          formationNameMap.set(
            formation.id,
            formation.titre || `Formation #${formation.id}`
          );
        }
      });

      // Calculer les notes moyennes par formation
      const ratingsByFormation = new Map<
        number,
        { total: number; count: number }
      >();

      avis.forEach((avis) => {
        if (
          avis?.sessionsId &&
          avis?.noteGlobale !== undefined &&
          avis?.noteGlobale !== null &&
          !isNaN(Number(avis.noteGlobale))
        ) {
          const formationId = sessionFormationMap.get(avis.sessionsId);

          if (formationId) {
            const stats = ratingsByFormation.get(formationId) || {
              total: 0,
              count: 0,
            };
            stats.total += Number(avis.noteGlobale);
            stats.count++;
            ratingsByFormation.set(formationId, stats);
          }
        }
      });

      // Convertir au format du graphique
      this.noteGlobaleParFormationData = Array.from(
        ratingsByFormation.entries()
      )
        .map(([formationId, stats]) => {
          const moyenne =
            stats.count > 0
              ? Number((stats.total / stats.count).toFixed(1))
              : 0;
          return {
            name:
              formationNameMap.get(formationId) || `Formation #${formationId}`,
            value: moyenne,
          };
        })
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    } catch (error) {
      console.error('Erreur dans calculateNoteGlobaleParFormationData:', error);
      this.noteGlobaleParFormationData = [];
    }
  }

  // This function has incorrect property references
  calculateEvolutionEvaluationsData(avis: AvisDto[]): void {
    // Group feedback by month
    const evaluationsByMonth = new Map<
      string,
      { total: number; count: number }
    >();

    avis.forEach((avis) => {
      if (
        avis.dateFormation &&
        avis.noteGlobale !== undefined &&
        avis.noteGlobale !== null
      ) {
        const date = new Date(avis.dateFormation);
        const monthKey = date.toISOString().substring(0, 7); // Format: YYYY-MM

        const stats = evaluationsByMonth.get(monthKey) || {
          total: 0,
          count: 0,
        };
        stats.total += avis.noteGlobale;
        stats.count++;
        evaluationsByMonth.set(monthKey, stats);
      }
    });

    // Convert to time series format for the chart
    this.evolutionEvaluationsData = [
      {
        name: 'Note moyenne',
        series: Array.from(evaluationsByMonth.entries())
          .map(([monthKey, stats]) => {
            const moyenne =
              stats.count > 0
                ? Number((stats.total / stats.count).toFixed(1))
                : 0;

            // Format the date for display
            const dateParts = monthKey.split('-');
            const year = dateParts[0];
            const month = dateParts[1];
            const monthNames = [
              'Jan',
              'Fév',
              'Mar',
              'Avr',
              'Mai',
              'Juin',
              'Juil',
              'Août',
              'Sept',
              'Oct',
              'Nov',
              'Déc',
            ];
            const monthName = monthNames[parseInt(month) - 1];

            return {
              name: `${monthName} ${year}`,
              value: moyenne,
            };
          })
          .sort((a, b) => {
            // Sort by date (assuming the name is in the format "MMM YYYY")
            const nameA = a.name.split(' ');
            const nameB = b.name.split(' ');

            const yearA = parseInt(nameA[1]);
            const yearB = parseInt(nameB[1]);

            if (yearA !== yearB) {
              return yearA - yearB;
            }

            const monthNames = [
              'Jan',
              'Fév',
              'Mar',
              'Avr',
              'Mai',
              'Juin',
              'Juil',
              'Août',
              'Sept',
              'Oct',
              'Nov',
              'Déc',
            ];
            const monthA = monthNames.indexOf(nameA[0]);
            const monthB = monthNames.indexOf(nameB[0]);

            return monthA - monthB;
          }),
      },
    ];
  }

  /**
   * Calcule le taux de remplissage des sessions
   */
  calculateTauxRemplissage(sessions: SessionsDto[]): void {
    if (sessions.length > 0) {
      let totalPlaces = 0;
      let placesOccupees = 0;

      sessions.forEach((session) => {
        if (session.capacite && session.placesDisponibles) {
          totalPlaces += session.capacite;
          placesOccupees += session.capacite - session.placesDisponibles;
        }
      });

      this.tauxRemplissage =
        totalPlaces > 0 ? (placesOccupees / totalPlaces) * 100 : 0;
    }
  }

  /**
   * Prépare les données pour le graphique de popularité des formations
   */
  prepareFormationPopulariteData(
    sessions: SessionsDto[],
    formations: FormationsDto[]
  ): void {
    const formationMap = new Map<
      number,
      { nom: string; inscriptions: number }
    >();

    // Initialiser la map avec les formations
    formations.forEach((formation) => {
      if (formation.id) {
        formationMap.set(formation.id, {
          nom: formation.titre || 'Formation sans nom',
          inscriptions: 0,
        });
      }
    });

    // Comptabiliser les inscriptions par formation
    sessions.forEach((session) => {
      if (
        session.formationId &&
        session.capacite &&
        session.placesDisponibles !== undefined
      ) {
        const formation = formationMap.get(session.formationId);
        if (formation) {
          formation.inscriptions +=
            session.capacite - session.placesDisponibles;
        }
      }
    });

    // Convertir en format pour le graphique et trier par popularité
    this.formationPopulariteData = Array.from(formationMap.values())
      .filter((item) => item.inscriptions > 0)
      .map((item) => ({ name: item.nom, value: item.inscriptions }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10
  }

  /**
   * Prépare les données pour le graphique des revenus par catégorie
   */
  prepareRevenuParCategorieData(
    formations: FormationsDto[],
    sessions: SessionsDto[]
  ): void {
    // Créer un map pour les catégories
    const categorieMap = new Map<string, number>();

    // Associer les formations à leurs catégories et prix
    const formationPrixMap = new Map<
      number,
      { categorie: string; prix: number }
    >();

    formations.forEach((formation) => {
      if (formation.id && formation.prix && formation.themeId) {
        formationPrixMap.set(formation.id, {
          categorie: `Thème #${formation.themeId}`, // On utilise l'ID du thème comme catégorie
          prix: formation.prix,
        });
      }
    });

    // Calculer le revenu par catégorie
    sessions.forEach((session) => {
      if (
        session.formationId &&
        session.capacite &&
        session.placesDisponibles !== undefined
      ) {
        const formationInfo = formationPrixMap.get(session.formationId);
        if (formationInfo) {
          const inscriptions = session.capacite - session.placesDisponibles;
          const revenu = inscriptions * formationInfo.prix;
          const categorie = formationInfo.categorie || 'Non catégorisé';

          categorieMap.set(
            categorie,
            (categorieMap.get(categorie) || 0) + revenu
          );
        }
      }
    });

    // Convertir en format pour le graphique
    this.revenuParCategorieData = Array.from(categorieMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  /**
   * Calcule les évaluations par formateur
   */
  calculateEvaluationFormateursData(
    formateurs: UtilisateursDto[],
    avis: AvisDto[]
  ): void {
    // Vérification des paramètres d'entrée
    if (
      !formateurs ||
      !avis ||
      !Array.isArray(formateurs) ||
      !Array.isArray(avis)
    ) {
      console.error(
        'Paramètres invalides pour calculateEvaluationFormateursData',
        { formateurs, avis }
      );
      this.evaluationFormateursData = [];
      return;
    }

    try {
      // Créer un map pour associer formateurId aux noms
      const formateurMap = new Map<number, string>();

      formateurs.forEach((formateur) => {
        if (formateur && formateur.id !== undefined && formateur.id !== null) {
          const formateurId = Number(formateur.id);

          if (!isNaN(formateurId)) {
            const nom = formateur.nom || '';
            const prenom = formateur.prenom || '';
            formateurMap.set(
              formateurId,
              `${prenom} ${nom}`.trim() || `Formateur #${formateurId}`
            );
          }
        }
      });

      // Calculer les notes moyennes par formateur
      const notesParFormateur = new Map<
        number,
        { total: number; count: number }
      >();

      avis.forEach((avis) => {
        // Vérifier si l'avis contient formateurIds et c'est un tableau
        if (
          avis &&
          avis.formateurIds &&
          Array.isArray(avis.formateurIds) &&
          avis.evaluationFormateur !== undefined &&
          avis.evaluationFormateur !== null
        ) {
          const note = Number(avis.evaluationFormateur);

          if (!isNaN(note)) {
            // Parcourir tous les formateurs évalués dans cet avis
            avis.formateurIds.forEach((formateurIdRaw) => {
              const formateurId = Number(formateurIdRaw);

              if (!isNaN(formateurId)) {
                const stats = notesParFormateur.get(formateurId) || {
                  total: 0,
                  count: 0,
                };

                stats.total += note;
                stats.count++;
                notesParFormateur.set(formateurId, stats);
              }
            });
          }
        }
      });

      // Convertir en format pour le graphique ngx-charts
      const formateursEvalues = Array.from(notesParFormateur.entries())
        .map(([formateurId, stats]) => {
          const moyenne =
            stats.count > 0
              ? Number((stats.total / stats.count).toFixed(1))
              : 0;

          return {
            name: formateurMap.get(formateurId) || `Formateur #${formateurId}`,
            value: moyenne,
          };
        })
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 8); // Limiter aux 8 meilleurs formateurs

      this.evaluationFormateursData = formateursEvalues;
    } catch (error) {
      console.error('Erreur lors du calcul des données des formateurs:', error);
      this.evaluationFormateursData = [];
    }
  }

  /**
   * Prépare les données pour le graphique des notes moyennes
   */
  prepareNotesMoyennesData(avis: AvisDto[]): void {
    // Variables pour calculer les moyennes
    let totalFormateur = 0;
    let countFormateur = 0;
    let totalEnvironnement = 0;
    let countEnvironnement = 0;
    let totalMoyensPedagogiques = 0;
    let countMoyensPedagogiques = 0;
    let totalGlobale = 0;
    let countGlobale = 0;

    // Parcourir tous les avis
    avis.forEach((avis) => {
      if (
        avis.evaluationFormateur !== undefined &&
        avis.evaluationFormateur !== null
      ) {
        totalFormateur += avis.evaluationFormateur;
        countFormateur++;
      }

      if (
        avis.evaluationEnvironnement !== undefined &&
        avis.evaluationEnvironnement !== null
      ) {
        totalEnvironnement += avis.evaluationEnvironnement;
        countEnvironnement++;
      }

      if (
        avis.evaluationMoyens !== undefined &&
        avis.evaluationMoyens !== null
      ) {
        totalMoyensPedagogiques += avis.evaluationMoyens;
        countMoyensPedagogiques++;
      }

      if (avis.noteGlobale !== undefined && avis.noteGlobale !== null) {
        totalGlobale += avis.noteGlobale;
        countGlobale++;
      }
    });

    // Calculer les moyennes
    const moyenneFormateur =
      countFormateur > 0
        ? Number((totalFormateur / countFormateur).toFixed(1))
        : 0;
    const moyenneEnvironnement =
      countEnvironnement > 0
        ? Number((totalEnvironnement / countEnvironnement).toFixed(1))
        : 0;
    const moyenneMoyensPedagogiques =
      countMoyensPedagogiques > 0
        ? Number((totalMoyensPedagogiques / countMoyensPedagogiques).toFixed(1))
        : 0;
    const moyenneGlobale =
      countGlobale > 0 ? Number((totalGlobale / countGlobale).toFixed(1)) : 0;

    // Préparer les données pour le graphique
    this.notesMoyennesData = [
      { name: 'Formateurs', value: moyenneFormateur },
      { name: 'Environnement', value: moyenneEnvironnement },
      { name: 'Moyens pédagogiques', value: moyenneMoyensPedagogiques },
      { name: 'Note globale', value: moyenneGlobale },
    ].sort((a, b) => b.value - a.value); // Trier par note décroissante
  }

  /**
   * Prépare les données pour le graphique des top sessions
   */
  prepareTopSessionsData(
    avis: AvisDto[],
    sessions: SessionsDto[],
    formations: FormationsDto[]
  ): void {
    // Créer un map des formations par ID
    const formationMap = new Map<number, string>();
    formations.forEach((formation) => {
      if (formation.id) {
        formationMap.set(
          formation.id,
          formation.titre || `Formation #${formation.id}`
        );
      }
    });

    // Créer un map des sessions par ID avec leur formation associée
    const sessionMap = new Map<
      number,
      { formationId?: number; dateDebut?: string }
    >();
    sessions.forEach((session) => {
      if (session.sessionId) {
        sessionMap.set(session.sessionId, {
          formationId: session.formationId,
          dateDebut: session.dateDebut,
        });
      }
    });

    // Calculer les notes moyennes par session
    const notesParSession = new Map<
      number,
      { total: number; count: number; sessionId: number }
    >();

    avis.forEach((avis) => {
      if (
        avis.sessionsId !== undefined &&
        avis.noteGlobale !== undefined &&
        avis.noteGlobale !== null
      ) {
        const stats = notesParSession.get(avis.sessionsId) || {
          total: 0,
          count: 0,
          sessionId: avis.sessionsId,
        };
        stats.total += avis.noteGlobale;
        stats.count++;
        notesParSession.set(avis.sessionsId, stats);
      }
    });

    // Convertir en format pour le graphique et trier par note
    this.topSessionsData = Array.from(notesParSession.values())
      .map((stats) => {
        const sessionInfo = sessionMap.get(stats.sessionId);
        const formationId = sessionInfo?.formationId;
        const formationTitre = formationId
          ? formationMap.get(formationId)
          : 'Inconnu';

        const moyenne =
          stats.count > 0 ? Number((stats.total / stats.count).toFixed(1)) : 0;

        // Formater la date pour l'affichage dans le nom de session
        let dateStr = '';
        if (sessionInfo?.dateDebut) {
          const date = new Date(sessionInfo.dateDebut);
          dateStr = date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }

        const name = `${formationTitre} (${dateStr})`;

        return { name, value: moyenne };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 des sessions
  }

  /**
   * Prépare les données pour le graphique des avis par lieu
   */
  prepareAvisParLieuData(avis: AvisDto[], salles: SallesDto[]): void {
    // Créer un map pour associer salleId aux noms
    const salleMap = new Map<number, string>();
    salles.forEach((salle) => {
      if (salle.id) {
        salleMap.set(salle.id, salle.nom || `Salle #${salle.id}`);
      }
    });

    // Compter les avis par lieu
    const avisParLieu = new Map<string, number>();

    avis.forEach((avis) => {
      if (avis.lieuFormation) {
        // Si le lieu est spécifié directement
        avisParLieu.set(
          avis.lieuFormation,
          (avisParLieu.get(avis.lieuFormation) || 0) + 1
        );
      } else {
        // Gérer les avis sans lieu spécifié
        avisParLieu.set(
          'Non spécifié',
          (avisParLieu.get('Non spécifié') || 0) + 1
        );
      }
    });

    // Convertir en format pour le graphique
    this.avisParLieuData = Array.from(avisParLieu.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  /**
   * Calcule le taux de nouveaux besoins détectés dans les avis
   */
  calculateTauxNouveauxBesoins(avis: AvisDto[]): void {
    if (!avis || avis.length === 0) {
      this.tauxNouveauxBesoins = 0;
      return;
    }

    // Compter les avis contenant des nouveaux besoins
    let avisAvecNouveauxBesoins = 0;

    avis.forEach((avis) => {
      // Vérifier si l'avis contient des nouveaux besoins
      if (
        avis.nouveauxBesoinFormation === true ||
        (typeof avis.besoinsFormation === 'string' &&
          avis.besoinsFormation.trim() !== '') ||
        (avis.suggestions && avis.suggestions.toLowerCase().includes('besoin'))
      ) {
        avisAvecNouveauxBesoins++;
      }
    });

    // Calculer le taux
    this.tauxNouveauxBesoins = (avisAvecNouveauxBesoins / avis.length) * 100;
  }

  /**
   * Calcule le nombre de formateurs évalués
   */
  calculateNombreFormateursEvalues(avis: AvisDto[]): void {
    // Ensemble pour stocker les IDs uniques de formateurs évalués
    const formateursEvaluesIds = new Set<number>();

    avis.forEach((avis) => {
      if (avis.formateurIds && Array.isArray(avis.formateurIds)) {
        avis.formateurIds.forEach((formateurId) => {
          if (formateurId !== undefined && formateurId !== null) {
            formateursEvaluesIds.add(Number(formateurId));
          }
        });
      }
    });

    this.nombreFormateursEvalues = formateursEvaluesIds.size;
  }

  /**
   * Calcule le taux de complétion des avis
   */
  calculateTauxCompletionAvis(avis: AvisDto[]): void {
    if (!avis || avis.length === 0) {
      this.tauxCompletionAvis = 0;
      return;
    }

    let totalChamps = 0;
    let champsRemplis = 0;

    // Liste des champs d'évaluation à vérifier
    const champsAVerifier = [
      'evaluationFormateur',
      'evaluationEnvironnement',
      'evaluationMoyensPedagogiques',
      'noteGlobale',
      'commentaire',
      'suggestionsAmelioration',
    ];

    avis.forEach((avis) => {
      champsAVerifier.forEach((champ) => {
        totalChamps++;
        if (
          avis[champ as keyof AvisDto] !== undefined &&
          avis[champ as keyof AvisDto] !== null &&
          (typeof avis[champ as keyof AvisDto] !== 'string' ||
            (avis[champ as keyof AvisDto] as string).trim() !== '')
        ) {
          champsRemplis++;
        }
      });
    });

    this.tauxCompletionAvis =
      totalChamps > 0 ? (champsRemplis / totalChamps) * 100 : 0;
  }

  /**
   * Calcule la moyenne d'une propriété numérique dans un tableau d'objets
   */
  private calculerMoyenne(items: any[], propriete: string): number {
    let total = 0;
    let count = 0;

    items.forEach((item) => {
      if (item[propriete] !== undefined && item[propriete] !== null) {
        total += Number(item[propriete]);
        count++;
      }
    });

    return count > 0 ? Number((total / count).toFixed(1)) : 0;
  }

  /**
   * Formater une date pour l'affichage
   */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // format YYYY-MM-DD
  }

  /**
   * Formater un montant en devise
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Mettre à jour la période d'analyse et recharger les données
   */
  updatePeriode(): void {
    this.loadData();
  }

  /**
   * Naviguer vers les détails d'une session
   */
  navigateToSessionDetail(sessionId: number): void {
    this.router.navigate(['/sessions', sessionId]);
  }
  /**
   * Récupère le nom du formateur à partir de son ID
   */
  getFormateurNom(formateurIds?: Array<number>): string {
    if (!formateurIds || formateurIds.length === 0) {
      return 'Non spécifié';
    }

    // Si plusieurs formateurs, concaténer leurs noms
    return formateurIds
      .map((id) => {
        return this.formateurNamesMap.get(id) || `Formateur #${id}`;
      })
      .join(', ');
  }
  /**
   * Récupère le nom du formateur à partir de son ID
   */
  getUtilisateurNom(utilisateurId?: Array<number>): string {
    if (!utilisateurId || utilisateurId.length === 0) {
      return 'Non spécifié';
    }

    // Si plusieurs formateurs, concaténer leurs noms
    return utilisateurId
      .map((id) => {
        return this.UtilisateurNamesMap.get(id) || `utilisateurs #${id}`;
      })
      .join(', ');
  }

  /**
   * Formater une date en chaîne lisible
   */
  formatDate2(dateString?: string): string {
    if (!dateString) {
      return 'Non spécifié';
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
