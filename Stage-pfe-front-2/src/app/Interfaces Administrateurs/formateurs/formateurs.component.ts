import { Utilisateurs } from 'src/cni-api/src/models';
import Swal from 'sweetalert2';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject, BehaviorSubject, of, throwError } from 'rxjs';
import {
  takeUntil,
  switchMap,
  map,
  catchError,
  tap,
  finalize,
  shareReplay,
} from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { UtilisateursDto } from 'src/cni-api/src/models';
import { animate, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-formateurs',
  templateUrl: './formateurs.component.html',
  styleUrls: ['./formateurs.component.css'], // Changed to scss
})
export class FormateursComponent implements OnInit {
  formateurs: Utilisateurs[] = [];
  filteredformateurs: Utilisateurs[] = [];
  loading = true;
  errorMsg = '';
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadFormateurs();
  }

  loadFormateurs(): void {
    this.loading = true;
    this.apiService.findFormateur().subscribe({
      next: (data: Utilisateurs[]) => {
        // Filter only formateurs
        this.formateurs = data.filter(
          (user) => user.role === 'INTERNE' || user.role === 'EXTERNE'
        );
        this.filteredformateurs = [...this.formateurs];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading formateurs:', error);
        this.errorMsg =
          'Impossible de charger la liste des formateurs. Veuillez réessayer plus tard.';
        this.loading = false;
      },
    });
  }

  onSearch(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredformateurs = [...this.formateurs];
      return;
    }

    searchTerm = searchTerm.toLowerCase();
    this.filteredformateurs = this.formateurs.filter(
      (formateur) =>
        formateur.nom?.toLowerCase().includes(searchTerm) ||
        formateur.prenom?.toLowerCase().includes(searchTerm) ||
        formateur.email?.toLowerCase().includes(searchTerm) ||
        formateur.cin?.toLowerCase().includes(searchTerm) ||
        formateur.role?.toLowerCase().includes(searchTerm)
    );
  }

  handleSuppression(event: { success: boolean; message: string }): void {
    if (event.success) {
      this.loadFormateurs(); // Reload the list after successful deletion
    } else {
      this.errorMsg = event.message;
    }
  }

  editformateur(id: number): void {
    this.router.navigate(['/dashboard/nouveau-formateur', id]);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/dashboard/formateurs/details-formateurs/', id]);
  }

  onDelete(formateurId: number | undefined): void {
    if (!formateurId) return;

    Swal.fire({
      title: 'Supprimer le formateur ?',
      text: 'Êtes-vous sûr de vouloir supprimer ce formateur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading$.next(true);

        this.apiService
          .delete_3(formateurId)
          .pipe(finalize(() => this.loading$.next(false)))
          .subscribe({
            next: () => {
              Swal.fire('Supprimé !', 'Le formateur a été supprimé.', 'success');
              this.router.navigate(['/dashboard/formateurs']);
            },
            error: (error) => {
              console.error('Erreur :', error);
              Swal.fire(
                'Erreur',
                'Échec de la suppression du formateur.',
                'error'
              );
            },
          });
      }
    });
  }
}
