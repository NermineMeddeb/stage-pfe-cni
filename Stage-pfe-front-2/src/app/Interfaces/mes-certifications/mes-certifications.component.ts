import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CertificatsDto, Email } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/cni-api/src/services/user/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mes-certifications',
  templateUrl: './mes-certifications.component.html',
  styleUrls: ['./mes-certifications.component.css'],
})
export class MesCertificationsComponent implements OnInit {
  certifications: CertificatsDto[] = [];
  filteredCertifications: CertificatsDto[] = [];
  filterStatus: string = 'all';
  isLoading: boolean = true;
  searchTerm: string = '';
  error: string | null = null;
  userId: number | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}
  currentUser: any = null;

  ngOnInit(): void {
    this.currentUser = this.userService.getConnectedUser();
    this.userId = this.currentUser?.id ?? null;

    if (this.userId) {
      this.loadCertifications();
    } else {
      this.error =
        'Utilisateur non connecté. Veuillez vous connecter pour voir vos certifications.';
      this.isLoading = false;
    }
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  loadCertifications(): void {
    this.isLoading = true;
    this.error = null;

    this.apiService
      .getCertificatsByUserId(this.userId!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data: CertificatsDto | CertificatsDto[]) => {
          this.certifications = Array.isArray(data) ? data : [data];
          this.applyFilters();
        },
        error: (err) => {
          this.error =
            'Impossible de charger vos certifications. Veuillez réessayer plus tard.';
          console.error('Erreur lors du chargement des certifications', err);
          this.certifications = [];
          this.filteredCertifications = [];
        },
      });
  }

  filterCertifications(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCertifications =
      this.filterStatus === 'all'
        ? [...this.certifications]
        : this.certifications.filter(
            (cert) => cert.statut === this.filterStatus
          );

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      this.filteredCertifications = this.filteredCertifications.filter(
        (cert) =>
          (cert.dateGeneration?.toLowerCase() || '').includes(term) ||
          (cert.numeroSerie?.toLowerCase() || '').includes(term) ||
          (cert.statut?.toLowerCase() || '').includes(term)
      );
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  isExpiringSoon(cert: CertificatsDto): boolean {
    if (!cert.dateGeneration) return false;

    const today = new Date();
    const expiryDate = new Date(cert.dateGeneration);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    return expiryDate > today && expiryDate < threeMonthsFromNow;
  }

  getFullUrl(relativePath: string | undefined): string | null {
    if (!relativePath || relativePath.startsWith('file:///')) {
      console.error('Chemin local ou invalide détecté :', relativePath);
      return null;
    }

    return window.location.origin + '/' + relativePath.replace(/^src\//, '');
  }

  viewCertification(fileUrl: string | undefined): void {
    const fullUrl = this.getFullUrl(fileUrl);
    if (fullUrl) {
      window.open(fullUrl, '_blank');
    } else {
      console.error('URL de certificat non valide.');
    }
  }

  downloadCertification(fileUrl: string | undefined): void {
    const fullUrl = this.getFullUrl(fileUrl);
    if (fullUrl) {
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = 'certificat.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Impossible de télécharger le certificat.');
    }
  }

  printCertification(cert: CertificatsDto): void {
    if (!cert.numeroSerie) return;

    this.apiService.getCertificatByNumeroDeSerie(cert.numeroSerie).subscribe({
      next: (response: any) => {
        if (response instanceof Blob) {
          const fileURL = URL.createObjectURL(response);
          const printWindow = window.open(fileURL, '_blank');

          if (printWindow) {
            printWindow.onload = () => printWindow.print();
          } else {
            alert('Veuillez autoriser les popups pour imprimer le certificat');
          }
        } else {
          alert("Format de certificat invalide pour l'impression");
        }
      },
      error: (err) => {
        console.error("Erreur d'impression du certificat", err);
        alert("Impossible d'imprimer le certificat.");
      },
    });
  }

  shareCertification(cert: CertificatsDto): void {
    /* if (!cert.numeroSerie || !this.currentUser?.email) {
      alert("Informations manquantes pour l'envoi de l'email.");
      return;
    }

    if (!cert.file_url) {
      alert('Le certificat ne contient pas de fichier valide.');
      return;
    }

    this.apiService.getCertificatByNumeroDeSerie(cert.numeroSerie).subscribe({
      next: () => {
        const fileUrl = cert.file_url;
        if (!fileUrl) {
          throw new Error('Le fichier URL est indéfini.');
        }
        fetch(cert.file_url)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = (reader.result as string).split(',')[1]; // on enlève le header data:

              const payload = {
                destinataire: this.currentUser!.email,
                destinatairesCc: [],
                destinatairesBcc: [],
                sujet: 'Votre certificat',
                contenu: 'Veuillez trouver votre certificat en pièce jointe.',
                estHtml: false,
                pieceJointe: [base64],
              };

              this.apiService.envoyerEmailAvecPieceJointe(payload).subscribe({
                next: (res: string) => alert('Envoyé avec succès'),
                error: (err) => alert("Erreur lors de l'envoi"),
              });
            };
            reader.readAsDataURL(blob);
          });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du certificat', err);
        alert('Impossible de récupérer le certificat à envoyer.');
      },
    }); */
  }
}
