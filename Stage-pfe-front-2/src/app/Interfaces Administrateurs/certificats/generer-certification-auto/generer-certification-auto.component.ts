import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { PDFDocument, rgb, PDFFont } from 'pdf-lib';
import { saveAs } from 'file-saver';
import {
  CertificatsDto,
  InscriptionDto,
  UtilisateursDto,
  FormationsDto,
  Utilisateurs,
} from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';

// Interface pour les détails de certification
interface CertificationDetails {
  certification: CertificatsDto;
  inscription?: InscriptionDto;
  utilisateur?: UtilisateursDto;
}

interface InscriptionAvecUtilisateur {
  inscription: InscriptionDto;
  utilisateur: UtilisateursDto | null;
}

// Enum pour les statuts de certification
enum CertificatStatus {
  EN_ATTENTE = 'EN ATTENTE',
  VALIDE = 'VALIDÉ',
  REJETE = 'REJETÉ',
}

@Component({
  selector: 'app-generer-certification-auto',
  templateUrl: './generer-certification-auto.component.html',
  styleUrls: ['./generer-certification-auto.component.css'],
})
export class GenererCertificationAutoComponent implements OnInit, OnDestroy {
  // Constantes pour les URL et chemins
  private readonly PDF_TEMPLATE_PATH_FR =
    'assets/certifications/ATTESTATION.pdf';
  private readonly PDF_TEMPLATE_PATH_AR =
    'assets/certifications/ATTESTATION_ARABE.pdf';

  // Propriétés pour les données
  certifications: CertificationDetails[] = [];
  filteredCertifications: CertificationDetails[] = [];
  inscriptions: InscriptionDto[] = [];
  inscriptionsAvecUtilisateurs: InscriptionAvecUtilisateur[] = [];

  // Formulaires et contrôles
  filterForm = new FormGroup({
    searchTerm: new FormControl(''),
    statut: new FormControl(CertificatStatus.EN_ATTENTE),
    dateDebut: new FormControl(''),
    dateFin: new FormControl(''),
  });

  generationForm = new FormGroup({
    inscriptionId: new FormControl(null, Validators.required),
    generateInArabic: new FormControl(false),
  });

  // États du composant
  isLoading = false;
  isGenerating = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Variables pour la popup de confirmation
  showConfirmationPopup = false;
  confirmationMessage = '';
  pendingStatusUpdate: { id: number; status: CertificatStatus } | null = null;

  // Enum pour l'accès depuis le template
  certificatStatus = CertificatStatus;

  // Gestion de la destruction du composant
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.initializeFilters();
    this.loadCertifications();
    this.loadInscriptions();
    this.loadInscriptionsSansCertificat();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialisation des filtres et souscription aux changements
  private initializeFilters(): void {
    this.filterForm
      .get('searchTerm')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());

    // Écouter les changements des autres filtres aussi
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());
  }

  // Chargement des inscriptions disponibles pour la génération
  loadInscriptions(): void {
    this.apiService
      .getInscriptionsNonGenerees()
      .pipe(
        takeUntil(this.destroy$),
        catchError((err: any): Observable<InscriptionDto[]> => {
          console.error('Erreur lors du chargement des inscriptions:', err);
          this.showError('Erreur lors du chargement des inscriptions');
          return of([]);
        })
      )
      .subscribe((inscriptions: InscriptionDto[]) => {
        this.inscriptions = inscriptions;
      });
  }

  // Chargement des certifications avec leurs détails associés
  loadCertifications(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService
      .getAllCertificats()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((certifications: CertificatsDto[]) => {
          if (!certifications.length) {
            return of([]);
          }

          // Créer des requêtes pour chaque certification
          const detailsRequests = certifications.map((cert) =>
            this.getCertificationDetails(cert)
          );

          return forkJoin(detailsRequests);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (certificationsDetails: CertificationDetails[]) => {
          this.certifications = certificationsDetails;
          this.applyFilters();
        },
        error: (err: any) => {
          const errorMessage = err?.message || 'Erreur inconnue';
          this.showError(
            `Erreur lors du chargement des certifications: ${errorMessage}`
          );
        },
      });
  }

  // Récupération des détails pour une certification spécifique
  private getCertificationDetails(
    certification: CertificatsDto
  ): Observable<CertificationDetails> {
    if (!certification.inscriptionId) {
      return of({ certification });
    }

    return this.apiService.getInscriptionById(certification.inscriptionId).pipe(
      catchError(() => of(null)),
      switchMap((inscription) => {
        if (!inscription?.id) {
          return of({ certification });
        }

        return this.apiService
          .getUtilisateurByInscriptionId(inscription.id)
          .pipe(
            catchError(() => of(null)),
            map((utilisateur) => ({
              certification,
              inscription,
              utilisateur,
            }))
          );
      })
    );
  }

  // Application des filtres sur les certifications
  applyFilters(): void {
    const formValues = this.filterForm.value;
    const searchTerm = (formValues.searchTerm || '').toLowerCase().trim();
    const statut = formValues.statut;
    const dateDebut = formValues.dateDebut;
    const dateFin = formValues.dateFin;

    this.filteredCertifications = this.certifications.filter((item) => {
      // Filtrage par terme de recherche
      const matchesSearch =
        !searchTerm ||
        item.certification.numeroSerie?.toLowerCase().includes(searchTerm) ||
        item.utilisateur?.nom?.toLowerCase().includes(searchTerm) ||
        item.utilisateur?.prenom?.toLowerCase().includes(searchTerm) ||
        item.utilisateur?.email?.toLowerCase().includes(searchTerm);

      // Filtrage par statut
      const matchesStatut = !statut || item.certification.statut === statut;

      // Filtrage par date de début
      const matchesDateDebut =
        !dateDebut ||
        (item.certification.dateGeneration &&
          new Date(item.certification.dateGeneration) >= new Date(dateDebut));

      // Filtrage par date de fin
      const matchesDateFin =
        !dateFin ||
        (item.certification.dateGeneration &&
          new Date(item.certification.dateGeneration) <= new Date(dateFin));

      return (
        matchesSearch && matchesStatut && matchesDateDebut && matchesDateFin
      );
    });
  }

  // Réinitialisation des filtres
  resetFilters(): void {
    this.filterForm.setValue({
      searchTerm: '',
      statut: CertificatStatus.EN_ATTENTE,
      dateDebut: '',
      dateFin: '',
    });
    this.applyFilters();
  }

  // Construction de l'URL complète pour un chemin relatif
  getFullUrl(relativePath: string | undefined): string | null {
    if (!relativePath) return null;

    // Vérification de sécurité pour les chemins locaux
    if (relativePath.startsWith('file:///')) {
      console.error('Chemin local détecté :', relativePath);
      return null;
    }

    return `${window.location.origin}/${relativePath.replace(/^src\//, '')}`;
  }

  // Affichage du certificat dans un nouvel onglet
  voirCertificat(fileUrl: string | undefined): void {
    const fullUrl = this.getFullUrl(fileUrl);
    if (fullUrl) {
      window.open(fullUrl, '_blank');
    } else {
      this.showError('Aucune URL de certificat disponible.');
    }
  }

  // Téléchargement du certificat
  telechargerCertificat(fileUrl: string | undefined): void {
    const fullUrl = this.getFullUrl(fileUrl);
    if (fullUrl) {
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = 'certificat.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      this.showError('Aucune URL de certificat disponible.');
    }
  }

  // Suppression d'un certificat
  supprimerCertificat(numeroSerie: any | undefined): void {
    if (!numeroSerie) {
      this.showError('Numéro de série de certificat manquant.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce certificat?')) {
      this.isLoading = true;
      this.apiService
        .supprimerCertificatByNumeroDeSerie(numeroSerie)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isLoading = false))
        )
        .subscribe({
          next: () => {
            this.showSuccess('Certificat supprimé avec succès.');
            this.loadCertifications();
          },
          error: (err) => {
            const errorMessage = err?.message || 'Erreur inconnue';
            this.showError(
              `Erreur lors de la suppression du certificat: ${errorMessage}`
            );
          },
        });
    }
  }

  // Formatage de date en français
  private formatDate(date: Date | string | undefined): string {
    const dateToFormat = date ? new Date(date) : new Date();

    // Vérifier si la date est valide
    if (isNaN(dateToFormat.getTime())) {
      return new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }

    return dateToFormat.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  // Formatage de date en arabe
  private formatDateArabic(date: Date | string | undefined): string {
    const dateToFormat = date ? new Date(date) : new Date();

    // Vérifier si la date est valide
    if (isNaN(dateToFormat.getTime())) {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear().toString();
      return `${day}/${month}/${year}`;
    }

    const day = dateToFormat.getDate().toString().padStart(2, '0');
    const month = (dateToFormat.getMonth() + 1).toString().padStart(2, '0');
    const year = dateToFormat.getFullYear().toString();

    return `${day}/${month}/${year}`;
  }

  // Génération d'un nouveau certificat
  genererCertificat(): void {
    console.log('Début de la fonction genererCertificat');

    if (this.generationForm.invalid) {
      this.showError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const inscriptionId = this.generationForm.get('inscriptionId')?.value;
    const generateInArabic =
      this.generationForm.get('generateInArabic')?.value || false;

    console.log('InscriptionId récupéré:', inscriptionId);
    console.log('Générer en arabe:', generateInArabic);

    if (!inscriptionId) {
      console.log('Erreur: Aucun inscriptionId sélectionné');
      this.showError('Veuillez sélectionner une inscription');
      return;
    }

    this.isGenerating = true;
    this.errorMessage = null;
    this.successMessage = null;
    console.log('Début récupération des données pour le certificat');

    // Récupération des données nécessaires pour la génération
    this.getDataForCertificate(inscriptionId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          console.log('Finalisation - isGenerating mis à false');
          this.isGenerating = false;
        })
      )
      .subscribe({
        next: async (data) => {
          console.log('Données reçues pour le certificat:', data);
          if (!data) {
            console.log('Erreur: Aucune donnée reçue');
            this.showError(
              'Impossible de récupérer les données pour la génération du certificat'
            );
            return;
          }

          try {
            console.log('Début génération du PDF');

            // Génération du PDF selon la langue choisie
            const pdfBytes = generateInArabic
              ? await this.generatePdfCertificateArabic({
                  recipient: this.formatRecipientName(data.utilisateur),
                  title: this.getFormationTitle(data.formation),
                  dateDebut: this.formatDateArabic(data.inscription.dateDebut),
                  dateFin: this.formatDateArabic(data.inscription.dateFin),
                  dateEmission: this.formatDateArabic(new Date()),
                })
              : await this.generatePdfCertificate({
                  recipient: this.formatRecipientName(data.utilisateur),
                  title: this.getFormationTitle(data.formation),
                  dateDebut: this.formatDate(data.inscription.dateDebut),
                  dateFin: this.formatDate(data.inscription.dateFin),
                  dateEmission: this.formatDate(new Date()),
                });

            console.log('PDF généré avec succès');

            // Création du Blob et préparation du fichier
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const langSuffix = generateInArabic ? '-AR' : '-FR';
            const nomFichier = `Certificat${langSuffix}-${
              data.utilisateur?.nom || 'Participant'
            }-${Date.now()}.pdf`;
            console.log('Blob créé, nom du fichier:', nomFichier);

            // Enregistrement du certificat dans la base de données
            const nouveauCertificat: CertificatsDto = {
              inscriptionId: data.inscription.id,
              dateGeneration: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
              statut: CertificatStatus.EN_ATTENTE,
              numeroSerie: `CERT-${Date.now()}`,
              file_url: `assets/certifications/${nomFichier}`,
            };

            console.log('Objet certificat créé:', nouveauCertificat);

            console.log('Appel API pour enregistrer le certificat');
            this.apiService.genererCertificat(nouveauCertificat).subscribe({
              next: (response) => {
                console.log('Certificat enregistré avec succès:', response);
                const successMsg = generateInArabic
                  ? 'Certificat en arabe généré avec succès et en attente de validation!'
                  : 'Certificat en français généré avec succès et en attente de validation!';
                this.showSuccess(successMsg);
                this.loadCertifications();
                this.generationForm.reset();
                console.log('Sauvegarde du fichier PDF');
                saveAs(blob, nomFichier);

                // Appeler la méthode transformCertificatToGenerate ici
                console.log('Appel à transformCertificatToGenerate');
                this.apiService
                  .transformCertificatToGenerate(data.inscription.id!)
                  .subscribe({
                    next: () => {
                      console.log('Certificat mis à jour avec succès.');
                      this.loadInscriptions(); // Recharger les inscriptions disponibles
                    },
                    error: (err) => {
                      console.error(
                        'Erreur lors de la mise à jour du certificat:',
                        err
                      );
                      this.showError(
                        `Erreur lors de la mise à jour du certificat: ${err.message}`
                      );
                    },
                  });
              },
              error: (err) => {
                console.error(
                  "Erreur lors de l'enregistrement du certificat:",
                  err
                );
                this.showError(
                  `Erreur lors de l'enregistrement du certificat: ${err.message}`
                );
              },
            });
          } catch (err) {
            console.error('Erreur lors de la génération du PDF:', err);
            this.showError(
              `Erreur lors de la génération du PDF: ${(err as Error).message}`
            );
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des données:', err);
          this.showError(
            `Erreur lors de la génération du certificat: ${err.message}`
          );
        },
      });
    console.log('Fin de la fonction genererCertificat (asynchrone en cours)');
  }

  // Génération du PDF en arabe (version corrigée)
  private async generatePdfCertificateArabic(data: {
    recipient: string;
    title: string;
    dateDebut: string;
    dateFin: string;
    dateEmission: string;
  }): Promise<Uint8Array> {
    try {
      const existingPdfBytes = await fetch(this.PDF_TEMPLATE_PATH_AR).then(
        (res) => {
          if (!res.ok) {
            throw new Error(
              `Erreur lors du chargement du template: ${res.status}`
            );
          }
          return res.arrayBuffer();
        }
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // Polices par défaut
      const helvetica = await pdfDoc.embedFont('Helvetica');
      const helveticaBold = await pdfDoc.embedFont('Helvetica-Bold');
      const helveticaOblique = await pdfDoc.embedFont('Helvetica-Oblique');

      // Tentative d'utilisation d'une police arabe
      let arabicFont: PDFFont = helvetica; // Police de fallback

      try {
        const arabicFontBytes = await fetch(
          'assets/fonts/NotoSansArabic-VariableFont_wdth,wght.ttf'
        ).then((res) => {
          if (!res.ok) {
            throw new Error('Police arabe non trouvée');
          }
          return res.arrayBuffer();
        });
        arabicFont = await pdfDoc.embedFont(arabicFontBytes);
        console.log('Police arabe chargée avec succès');
      } catch (fontError) {
        console.warn(
          'Police arabe non trouvée, utilisation de Helvetica:',
          fontError
        );
      }

      // Ajout du nom du destinataire aligné à gauche
      firstPage.drawText(data.recipient, {
        x: 50, // Position fixe à gauche (ajuster cette valeur selon vos besoins)
        y: height / 2 - 5,
        size: 24,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Ajout du titre de la formation
      firstPage.drawText(data.title, {
        x:
          50,
        y: height / 2 - 110,
        size: 18,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Ajout des dates en arabe si la police est disponible
      const dateTextArabic =
        arabicFont !== helvetica
          ? `من ${data.dateDebut} إلى ${data.dateFin}`
          : `Du ${data.dateDebut} au ${data.dateFin}`;

      firstPage.drawText(dateTextArabic, {
        x: 50,
        y: height / 2 - 60,
        size: 12,
        font: arabicFont,
        color: rgb(0, 0, 0),
      });

      // Ajout de la date d'émission
      const emissionText =
        arabicFont !== helvetica
          ? `صادر في ${data.dateEmission}`
          : `Délivré le ${data.dateEmission}`;

      firstPage.drawText(emissionText, {
        x:
          width -
          50 -
          this.calculateCenteredTextPosition(
            emissionText,
            10,
            helveticaOblique
          ),
        y: height / 2 - 200,
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
      console.error('Erreur lors de la génération du PDF arabe:', error);
      throw error;
    }
  }
  // Récupération des données pour la génération du certificat
  private getDataForCertificate(inscriptionId: number): Observable<{
    inscription: InscriptionDto;
    utilisateur: UtilisateursDto | null;
    formation: FormationsDto | null;
  } | null> {
    return this.apiService.getInscriptionById(inscriptionId).pipe(
      switchMap((inscription) => {
        if (!inscription || !inscription.id) {
          throw new Error('Inscription introuvable');
        }

        // Récupération de l'utilisateur associé à l'inscription
        const utilisateurObs = this.apiService
          .getUtilisateurByInscriptionId(inscription.id)
          .pipe(catchError(() => of(null)));

        // Récupération de la formation associée à la session
        const formationObs = this.apiService
          .findById_1(inscription.sessionId)
          .pipe(
            switchMap((session) => {
              if (session && session.formationId) {
                return this.apiService
                  .findFormationById(session.formationId)
                  .pipe(catchError(() => of(null)));
              }
              return of(null);
            }),
            catchError(() => of(null))
          );

        // Combinaison des résultats
        return forkJoin({
          inscription: of(inscription),
          utilisateur: utilisateurObs,
          formation: formationObs,
        });
      }),
      catchError((err: Error) => {
        this.showError(
          `Erreur lors de la récupération des données: ${err.message}`
        );
        return of(null);
      })
    );
  }

  // Format du nom du destinataire
  private formatRecipientName(utilisateur?: UtilisateursDto | null): string {
    if (!utilisateur) return 'Participant';
    return (
      `${utilisateur.nom || ''} ${utilisateur.prenom || ''}`.trim() ||
      'Participant'
    );
  }

  // Récupération du titre de la formation
  private getFormationTitle(formation: FormationsDto | null): string {
    return formation?.titre || 'Formation';
  }

  // Génération du PDF avec pdf-lib (version française)
  private async generatePdfCertificate(data: {
    recipient: string;
    title: string;
    dateDebut: string;
    dateFin: string;
    dateEmission: string;
  }): Promise<Uint8Array> {
    try {
      // Chargement du modèle de certificat français
      const existingPdfBytes = await fetch(this.PDF_TEMPLATE_PATH_FR).then(
        (res) => res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // Police pour le texte
      const helvetica = await pdfDoc.embedFont('Helvetica');
      const helveticaBold = await pdfDoc.embedFont('Helvetica-Bold');
      const helveticaOblique = await pdfDoc.embedFont('Helvetica-Oblique');

      // Ajout du nom du destinataire
      firstPage.drawText(data.recipient, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(data.recipient, 24, helveticaBold),
        y: height / 2 - 5,
        size: 24,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Ajout du titre de la formation
      firstPage.drawText(data.title, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(data.title, 24, helveticaBold) +
          130,
        y: height / 2 - 110,
        size: 18,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      // Ajout des dates de formation
      const dateText = `Du ${data.dateDebut} au ${data.dateFin}`;
      firstPage.drawText(dateText, {
        x:
          width / 2 -
          this.calculateCenteredTextPosition(dateText, 24, helveticaBold) +
          100,
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
        y: height / 2 - 200,
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
      console.error('Erreur lors de la génération du PDF français:', error);
      throw error;
    }
  }

  // Calcul de la position pour centrer le texte
  private calculateCenteredTextPosition(
    text: string,
    fontSize: number,
    font: any
  ): number {
    // Estimation simple - à ajuster selon la police
    return (text.length * fontSize * 0.5) / 2;
  }

  // Mise à jour du statut d'un certificat
  // Variables pour la popup

  updateCertificatStatus(
    certificatId: number | undefined,
    newStatus: CertificatStatus
  ): void {
    if (!certificatId) {
      this.showError('ID de certificat manquant.');
      return;
    }

    this.confirmationMessage = `Êtes-vous sûr de vouloir ${
      newStatus === CertificatStatus.VALIDE ? 'valider' : 'rejeter'
    } ce certificat ?`;
    this.pendingStatusUpdate = { id: certificatId, status: newStatus };
    this.showConfirmationPopup = true;
  }

  sendNotificationByEmail(
    utilisateur: UtilisateursDto | undefined,
    certification: CertificatsDto
  ): void {
    if (!utilisateur) {
      this.showError("ID d'utilisateur manquant pour la notification.");
      return;
    }

    if (!certification.id) {
      this.showError(
        'ID de certificat manquant pour la mise à jour du statut.'
      );
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Étape 1 : Mettre à jour le statut du certificat
    this.apiService
      .updateCertificatStatus({
        idCertificat: certification.id,
        nouveauStatut: CertificatStatus.VALIDE,
      })
      .pipe(
        takeUntil(this.destroy$),

        // Étape 2 : Envoyer l'email
        switchMap(() => {
          const sujet = `Votre certificat est prêt`;
          const contenu = `Bonjour ${utilisateur.prenom},\nVotre certificat pour la formation a été validé et est désormais disponible.`;

          // Appel de l'API pour envoyer l'email
          return this.apiService.sendEmail(
            utilisateur.email || '',
            sujet,
            contenu
          );
        }),

        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (): void => {
          // Mettre à jour le statut localement
          const certIndex = this.certifications.findIndex(
            (item) => item.certification.id === certification.id
          );
          if (certIndex !== -1) {
            this.certifications[certIndex].certification.statut =
              CertificatStatus.VALIDE;
          }

          this.showSuccess(
            'Certificat validé et notification envoyée avec succès.'
          );
          this.applyFilters(); // Rafraîchir la liste filtrée
        },
        error: (err: { message: string }): void => {
          console.error('Erreur lors de la validation/notification:', err);
          this.showError(`Erreur: ${err.message}`);
        },
      });
  }
  validerEtNotifier(
    utilisateur: Utilisateurs,
    certification: CertificatsDto
  ): void {
    if (utilisateur) {
      // Appel de la première fonction
      this.sendNotificationByEmail(utilisateur, certification);

      // Appel de la deuxième fonction
      this.sendNotification(utilisateur, certification);
    }
  }

  sendNotification(
    utilisateur: UtilisateursDto,
    certification: CertificatsDto
  ): void {
    if (!utilisateur?.id) {
      this.showError("ID d'utilisateur manquant.");
      return;
    }

    if (!certification?.id) {
      this.showError('ID de certificat manquant.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Mise à jour du statut du certificat, puis envoi de la notification
    this.apiService
      .updateCertificatStatus({
        idCertificat: certification.id,
        nouveauStatut: CertificatStatus.VALIDE,
      })
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          const contenu = `Votre certificat pour la formation est désormais validé.`;

          // Appel de la méthode dynamique pour envoyer la notification
          return this.apiService.sendNotification(
            utilisateur.id!, // Utilisateur ID (non-null assertion)
            contenu, // Contenu du message
            'VALIDÉ', // Statut par défaut
            false, // Notification non lue par défaut
            0, // Id par défaut (à ajuster si nécessaire)
            new Date().toISOString(), // Date de création
            new Date().toISOString() // Date d'envoi
          );
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          certification.statut = CertificatStatus.VALIDE;
          this.showSuccess('Certificat validé et notification envoyée.');
          this.applyFilters(); // Rafraîchir la liste filtrée
        },
        error: (err) => {
          console.error('Erreur :', err);
          this.showError('Erreur lors de l’envoi de la notification.');
        },
      });
  }

  confirmAction(): void {
    if (!this.pendingStatusUpdate) {
      this.showError('Aucune action à confirmer.');
      this.showConfirmationPopup = false;
      return;
    }

    const { id, status } = this.pendingStatusUpdate;

    this.apiService
      .updateCertificatStatus({
        idCertificat: id,
        nouveauStatut: status,
      })
      .subscribe({
        next: () => {
          const certIndex = this.certifications.findIndex(
            (item) => item.certification.id === id
          );
          if (certIndex !== -1) {
            this.certifications[certIndex].certification.statut = status;
          }
          this.showSuccess(
            status === CertificatStatus.VALIDE
              ? 'Certificat validé avec succès.'
              : 'Certificat rejeté avec succès.'
          );
          this.applyFilters();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du certificat', error);
          this.showError('Erreur lors de la mise à jour du certificat.');
        },
      });

    this.showConfirmationPopup = false;
    this.pendingStatusUpdate = null;
  }

  cancelAction(): void {
    this.showConfirmationPopup = false;
    this.pendingStatusUpdate = null;
  }

  // Méthodes pratiques pour afficher les messages
  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = null), 3000);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = null), 3000);
  }

  loadInscriptionsSansCertificat(): void {
    this.apiService
      .getInscriptionsNonGenerees()
      .pipe(
        switchMap((inscriptions) => {
          const obs = inscriptions.map((inscription) =>
            this.apiService.getUtilisateurByInscriptionId(inscription.id).pipe(
              catchError(() => of(null)),
              map((utilisateur) => ({
                inscription,
                utilisateur,
              }))
            )
          );
          return forkJoin(obs);
        })
      )
      .subscribe((result) => {
        this.inscriptionsAvecUtilisateurs = result;
      });
  }
}
