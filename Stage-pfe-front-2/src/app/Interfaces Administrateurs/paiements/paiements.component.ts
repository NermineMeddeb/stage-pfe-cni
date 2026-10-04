import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PaiementsDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paiements',
  templateUrl: './paiements.component.html',
  styleUrls: ['./paiements.component.css'],
  providers: [ConfirmationService],
})
export class PaiementsComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  paiements: PaiementsDto[] = [];
  paiementForm: FormGroup;
  selectedPaiement: PaiementsDto | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;
  formations: any[] = [];
  utilisateurs: any[] = [];
  displayDialog = false;
  statuts = ['En attente', 'Payé', 'Annulé', 'Remboursé'];
  modesPaiement = ['Carte bancaire', 'Virement', 'Espèces', 'Chèque', 'PayPal'];

  // Dashboard metrics
  totalPaiements = 0;
  paiementsPaid = 0;
  paiementsPending = 0;
  paiementsCancelled = 0;
  paiementsRefunded = 0;
  totalRevenue = 0;
  profitTotal = 0;
  revenuMoyenParEtudiant = 0;
  revenuMoyenParSession = 0;
  filterValue = '';
  // Popup properties
  showDeleteConfirmation: boolean = false;
  showSuccessPopup: boolean = false;
  showErrorPopup: boolean = false;
  currentPaiements: PaiementsDto | null = null;
  popupMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.paiementForm = this.fb.group({
      id: [null],
      montant: [null, [Validators.required, Validators.min(0)]],
      datePaiement: [new Date(), Validators.required],
      modePaiement: ['', Validators.required],
      statut: ['En attente', Validators.required],
      sessionsId: [null, Validators.required],
      utilisateurId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPaiements();
    this.loadFormations();
    this.loadUtilisateurs();
    this.loadDashboardMetrics();
  }

  loadPaiements() {
    this.loading = true;
    this.apiService
      .findAllPaiements()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (data) => {
          this.paiements = data;
          this.calculateDashboardCounts();
        },
        (error) => {
          console.error('Erreur lors du chargement des paiements', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les paiements',
            life: 3000,
          });
        }
      );
  }

  loadFormations() {
    this.apiService.findAllFormations().subscribe(
      (data) => {
        this.formations = data.map((f) => ({
          label: `${f.titre} (${f.prix}dt)`,
          value: f.id,
        }));
      },
      (error) => {
        console.error('Erreur lors du chargement des formations', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les formations',
          life: 3000,
        });
      }
    );
  }

  loadUtilisateurs() {
    this.apiService.findAll_4().subscribe(
      (data) => {
        this.utilisateurs = data.map((u) => ({
          label: `${u.nom} ${u.prenom} (${u.email})`,
          value: u.id,
        }));
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les utilisateurs',
          life: 3000,
        });
      }
    );
  }

  loadDashboardMetrics() {
    // Get total revenue
    this.apiService.ChiffreAffaireTotal().subscribe(
      (data) => {
        this.totalRevenue = data;
      },
      (error) =>
        console.error("Erreur lors du chargement du chiffre d'affaires", error)
    );

    // Get profit total
    /*   this.apiService.calculerProfitTotal().subscribe(
      (data) => {
        this.profitTotal = data;
      },
      (error) => console.error('Erreur lors du calcul du profit total', error)
    ); */

    // Get average revenue per student
    this.apiService.revenuMoyenParEtudiant().subscribe(
      (data) => {
        this.revenuMoyenParEtudiant = data;
      },
      (error) =>
        console.error(
          'Erreur lors du chargement du revenu moyen par étudiant',
          error
        )
    );

    // Get average revenue per session
    this.apiService.revenuMoyenParSession().subscribe(
      (data) => {
        this.revenuMoyenParSession = data;
      },
      (error) =>
        console.error(
          'Erreur lors du chargement du revenu moyen par session',
          error
        )
    );
  }

  calculateDashboardCounts() {
    this.totalPaiements = this.paiements.length;
    this.paiementsPaid = this.paiements.filter(
      (p) => p.statut === 'CONFIRME'
    ).length;
    this.paiementsPending = this.paiements.filter(
      (p) => p.statut === 'EN_ATTENTE'
    ).length;
    this.paiementsCancelled = this.paiements.filter(
      (p) => p.statut === 'ANNULE'
    ).length;
    this.paiementsRefunded = this.paiements.filter(
      (p) => p.statut === 'Remboursé'
    ).length;
  }

  openNewDialog() {
    this.router.navigate(['/dashboard/nouveau-paiements']);
  }

  editPaiement(paiement: PaiementsDto) {
    this.isEditMode = true;
    this.router.navigate(['/dashboard/nouveau-paiements', paiement.id]);
  }
  chargerPaiements(): void {
    this.loadPaiements();
  }

  // Popup handling methods
  onShowDeleteConfirmation(paiement: PaiementsDto): void {
    console.log(
      'Affichage du popup de confirmation pour le paiement ID:',
      paiement.id
    );
    this.currentPaiements = paiement;
    this.showDeleteConfirmation = true;
  }

  afficherConfirmationSuppression(paiement: PaiementsDto): void {
    this.onShowDeleteConfirmation(paiement);
  }

  onShowSuccessPopup(message: string): void {
    this.popupMessage = message;
    this.showSuccessPopup = true;

    // Auto close and refresh data after success
    setTimeout(() => {
      this.showSuccessPopup = false;
      this.chargerPaiements();
    }, 2000);
  }

  onShowErrorPopup(message: string): void {
    this.popupMessage = message;
    this.showErrorPopup = true;
  }

  confirmerSuppression(): void {
    console.log(
      'Confirmation de suppression pour le paiement:',
      this.currentPaiements?.id
    );
    if (this.currentPaiements && this.currentPaiements.id) {
      this.apiService
        .deletePaiement(this.currentPaiements.id.toString())
        .subscribe({
          next: () => {
            console.log('Suppression réussie');
            this.showDeleteConfirmation = false;
            this.onShowSuccessPopup('Le paiement a été supprimé avec succès.');
            this.chargerPaiements(); // Refresh the data
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.showDeleteConfirmation = false;
            const errorMsg =
              error.error?.error || 'Erreur inconnue lors de la suppression';
            this.onShowErrorPopup(errorMsg);
          },
        });
    } else {
      console.error(
        'Impossible de supprimer: currentPaiements est null ou sans ID'
      );
    }
  }
  // Close popup methods
  fermerConfirmationPopup(): void {
    this.showDeleteConfirmation = false;
    this.currentPaiements = null;
  }

  savePaiement() {
    if (this.paiementForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez remplir correctement tous les champs obligatoires',
        life: 3000,
      });
      return;
    }

    this.submitting = true;
    const paiement: PaiementsDto = this.paiementForm.value;

    if (this.isEditMode && paiement.id) {
      this.apiService
        .updatePaiement(paiement)
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe(
          (updatedPaiement) => {
            const index = this.paiements.findIndex(
              (p) => p.id === updatedPaiement.id
            );
            if (index !== -1) {
              this.paiements[index] = updatedPaiement;
              this.calculateDashboardCounts();
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Paiement mis à jour avec succès',
              life: 3000,
            });
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du paiement', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de mettre à jour le paiement',
              life: 3000,
            });
          }
        );
    } else {
      this.apiService
        .savePaiement(paiement)
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe(
          (newPaiement) => {
            this.paiements.push(newPaiement);
            this.calculateDashboardCounts();
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Paiement ajouté avec succès',
              life: 3000,
            });
          },
          (error) => {
            console.error("Erreur lors de l'ajout du paiement", error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: "Impossible d'ajouter le paiement",
              life: 3000,
            });
          }
        );
    }
  }
  fermerSuccessPopup(): void {
    this.showSuccessPopup = false;
  }

  fermerErrorPopup(): void {
    this.showErrorPopup = false;
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'Payé':
        return 'status-paid';
      case 'En attente':
        return 'status-pending';
      case 'Annulé':
        return 'status-cancelled';
      case 'Remboursé':
        return 'status-refunded';
      default:
        return '';
    }
  }

  getFormationName(sessionId: number): string {
    const formation = this.formations.find((f) => f.value === sessionId);
    return formation ? formation.label : 'Non spécifié';
  }

  getUtilisateurName(utilisateurId: number): string {
    const utilisateur = this.utilisateurs.find(
      (u) => u.value === utilisateurId
    );
    return utilisateur ? utilisateur.label : 'Non spécifié';
  }

  applyFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.filterValue = val;
    this.table.filterGlobal(val, 'contains');
  }

  clearFilter() {
    this.filterValue = '';
    this.table.clear();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  }
}
