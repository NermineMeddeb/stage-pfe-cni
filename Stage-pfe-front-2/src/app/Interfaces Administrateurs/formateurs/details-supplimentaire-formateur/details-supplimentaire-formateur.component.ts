// details-supplimentaire-formateur.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

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

export interface ClientDetailsDto extends UtilisateursDto {
  status?: 'active' | 'inactive' | 'pending';
  dateCreation?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  derniereConnexion?: string;
  commentaires?: string;
}

@Component({
  selector: 'app-details-supplimentaire-formateur',
  templateUrl: './details-supplimentaire-formateur.component.html',
  styleUrls: ['./details-supplimentaire-formateur.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate(
          '200ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ transform: 'translateY(-10px)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class DetailsSupplimentaireFormateurComponent
  implements OnInit, OnDestroy
{
  @Input() clientId!: number;
  @Output() suppressionResult = new EventEmitter<{
    success: boolean;
    message: string;
  }>();

  client$!: Observable<ClientDetailsDto>;
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Détails du formateur');

    // Si clientId n'est pas fourni en input, essayer de le récupérer depuis l'URL
    if (!this.clientId) {
      this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.clientId = +id;
          this.loadClientData();
        } else {
          this.error$.next('ID du formateur non spécifié');
          this.loading$.next(false);
        }
      });
    } else {
      this.loadClientData();
    }
  }

  loadClientData(): void {
    this.loading$.next(true);
    this.error$.next(null);

    this.client$ = this.apiService.findById_3(this.clientId).pipe(
      map((response) => this.mapToClientDetails(response)),
      tap((client) => {
        this.titleService.setTitle(`Formateur: ${client.prenom} ${client.nom}`);
      }),
      catchError((error) => {
        console.error(
          'Erreur lors du chargement des données du formateur:',
          error
        );
        this.error$.next(
          'Impossible de charger les détails du formateur. Veuillez réessayer.'
        );
        return throwError(() => error);
      }),
      finalize(() => {
        this.loading$.next(false);
        this.cdr.markForCheck();
      }),
      shareReplay(1)
    );
  }

  private mapToClientDetails(data: any): ClientDetailsDto {
    // Mapper les données de l'API au modèle ClientDetailsDto
    return {
      ...data,
      status: data.actif ? 'active' : 'inactive',
      dateCreation: data.dateCreation || new Date().toISOString(),
      commentaires: data.commentaires || '',
    };
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Inconnu';

    const statusMap: { [key: string]: string } = {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente',
    };

    return statusMap[status] || 'Inconnu';
  }

  getRoleLabel(role: string | undefined): string {
    if (!role) return 'Non défini';

    const roleMap: { [key: string]: string } = {
      formateur: 'Formateur',
      admin: 'Administrateur',
      etudiant: 'Étudiant',
    };

    return roleMap[role] || role;
  }

  refreshData(): void {
    this.loadClientData();
  }

  goBack(): void {
    this.router.navigate(['/dashboard/formateurs']);
  }

  onEdit(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/dashboard/formateurs', id]);
    } else {
      this.error$.next('ID du formateur non trouvé');
    }
  }

  onDelete(clientId: number | undefined): void {
    if (!clientId) return;

    Swal.fire({
      title: 'Supprimer le formateur?',
      text: 'Êtes-vous sûr de vouloir supprimer ce formateur?',
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
          .delete_3(clientId)
          .pipe(finalize(() => this.loading$.next(false)))
          .subscribe({
            next: () => {
              Swal.fire('Supprimé !', 'Le formateura été supprimé.', 'success');
              this.router.navigate(['/dashboard/formateurs']);
            },
            error: (error) => {
              console.error('Erreur :', error);
              Swal.fire(
                'Erreur',
                'Échec de la suppression du client.',
                'error'
              );
            },
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
