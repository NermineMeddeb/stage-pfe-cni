import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  FormationsDto,
  SallesDto,
  SessionsDto,
  UtilisateursDto,
} from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { saveAs } from 'file-saver';

// Interface pour l'affichage
interface ParticipantPresence {
  id: number;
  nom: string;
  prenom: string;
  cin: string;
  etablissement: string;
  direction: string;
  presents: { [key: string]: boolean };
}

interface SessionCompleteData {
  session: SessionsDto;
  formation: FormationsDto;
  salle: SallesDto;
  formateur: UtilisateursDto;
  participants: ParticipantPresence[];
  datesList: string[];
}

@Component({
  selector: 'app-feuille-de-presence',
  templateUrl: './feuille-de-presence.component.html',
  styleUrls: ['./feuille-de-presence.component.css'],
})
export class FeuilleDePresenceComponent implements OnInit, OnDestroy {
  // Propriétés principales
  sessions: SessionsDto[] = [];
  selectedSessionId: number | null = null;
  sessionCompleteData: SessionCompleteData | null = null;
  
  // États de l'interface
  isLoading = false;
  errorMessage = '';
  showAttendanceSheet = false;

  // Subject pour gérer les désabonnements
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge la liste des sessions disponibles
   */
  private loadSessions(): void {
    this.setLoadingState(true);
    this.clearError();

    this.apiService
      .findAll_2()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe({
        next: (sessions: SessionsDto[]) => {
          this.sessions = sessions || [];
        },
        error: (error) => {
          console.error('Erreur lors du chargement des sessions:', error);
          this.setError('Erreur lors du chargement des sessions');
        },
      });
  }

  /**
   * Gère le changement de session sélectionnée
   */
  onSessionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    
    // Reset de l'état
    this.resetAttendanceSheet();
    
    if (this.isValidSessionValue(value)) {
      const parsedId = parseInt(value, 10);
      if (!isNaN(parsedId) && parsedId > 0) {
        this.selectedSessionId = parsedId;
      } else {
        this.selectedSessionId = null;
        this.setError('ID de session invalide');
      }
    } else {
      this.selectedSessionId = null;
    }
  }

  /**
   * Génère et affiche la feuille de présence
   */
  async generateAttendanceSheet(): Promise<void> {
    if (!this.validateSelectedSession()) {
      return;
    }

    this.setLoadingState(true);
    this.clearError();
    this.resetAttendanceSheet();

    try {
      // Chargement parallèle des données pour optimiser les performances
      const sessionCompleteData = await this.loadCompleteSessionData();
      
      if (this.validateCompleteData(sessionCompleteData)) {
        this.sessionCompleteData = sessionCompleteData;
        this.showAttendanceSheet = true;
        this.scrollToAttendanceSheet();
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      this.setError(`Erreur lors de la génération de la feuille de présence: ${error}`);
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Charge toutes les données nécessaires pour la session
   */
  private async loadCompleteSessionData(): Promise<SessionCompleteData> {
    const sessionId = this.selectedSessionId!;

    // Chargement de la session d'abord pour obtenir les IDs nécessaires
    const session = await this.loadSessionData(sessionId);
    
    // Chargement parallèle des autres données
    const [formation, salle, formateur, participants] = await Promise.all([
      this.loadFormationData(session.formationId!),
      this.loadSalleData(session.salleId!),
      this.loadFormateurData(sessionId),
      this.loadParticipantsData(sessionId)
    ]);

    const datesList = this.generateDatesList(session.dateDebut!, session.dateFin!);
    const mappedParticipants = this.mapParticipantsWithDates(participants, datesList);

    return {
      session,
      formation,
      salle,
      formateur,
      participants: mappedParticipants,
      datesList
    };
  }

  /**
   * Charge les données d'une session spécifique
   */
  private loadSessionData(sessionId: number): Promise<SessionsDto> {
    return new Promise((resolve, reject) => {
      this.apiService
        .findById_1(sessionId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (session: SessionsDto) => {
            if (session) {
              resolve(session);
            } else {
              reject('Session non trouvée');
            }
          },
          error: (error) => reject(error),
        });
    });
  }

  /**
   * Charge les données d'une formation
   */
  private loadFormationData(formationId: number): Promise<FormationsDto> {
    return new Promise((resolve, reject) => {
      if (!this.isValidId(formationId)) {
        reject('ID de formation invalide');
        return;
      }

      this.apiService
        .findFormationById(formationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (formation: FormationsDto) => resolve(formation),
          error: (error) => reject(error),
        });
    });
  }

  /**
   * Charge les données d'une salle
   */
  private loadSalleData(salleId: number): Promise<SallesDto> {
    return new Promise((resolve, reject) => {
      if (!this.isValidId(salleId)) {
        reject('ID de salle invalide');
        return;
      }

      this.apiService
        .findById_4(salleId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (salle: SallesDto) => resolve(salle),
          error: (error) => reject(error),
        });
    });
  }

  /**
   * Charge les données du formateur
   */
  private loadFormateurData(sessionId: number): Promise<UtilisateursDto> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getFormateur(sessionId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (formateurs: UtilisateursDto[]) => {
            if (formateurs && formateurs.length > 0) {
              resolve(formateurs[0]);
            } else {
              reject('Aucun formateur trouvé');
            }
          },
          error: (error) => reject(error),
        });
    });
  }

  /**
   * Charge les données des participants
   */
  private loadParticipantsData(sessionId: number): Promise<UtilisateursDto[]> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getStudentParticipants(sessionId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (participants: UtilisateursDto[]) => resolve(participants || []),
          error: (error) => reject(error),
        });
    });
  }

  /**
   * Génère la liste des dates entre deux dates
   */
  private generateDatesList(dateDebut: string, dateFin: string): string[] {
    const dates: string[] = [];
    
    try {
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);

      if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
        console.error('Dates invalides:', dateDebut, dateFin);
        return [];
      }

      const current = new Date(debut);
      while (current <= fin) {
        // Exclure les weekends (optionnel)
        if (current.getDay() !== 0 && current.getDay() !== 6) {
          dates.push(this.formatDateForHeader(current));
        }
        current.setDate(current.getDate() + 1);
      }

      return dates;
    } catch (error) {
      console.error('Erreur lors de la génération des dates:', error);
      return [];
    }
  }

  /**
   * Mappe les participants avec les dates de présence
   */
  private mapParticipantsWithDates(
    participants: UtilisateursDto[],
    datesList: string[]
  ): ParticipantPresence[] {
    return participants
      .filter((p) => p.id && p.nom && p.prenom)
      .map((p) => ({
        id: p.id!,
        nom: p.nom || '',
        prenom: p.prenom || '',
        cin: p.cin || 'Non spécifié',
        etablissement: p.etablissement || 'Non spécifié',
        direction: this.getDirectionFromRole(p.role),
        presents: datesList.reduce((acc, date) => {
          acc[date] = false;
          return acc;
        }, {} as { [key: string]: boolean }),
      }));
  }

  /**
   * Convertit le rôle en direction lisible
   */
  private getDirectionFromRole(role?: string): string {
    const roleMap: { [key: string]: string } = {
      'EXTERNE': 'Externe',
      'INTERNE': 'Interne',
      'ETUDIANT': 'Étudiant',
      'EMPLOYEE': 'Employé'
    };
    
    return roleMap[role || ''] || 'Non spécifié';
  }

  /**
   * Imprime la feuille de présence
   */
  printAttendanceSheet(): void {
    const elementsToHide = this.getElementsToHideForPrint();
    const originalStyles = this.saveOriginalStyles(elementsToHide);
    
    try {
      // Masquer les éléments non imprimables
      this.hideElementsForPrint(elementsToHide);
      
      // Configurer le body pour l'impression
      const bodyConfig = this.configureBodyForPrint();
      
      // Lancer l'impression
      window.print();
      
      // Restaurer après un délai
      setTimeout(() => {
        this.restoreAfterPrint(elementsToHide, originalStyles, bodyConfig);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      this.restoreAfterPrint(elementsToHide, originalStyles, { className: '', style: '' });
    }
  }

  /**
   * Obtient les éléments à masquer lors de l'impression
   */
  private getElementsToHideForPrint(): NodeListOf<Element> {
    return document.querySelectorAll(`
      .no-print, .screen-only, nav, .navbar, .sidebar, .btn, 
      .card-header, .alert:not(.print-info), .spinner-border,
      .breadcrumb, .pagination, .modal, .tooltip, .popover,
      app-sidebar, app-navbar, [class*="sidebar"], [class*="nav-"]
    `);
  }

  /**
   * Sauvegarde les styles originaux des éléments
   */
  private saveOriginalStyles(elements: NodeListOf<Element>): Map<Element, any> {
    const originalStyles = new Map();
    elements.forEach((element: any) => {
      originalStyles.set(element, {
        display: element.style.display,
        visibility: element.style.visibility,
        position: element.style.position
      });
    });
    return originalStyles;
  }

  /**
   * Masque les éléments pour l'impression
   */
  private hideElementsForPrint(elements: NodeListOf<Element>): void {
    elements.forEach((element: any) => {
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.position = 'absolute';
    });

    // Configurer la feuille de présence
    const attendanceSheet = document.querySelector('.attendance-sheet') as HTMLElement;
    if (attendanceSheet) {
      attendanceSheet.style.display = 'block';
      attendanceSheet.style.visibility = 'visible';
      attendanceSheet.style.width = '100%';
      attendanceSheet.style.margin = '0';
      attendanceSheet.style.padding = '10px';
    }
  }

  /**
   * Configure le body pour l'impression
   */
  private configureBodyForPrint(): { className: string; style: string } {
    const body = document.body;
    const originalConfig = {
      className: body.className,
      style: body.style.cssText
    };
    
    body.className = 'printing';
    body.style.background = 'white';
    body.style.margin = '0';
    body.style.padding = '0';
    
    return originalConfig;
  }

  /**
   * Restaure les styles après l'impression
   */
  private restoreAfterPrint(
    elements: NodeListOf<Element>, 
    originalStyles: Map<Element, any>,
    bodyConfig: { className: string; style: string }
  ): void {
    // Restaurer les éléments
    elements.forEach((element: any) => {
      const original = originalStyles.get(element);
      if (original) {
        element.style.display = original.display;
        element.style.visibility = original.visibility;
        element.style.position = original.position;
      }
    });

    // Restaurer le body
    const body = document.body;
    body.className = bodyConfig.className;
    body.style.cssText = bodyConfig.style;
    
    originalStyles.clear();
  }

  /**
   * Réinitialise le formulaire
   */
  resetForm(): void {
    if (this.showAttendanceSheet && !this.confirmReset()) {
      return;
    }

    this.selectedSessionId = null;
    this.sessionCompleteData = null;
    this.showAttendanceSheet = false;
    this.clearError();
    this.setLoadingState(false);

    this.focusOnSessionSelect();
  }

  /**
   * Demande confirmation avant réinitialisation
   */
  private confirmReset(): boolean {
    return confirm('Êtes-vous sûr de vouloir réinitialiser ? Toutes les données saisies seront perdues.');
  }

  /**
   * Met le focus sur le select de session
   */
  private focusOnSessionSelect(): void {
    setTimeout(() => {
      const selectElement = document.getElementById('sessionSelect') as HTMLSelectElement;
      if (selectElement) {
        selectElement.focus();
      }
    }, 100);
  }

  // ============ MÉTHODES DE FORMATAGE ============

  /**
   * Formate une date pour l'affichage complet
   */
  formatDateForDisplay(date: Date | string): string {
    if (!date) return '';
    
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return '';
      
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return '';
    }
  }

  /**
   * Formate une date pour les en-têtes de colonnes
   */
  private formatDateForHeader(date: Date | string): string {
    if (!date) return '';
    
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return '';
      
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      });
    } catch (error) {
      console.error('Erreur lors du formatage de la date pour en-tête:', error);
      return '';
    }
  }

  /**
   * Formate l'heure depuis une date
   */
  private formatTime(dateTime: string): string {
    if (!dateTime) return '';
    
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erreur lors du formatage de l\'heure:', error);
      return '';
    }
  }

  /**
   * Obtient le nom du jour à partir d'une date
   */
  getDayName(dateString: string): string {
    try {
      const parts = dateString.split('/');
      if (parts.length !== 2 && parts.length !== 3) return '';
      
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parts.length === 3 ? parseInt(parts[2], 10) : new Date().getFullYear();
      
      const date = new Date(year, month, day);
      if (isNaN(date.getTime())) return '';

      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      return days[date.getDay()];
    } catch (error) {
      console.error('Erreur lors du calcul du nom du jour:', error);
      return '';
    }
  }

  /**
   * Retourne la période de formation formatée
   */
  getFormationPeriod(): string {
    if (!this.sessionCompleteData?.session.dateDebut || !this.sessionCompleteData?.session.dateFin) {
      return 'Non spécifié';
    }

    const debut = this.formatDateForDisplay(this.sessionCompleteData.session.dateDebut);
    const fin = this.formatDateForDisplay(this.sessionCompleteData.session.dateFin);

    if (!debut || !fin) return 'Dates invalides';
    if (debut === fin) return `Le ${debut}`;
    
    return `Du ${debut} au ${fin}`;
  }

  /**
   * Retourne la période de session (horaires)
   */
  getSessionPeriod(): string {
    if (!this.sessionCompleteData?.session.dateDebut || !this.sessionCompleteData?.session.dateFin) {
      return '09:00 - 17:00'; // Valeur par défaut
    }

    const debut = this.formatTime(this.sessionCompleteData.session.dateDebut);
    const fin = this.formatTime(this.sessionCompleteData.session.dateFin);

    if (debut && fin) return `${debut} - ${fin}`;
    return debut || fin || '09:00 - 17:00';
  }

  // ============ MÉTHODES DE VALIDATION ============

  /**
   * Valide si la valeur de session est valide
   */
  private isValidSessionValue(value: string): boolean {
    return !!value && value !== '' && value !== 'null' && value !== 'undefined';
  }

  /**
   * Valide si un ID est valide
   */
  private isValidId(id: number): boolean {
    return id != null && !isNaN(id) && id > 0;
  }

  /**
   * Valide la session sélectionnée
   */
  private validateSelectedSession(): boolean {
    if (!this.selectedSessionId || isNaN(this.selectedSessionId)) {
      this.setError('Veuillez sélectionner une session valide');
      return false;
    }
    return true;
  }

  /**
   * Valide les données complètes avant affichage
   */
  private validateCompleteData(data: SessionCompleteData): boolean {
    if (!data.formation) {
      this.setError('Données de formation manquantes');
      return false;
    }

    if (!data.participants || data.participants.length === 0) {
      this.setError('Aucun participant inscrit à cette session');
      return false;
    }

    return true;
  }

  // ============ MÉTHODES UTILITAIRES ============

  /**
   * Définit l'état de chargement
   */
  private setLoadingState(loading: boolean): void {
    this.isLoading = loading;
  }

  /**
   * Définit un message d'erreur
   */
  private setError(message: string): void {
    this.errorMessage = message;
  }

  /**
   * Efface le message d'erreur
   */
  private clearError(): void {
    this.errorMessage = '';
  }

  /**
   * Remet à zéro la feuille de présence
   */
  private resetAttendanceSheet(): void {
    this.showAttendanceSheet = false;
    this.sessionCompleteData = null;
  }

  /**
   * Fait défiler vers la feuille de présence
   */
  private scrollToAttendanceSheet(): void {
    setTimeout(() => {
      const element = document.querySelector('.attendance-sheet');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }

  /**
   * Méthode de debug pour les sessions
   */
  debugSessions(): void {
    console.log('All sessions:', this.sessions);
    this.sessions.forEach((session, index) => {
      console.log(`Session ${index}:`, JSON.stringify(session, null, 2));
    });
  }// Ajoutez cette méthode à votre classe FeuilleDePresenceComponent

/**
 * Télécharge la feuille de présence au format HTML
 */
downloadAsHTML(): void {
  if (!this.sessionCompleteData) return;

  // Créer un clone de l'élément pour éviter d'affecter l'affichage
  const element = document.querySelector('.attendance-sheet')?.cloneNode(true) as HTMLElement;
  if (!element) return;

  // Nettoyer les éléments non nécessaires
  const noPrintElements = element.querySelectorAll('.no-print, .screen-only');
  noPrintElements.forEach(el => el.remove());

  // Créer le contenu HTML complet
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Feuille de Présence - ${this.sessionCompleteData.formation.titre}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .attendance-sheet { width: 100%; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .sheet-header { margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .signatures-section { margin-top: 40px; }
        .signature-line { margin-top: 60px; }
      </style>
    </head>
    <body>
      ${element.outerHTML}
    </body>
    </html>
  `;

  // Créer et déclencher le téléchargement
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Feuille_Presence_${this.sessionCompleteData.formation.titre}_${this.formatDateForDownload(new Date())}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Télécharge la feuille de présence au format PDF (nécessite une librairie comme html2pdf.js)
/**
 * Télécharge la feuille de présence au format PDF
 */
downloadAsPDF(): void {
  if (!this.sessionCompleteData) {
    console.error('Aucune donnée de session disponible');
    return;
  }

  this.setLoadingState(true);

  // Vous devrez implémenter generatePdf() ou utiliser une librairie comme pdfmake
  this.generatePdf(this.sessionCompleteData)
    .then((pdfBytes) => {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const fileName = `Feuille_Presence_${this.sessionCompleteData?.formation.titre}_${this.formatDateForDownload(new Date())}.pdf`;
      saveAs(blob, fileName);
    })
    .catch((error) => {
      console.error('Erreur lors de la génération du PDF:', error);
      this.setError("Erreur lors de la génération du PDF");
    })
    .finally(() => {
      this.setLoadingState(false);
    });
}

/**
 * Génère le PDF (à implémenter selon votre solution PDF)
 */
private generatePdf(sessionData: SessionCompleteData): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    // Implémentez ici la génération du PDF
    // Exemple avec pdfmake:
    /*
    const pdf = new PdfMakeWrapper();
    
    pdf.add(new Txt('FEUILLE DE PRÉSENCE').bold().fontSize(18).alignment('center').end);
    pdf.add(new Txt(sessionData.formation.titre).bold().fontSize(14).alignment('center').end);
    
    // Ajoutez le contenu du PDF ici...
    
    pdf.create().getBuffer((buffer) => {
      resolve(new Uint8Array(buffer));
    });
    */
    
    // Pour l'instant, on rejette car non implémenté
    reject('Méthode generatePdf non implémentée');
  });
}

/**
 * Formate la date pour le nom de fichier
 */
private formatDateForDownload(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}
}