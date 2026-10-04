import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  CertificatsDto,
  InscriptionDto,
  SessionsDto,
  UtilisateursDto,
} from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

// First, create the missing components

@Component({
  selector: 'app-certificats',
  templateUrl: './certificats.component.html',
  styleUrls: ['./certificats.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class CertificatsComponent implements OnInit {
  dataSource = new MatTableDataSource<CertificatsDto>([]);
  displayedColumns: string[] = [
    'numeroSerie',
    'dateGeneration',
    'statut',
    'actions',
  ];
  expandedElement: CertificatsDto | null = null;
  filterForm!: FormGroup; // Using definite assignment assertion
  isLoading = false;
  isAdmin = false;
  utilisateurId!: number; // Using definite assignment assertion
  totalCertificats = 0;
  downloadProgress = 0;
  showDownloadProgress = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Using definite assignment assertion
  @ViewChild(MatSort) sort!: MatSort; // Using definite assignment assertion

  constructor(
    private certificatsService: ApiService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.createFilterForm();

    this.loadCertificats();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createFilterForm() {
    this.filterForm = this.formBuilder.group({
      dateDebut: [''],
      dateFin: [''],
      statut: [''],
      search: [''],
    });

    // Réagir aux changements de filtres
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  loadCertificats() {
    this.isLoading = true;

    // Si admin, récupérer tous les certificats, sinon seulement ceux de l'utilisateur
    const observable = this.isAdmin
      ? this.certificatsService.getAllCertificats()
      : this.certificatsService.getCertificatById(this.utilisateurId);

    // Fix the subscribe syntax by using a type assertion
    (observable as Observable<CertificatsDto[]>).subscribe({
      next: (certificats: CertificatsDto[]) => {
        this.dataSource.data = certificats;
        this.totalCertificats = certificats.length;
        this.isLoading = false;
      },
      error: (error: any) => {
        // Added type annotation
        this.isLoading = false;
      },
    });
  }

  applyFilter() {
    const searchControl = this.filterForm.get('search');
    const filterValue = searchControl ? searchControl.value : '';

    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Filtres supplémentaires
    this.dataSource.filterPredicate = (
      data: CertificatsDto,
      filter: string
    ) => {
      const dateDebutControl = this.filterForm.get('dateDebut');
      const dateFinControl = this.filterForm.get('dateFin');
      const statutControl = this.filterForm.get('statut');

      const dateDebut = dateDebutControl ? dateDebutControl.value : null;
      const dateFin = dateFinControl ? dateFinControl.value : null;
      const statut = statutControl ? statutControl.value : null;

      let match = true;

      // Vérifie le filtre textuel
      if (filter) {
        match =
          match &&
          (data.numeroSerie?.toLowerCase().includes(filter) ||
            false ||
            data.statut?.toLowerCase().includes(filter) ||
            false);
      }

      // Vérifie le filtre de date début
      if (dateDebut && data.dateGeneration) {
        match = match && new Date(data.dateGeneration) >= new Date(dateDebut);
      }

      // Vérifie le filtre de date fin
      if (dateFin && data.dateGeneration) {
        match = match && new Date(data.dateGeneration) <= new Date(dateFin);
      }

      // Vérifie le filtre de statut
      if (statut) {
        match = match && data.statut === statut;
      }

      return match;
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters() {
    this.filterForm.reset();
    this.dataSource.filter = '';
  }

  downloadCertificat(certificat: CertificatsDto) {
    this.showDownloadProgress = true;

    // Simuler progression du téléchargement
    const progressInterval = setInterval(() => {
      this.downloadProgress += 10;
      if (this.downloadProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          this.showDownloadProgress = false;
          this.downloadProgress = 0;
        }, 500);
      }
    }, 200);

    // Make sure your service has this method
  }

  viewCertificatDetails(certificat: CertificatsDto) {}

  deleteCertificat(certificat: CertificatsDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmation de suppression',
        message: `Êtes-vous sûr de vouloir supprimer le certificat ${certificat.numeroSerie} ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.certificatsService
          .supprimerCertificat(certificat.inscriptionId)
          .subscribe({
            next: () => {
              this.loadCertificats();
            },
            error: (error: any) => {
            },
          });
      }
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'VALIDE':
        return 'statut-valide';
      case 'EN_ATTENTE':
        return 'statut-attente';
      case 'EXPIRE':
        return 'statut-expire';
      default:
        return '';
    }
  }
}
