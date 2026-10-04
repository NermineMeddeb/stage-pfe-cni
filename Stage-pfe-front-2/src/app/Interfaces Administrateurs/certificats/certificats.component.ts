import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  CertificatsDto,
  InscriptionDto,
  UtilisateursDto,
} from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';

interface CertificationDetails {
  certification: CertificatsDto;
  inscription?: InscriptionDto;
  utilisateur?: UtilisateursDto;
}

@Component({
  selector: 'app-certificats',
  templateUrl: './certificats.component.html',
  styleUrls: ['./certificats.component.css'],
})
export class CertificatsComponent implements OnInit {
  certifications: CertificationDetails[] = [];
  filteredCertifications: CertificationDetails[] = [];
  searchControl = new FormControl('');
  isLoading = false;
  error: string | null = null;
  selectedStatut: string = '';
  dateDebut: string = '';
  dateFin: string = '';

  constructor(private http: HttpClient, private apiservice: ApiService) {}

  ngOnInit(): void {
    this.loadCertifications();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.filterCertifications(value || '');
      });
  }

  loadCertifications(): void {
    this.isLoading = true;
    this.error = null;

    this.apiservice
      .getAllCertificats()
      .pipe(
        switchMap((certifications) => {
          if (!certifications.length) {
            return of([]); // Si aucune certification, retourne un tableau vide immédiatement
          }

          const requests = certifications.map((cert) => {
            return this.apiservice.getInscriptionById(cert.inscriptionId).pipe(
              catchError(() => of(null)), // En cas d'erreur, retourne null
              switchMap((inscription) => {
                if (!inscription) {
                  return of({ certification: cert }); // Retourne seulement la certification si l'inscription est absente
                }

                // Vérification que inscription.id existe avant utilisation
                const inscriptionId = (inscription as any)?.id;
                if (inscriptionId === undefined) {
                  console.error("ID d'inscription manquant", inscription);
                  return of({ certification: cert, inscription });
                }

                return this.apiservice
                  .getUtilisateurByInscriptionId(inscriptionId)
                  .pipe(
                    catchError(() => of(null)), // En cas d'erreur, retourne null
                    map((utilisateur) => ({
                      certification: cert,
                      inscription: inscription,
                      utilisateur: utilisateur,
                    }))
                  );
              })
            );
          });

          return forkJoin(requests); // Exécute toutes les requêtes en parallèle
        })
      )
      .subscribe({
        next: (certificationsDetails) => {
          this.certifications = certificationsDetails;
          this.filteredCertifications = [...this.certifications];
          this.isLoading = false;
        },
        error: (err) => {
          this.error =
            'Erreur lors du chargement des certifications: ' + err.message;
          this.isLoading = false;
        },
      });
  }

  filterCertifications(searchTerm: string): void {
    const hasFilters = !!(
      searchTerm ||
      this.selectedStatut ||
      this.dateDebut ||
      this.dateFin
    );

    if (!hasFilters) {
      this.filteredCertifications = [...this.certifications];
      return;
    }

    searchTerm = searchTerm.toLowerCase().trim();

    this.filteredCertifications = this.certifications.filter((item) => {
      // Filtrer par terme de recherche (numéro de série, nom, prénom ou email)
      const matchesSearch =
        !searchTerm ||
        item.certification.numeroSerie?.toLowerCase().includes(searchTerm) ||
        item.utilisateur?.nom?.toLowerCase().includes(searchTerm) ||
        item.utilisateur?.prenom?.toLowerCase().includes(searchTerm) ||
        item.utilisateur?.email?.toLowerCase().includes(searchTerm);

      // Filtrer par statut
      const matchesStatut =
        !this.selectedStatut ||
        item.certification.statut === this.selectedStatut;

      // Filtrer par date de début
      const matchesDateDebut =
        !this.dateDebut ||
        (item.certification.dateGeneration &&
          new Date(item.certification.dateGeneration) >=
            new Date(this.dateDebut));

      // Filtrer par date de fin
      const matchesDateFin =
        !this.dateFin ||
        (item.certification.dateGeneration &&
          new Date(item.certification.dateGeneration) <=
            new Date(this.dateFin));

      return (
        matchesSearch && matchesStatut && matchesDateDebut && matchesDateFin
      );
    });
  }

  applyFilters(): void {
    this.filterCertifications(this.searchControl.value || '');
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.selectedStatut = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.filteredCertifications = [...this.certifications];
  }

  getFullUrl(relativePath: string | undefined): string | null {
    if (!relativePath) return null;

    // Vérifie si l'URL contient "file://", et le rejette
    if (relativePath.startsWith('file:///')) {
      console.error('Chemin local détecté :', relativePath);
      return null;
    }

    // Construit l'URL correcte pour Angular
    return window.location.origin + '/' + relativePath.replace(/^src\//, '');
  }

  voirCertificat(fileUrl: string | undefined): void {
    if (!fileUrl) {
      console.error('Aucune URL de certificat disponible.');
      return;
    }

    const fullUrl = this.getFullUrl(fileUrl);
    if (fullUrl) {
      console.log('URL corrigée du certificat :', fullUrl);
      window.open(fullUrl, '_blank');
    }
  }

  telechargerCertificat(fileUrl: string | undefined): void {
    if (!fileUrl) {
      console.error('Aucune URL de certificat disponible.');
      return;
    }

    const fullUrl = this.getFullUrl(fileUrl);
    if (fullUrl) {
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = 'certificat.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  supprimerCertificat(numeroSerie: string | undefined): void {
    if (!numeroSerie) {
      console.error('ID de certificat manquant.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce certificat ?')) {
      this.isLoading = true;
      this.apiservice
        .supprimerCertificatByNumeroDeSerie(numeroSerie)
        .subscribe({
          next: () => {
            // Recharger les certifications après suppression
            this.loadCertifications();
            alert('Certificat supprimé avec succès');
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du certificat', err);
            this.error =
              'Impossible de supprimer le certificat: ' + err.message;
            this.isLoading = false;
          },
        });
    }
  }
}
