import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  forkJoin,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import {
  CertificatsDto,
  InscriptionDto,
  UtilisateursDto,
  FormationsDto,
  Utilisateurs,
} from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-formation',
  templateUrl: './details-formation.component.html',
  styleUrls: ['./details-formation.component.css'],
})
export class DetailsFormationComponent implements OnInit, OnDestroy {
  @Input() FormationsDto!: FormationsDto;
  @Output() suppressionResult = new EventEmitter<boolean>();

  // Pour les messages d'erreur et de succèsACC
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  private destroy$ = new Subject<void>();

  // Pour l'état de génération
  public isGenerating = false;

  // Constante pour le chemin du template PDF
  private readonly PDF_TEMPLATE_PATH = 'assets/templates/devis-template.pdf';

  constructor(private route: Router, private formationsService: ApiService) {}

  ngOnInit(): void {
    console.log('Formation reçue:', this.FormationsDto);
  }

  // Gestion de la fermeture du composant
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  voirApercu(formationId?: number) {
    if (formationId) {
      const url = `formations/${formationId}/apercu`;
      console.log('URL de redirection :', url);
      this.route
        .navigate([url])
        .then((navigationSuccessful) => {
          if (navigationSuccessful) {
            console.log('Navigation réussie');
          } else {
            console.log('Navigation échouée');
          }
        })
        .catch((err) => {
          console.error('Erreur de navigation :', err);
        });
    } else {
      console.error('Impossible de naviguer, ID manquant !');
    }
  }

  inscrire(formationId: number): void {
    console.log('Inscription requested for formation ID:', formationId);
    this.route.navigate([`/etudiant/inscription-client/${formationId}`]);
  }

  genererDevis(): void {
    console.log('Début de la fonction genererDevis');
    const formationId = this.FormationsDto?.id;
    //Vérification de la formation sélectionnée
    if (!formationId) {
      console.log('Erreur: Aucune formation sélectionnée');
      this.showError('Veuillez sélectionner une formation');
      return;
    }

    this.isGenerating = true;
    this.errorMessage = null;
    this.successMessage = null;
    console.log('Début récupération des données pour le devis');

    // Récupération des données nécessaires pour la génération
    this.getDataForDevis(formationId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          console.log('Finalisation - isGenerating mis à false');
          this.isGenerating = false;
        })
      )
      .subscribe({
        next: async (data) => {
          console.log('Données reçues pour le devis:', data);
          if (!data) {
            console.log('Erreur: Aucune donnée reçue');
            this.showError(
              'Erreur: Impossible de récupérer les données pour le devis'
            );
            return;
          }

          try {
            console.log('Début génération du PDF de devis');
            // Génération du PDF selon le modèle CNI
            const pdfBytes = await this.generatePdfDevis({
              titreFormation: data.formation.titre || 'Formation non spécifiée',
              dateDebut: this.formatDate(data.session?.dateDebut),
              dateFin: this.formatDate(data.session?.dateFin),
              heureDebut: this.formatTime(data.session?.heureDebut),
              heureFin: this.formatTime(data.session?.heureFin),
              prix: data.formation.prix || 0,
              client: {
                nom: data.utilisateur?.nom || 'Client',
                prenom: data.utilisateur?.prenom || '',
                email: data.utilisateur?.email || 'Non spécifié',
              },
            });
            console.log('PDF du devis CNI généré avec succès');

            // Création du Blob et préparation du fichier
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const nomFichier = `Devis-CNI-${
              data.formation.titre
                ? data.formation.titre.substring(0, 20)
                : 'Formation'
            }-${Date.now()}.pdf`;
            console.log('Blob créé, nom du fichier:', nomFichier);

            // Sauvegarde du fichier
            saveAs(blob, nomFichier);
            this.showSuccess('Devis généré et téléchargé avec succès!');
          } catch (err) {
            console.error('Erreur lors de la génération du PDF du devis:', err);
            this.showError(
              `Erreur lors de la génération du devis: ${(err as Error).message}`
            );
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des données:', err);
          this.showError(
            `Erreur lors de la génération du devis: ${err.message}`
          );
        },
      });
    console.log('Fin de la fonction genererDevis (asynchrone en cours)');
  }

  genererCertificat(inscriptionId?: number): void {
    // Implementez cette méthode pour générer un certificat
    console.log('Génération du certificat pour inscription ID:', inscriptionId);
    // À compléter selon vos besoins
  }

  private async generatePdfCertificate(data: {
    recipient: string;
    title: string;
    dateDebut: string;
    dateFin: string;
    dateEmission: string;
  }): Promise<Uint8Array> {
    try {
      // Vérification du chemin du template
      if (!this.PDF_TEMPLATE_PATH) {
        throw new Error('Chemin du template PDF non défini');
      }

      // Chargement du modèle de certificat
      let pdfDoc;
      try {
        const existingPdfBytes = await fetch(this.PDF_TEMPLATE_PATH).then(
          (res) => {
            if (!res.ok) {
              throw new Error(
                `Erreur lors du chargement du template: ${res.status} ${res.statusText}`
              );
            }
            return res.arrayBuffer();
          }
        );
        pdfDoc = await PDFDocument.load(existingPdfBytes);
      } catch (error) {
        console.error(
          "Erreur lors du chargement du template, création d'un nouveau document:",
          error
        );
        pdfDoc = await PDFDocument.create();
        pdfDoc.addPage([595, 842]); // Format A4
      }

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // Police pour le texte - gestion des erreurs d'incorporation de police
      let helvetica, helveticaBold, helveticaOblique;
      try {
        helvetica = await pdfDoc.embedFont('Helvetica');
        helveticaBold = await pdfDoc.embedFont('Helvetica-Bold');
        helveticaOblique = await pdfDoc.embedFont('Helvetica-Oblique');
      } catch (error) {
        console.error('Erreur lors du chargement des polices:', error);
        // Utiliser une police par défaut si les polices demandées ne sont pas disponibles
        helvetica =
          helveticaBold =
          helveticaOblique =
            await pdfDoc.embedFont('Helvetica');
      }

      // Ajout du nom du destinataire
      firstPage.drawText(data.recipient, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(data.recipient, 24, helveticaBold),
        y: height / 2 - 10,
        size: 24,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Ajout du titre de la formation
      firstPage.drawText(data.title, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(data.title, 24, helveticaBold),
        y: height / 2 - 140,
        size: 18,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Ajout des dates de formation
      const dateText = `Du ${data.dateDebut} au ${data.dateFin}`;
      firstPage.drawText(dateText, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(dateText, 24, helveticaBold),
        y: height / 2 - 60,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Ajout de la date d'émission
      const emissionText = `Délivré le ${data.dateEmission}`;
      firstPage.drawText(emissionText, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(
            emissionText,
            10,
            helveticaOblique
          ),
        y: height / 2 - 120,
        size: 10,
        font: helveticaOblique,
        color: rgb(0, 0, 0),
      });

      // Signature
      firstPage.drawText('Signature du responsable', {
        x: width - 150,
        y: 100,
        size: 10,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      return await pdfDoc.save();
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw error;
    }
  }

  // Méthode pour récupérer les données nécessaires au devis
  private getDataForDevis(formationId: number): Observable<any> {
    console.log(
      `Récupération des données pour le devis de la formation ID: ${formationId}`
    );
    // Récupération des informations de l'utilisateur connecté
    const userId = this.getUserId();
    // Récupération de la session liée à la formation
    return this.formationsService.findFormationById(formationId).pipe(
      switchMap((formation) => {
        // Récupérer la première session liée à cette formation
        return this.formationsService.findByFormation(formationId).pipe(
          map((sessions) => {
            if (!sessions || sessions.length === 0) {
              throw new Error('Aucune session trouvée pour cette formation');
            }
            return sessions[0]; // Prendre la première session disponible
          }),
          switchMap((session) => {
            return forkJoin({
              formation: of(formation),
              session: of(session),
              utilisateur: this.formationsService.findById_3(userId),
            });
          })
        );
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des données:', error);
        this.showError(`Erreur: ${error.message}`);
        return of(null);
      })
    );
  }

  // Méthode pour formater la date
  private formatDate(date?: Date | string): string {
    if (!date) return 'N/A';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  // Méthode pour formater l'heure
  private formatTime(time?: Date | string): string {
    if (!time) return 'N/A';

    const timeObj = typeof time === 'string' ? new Date(time) : time;
    return timeObj.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Méthode pour calculer la position du texte centré
  private calculateCenteredTextPosition(
    text: string,
    fontSize: number,
    font: any
  ): number {
    // Une estimation plus précise peut nécessiter l'utilisation des métriques de police
    return (text.length * fontSize) / 4;
  }

  // Méthode pour afficher un message d'erreur
  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  // Méthode pour afficher un message de succès
  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 5000);
  }

  // Méthode pour obtenir l'ID de l'utilisateur connecté
  private getUserId(): number {
    // TODO: Implémenter la récupération de l'ID utilisateur depuis le service d'authentification
    // Par exemple:
    // return this.authService.getCurrentUser()?.id;

    // Pour le moment, on retourne une valeur par défaut
    return 1;
  }

  // Méthode pour générer le PDF du devis
  private async generatePdfDevis(data: {
    titreFormation: string;
    dateDebut: Date | string;
    dateFin: Date | string;
    heureDebut: string;
    heureFin: string;
    prix: number;
    client: {
      nom: string;
      prenom: string;
      email: string;
    };
  }): Promise<Uint8Array> {
    try {
      // Création d'un nouveau PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // Format A4
      const { width, height } = page.getSize();

      // Police pour le texte - avec gestion d'erreurs
      let helvetica, helveticaBold, helveticaOblique;
      try {
        // Essayer d'abord la police Times-New-Roman comme spécifié
        helvetica = await pdfDoc.embedFont('Times-Roman');
      } catch (error) {
        console.warn(
          'Times-Roman non disponible, utilisation de Helvetica:',
          error
        );
        helvetica = await pdfDoc.embedFont('Helvetica');
      }

      try {
        helveticaBold = await pdfDoc.embedFont('Helvetica-Bold');
        helveticaOblique = await pdfDoc.embedFont('Helvetica-Oblique');
      } catch (error) {
        console.warn(
          'Police(s) non disponible(s), utilisation de substituts:',
          error
        );
        helveticaBold = helveticaOblique = helvetica;
      }

      // En-tête avec logo CNI
      page.drawText("Centre National de l'Informatique", {
        x: width / 2 - 120,
        y: height - 50,
        size: 16,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Titre du document
      page.drawText('DEVIS DE FORMATION', {
        x: width / 2 - 80,
        y: height - 80,
        size: 14,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Date du devis
      const today = new Date().toLocaleDateString('fr-FR');
      page.drawText(`Date: ${today}`, {
        x: width - 150,
        y: height - 100,
        size: 10,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Information du client
      page.drawText(`Client: ${data.client.nom} ${data.client.prenom}`, {
        x: 50,
        y: height - 130,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Email: ${data.client.email}`, {
        x: 50,
        y: height - 145,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Contenu principal basé sur le modèle fourni
      const startY = height - 180;
      const lineHeight = 20;

      page.drawText('Annonce Concernant la formation :', {
        x: 50,
        y: startY,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(
        "Le Centre National de l'Informatique organise une session de formation sur",
        {
          x: 50,
          y: startY - lineHeight,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      // Titre de la formation en gras et légèrement indenté
      page.drawText(data.titreFormation, {
        x: 60,
        y: startY - lineHeight * 2,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(
        `qui se tiendra du ${data.dateDebut} au ${data.dateFin}. La session débutera à`,
        {
          x: 50,
          y: startY - lineHeight * 3,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText(
        `${data.heureDebut} et se poursuivra jusqu'à ${data.heureFin}.`,
        {
          x: 50,
          y: startY - lineHeight * 4,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      // Calcul de la TVA (19% selon le modèle)
      const tva = data.prix * 0.19;
      const totalTTC = data.prix + tva;

      page.drawText(
        `Il est à noter que le coût total par participant est fixé à ${data.prix.toFixed(
          2
        )} dinars`,
        {
          x: 50,
          y: startY - lineHeight * 5,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText(
        `hors taxe sur la valeur ajoutée, soit ${totalTTC.toFixed(2)} dinars`,
        {
          x: 50,
          y: startY - lineHeight * 6,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText('TVA comprise (19 %).', {
        x: 50,
        y: startY - lineHeight * 7,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Informations de contact
      page.drawText(
        "Pour participer à la formation, il est nécessaire de se présenter muni d'un bon de",
        {
          x: 50,
          y: startY - lineHeight * 9,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText(
        'commande, et de contacter Mr. Hafedh Ammar au numéro 71 783 055 poste',
        {
          x: 50,
          y: startY - lineHeight * 10,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText(
        '277, ou au 98 903 860, ou par fax au 71 894 255, ou par email à',
        {
          x: 50,
          y: startY - lineHeight * 11,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText(
        "hafedh.ammar@cni.tn pour l'inscription sur la liste des participants.",
        {
          x: 50,
          y: startY - lineHeight * 12,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText(
        'Nous vous invitons également à vous assurer de la tenue de la session de',
        {
          x: 50,
          y: startY - lineHeight * 14,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText('formation à la date prévue.', {
        x: 50,
        y: startY - lineHeight * 15,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Résumé des coûts dans un tableau
      const tableTop = startY - lineHeight * 17;
      const tableLeft = width / 2 - 150;
      const tableWidth = 300;
      const rowHeight = 25;

      // En-tête du tableau
      page.drawRectangle({
        x: tableLeft,
        y: tableTop,
        width: tableWidth,
        height: rowHeight,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      page.drawText('Résumé des coûts', {
        x: tableLeft + tableWidth / 2 - 50,
        y: tableTop + rowHeight / 2 - 6,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Ligne Montant HT
      page.drawRectangle({
        x: tableLeft,
        y: tableTop - rowHeight,
        width: tableWidth / 2,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      page.drawRectangle({
        x: tableLeft + tableWidth / 2,
        y: tableTop - rowHeight,
        width: tableWidth / 2,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      page.drawText('Montant HT', {
        x: tableLeft + 10,
        y: tableTop - rowHeight / 2 - 6,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${data.prix.toFixed(2)} dinars`, {
        x: tableLeft + tableWidth / 2 + 10,
        y: tableTop - rowHeight / 2 - 6,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Ligne TVA
      page.drawRectangle({
        x: tableLeft,
        y: tableTop - rowHeight * 2,
        width: tableWidth / 2,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      page.drawRectangle({
        x: tableLeft + tableWidth / 2,
        y: tableTop - rowHeight * 2,
        width: tableWidth / 2,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      page.drawText('TVA (19%)', {
        x: tableLeft + 10,
        y: tableTop - rowHeight * 1.5 - 6,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${tva.toFixed(2)} dinars`, {
        x: tableLeft + tableWidth / 2 + 10,
        y: tableTop - rowHeight * 1.5 - 6,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Ligne Total TTC
      page.drawRectangle({
        x: tableLeft,
        y: tableTop - rowHeight * 3,
        width: tableWidth / 2,
        height: rowHeight,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      page.drawRectangle({
        x: tableLeft + tableWidth / 2,
        y: tableTop - rowHeight * 3,
        width: tableWidth / 2,
        height: rowHeight,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      page.drawText('Total TTC', {
        x: tableLeft + 10,
        y: tableTop - rowHeight * 2.5 - 6,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${totalTTC.toFixed(2)} dinars`, {
        x: tableLeft + tableWidth / 2 + 10,
        y: tableTop - rowHeight * 2.5 - 6,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Zone de signature
      page.drawText('Signature et cachet', {
        x: width - 150,
        y: tableTop - rowHeight * 5,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Pied de page
      page.drawText("Centre National de l'Informatique - Devis de formation", {
        x: width / 2 - 130,
        y: 30,
        size: 10,
        font: helveticaOblique,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Référence: DEV-${Date.now().toString().substring(8)}`, {
        x: width / 2 - 70,
        y: 15,
        size: 10,
        font: helveticaOblique,
        color: rgb(0, 0, 0),
      });

      return await pdfDoc.save();
    } catch (error) {
      console.error('Erreur lors de la génération du PDF du devis:', error);
      throw error;
    }
  }
  
}
