import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  selector: 'app-details-supplimentaire-client',
  templateUrl: './details-supplimentaire-client.component.html',
  styleUrls: ['./details-supplimentaire-client.component.css'],
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
export class DetailsSupplimentaireClientComponent implements OnInit, OnDestroy {
  // State management
  private destroy$ = new Subject<void>();
  private refreshData$ = new BehaviorSubject<void>(undefined);
  private clientId = 0;

  // Data streams
  client$!: Observable<ClientDetailsDto | null>;
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientServices: ApiService,
    private cdr: ChangeDetectorRef,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Détails client | CNI Platform');

    // Get client ID from route params
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        map((params) => {
          const id = parseInt(params['id'], 10);
          if (isNaN(id)) {
            throw new Error('ID de client invalide');
          }
          return id;
        })
      )
      .subscribe({
        next: (id) => {
          this.clientId = id;
          this.refreshData$.next();
        },
        error: (err) => {
          this.error$.next("L'ID de client spécifié est invalide.");
          this.cdr.markForCheck();
        },
      });

    // Setup data stream
    this.setupDataStream();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDataStream(): void {
    this.client$ = this.refreshData$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(() => {
        if (!this.clientId) {
          return of(null);
        }

        return this.clientServices.findById_3(this.clientId).pipe(
          map((etudiant) => {
            // Transform to ClientDetailsDto with sample data
            // In a real app, you would get this data from your API
            return {
              ...(etudiant || {}),
              status: 'active', // Sample status
              dateCreation: new Date().toISOString(), // Sample date
              derniereConnexion: new Date().toISOString(),
              commentaires: '',
            } as ClientDetailsDto;
          }),
          catchError((error) => {
            console.error('Error fetching client details:', error);
            this.error$.next(
              'Erreur lors du chargement des détails du client.'
            );
            return of(null);
          })
        );
      }),
      tap(() => {
        this.loading$.next(false);
        this.error$.next(null);
      }),
      shareReplay(1)
    );
  }

  refreshData(): void {
    this.refreshData$.next();
  }

  goBack(): void {
    this.router.navigate(['/dashboard/clients']);
  }

  onEdit(clientId: number | undefined): void {
    if (clientId) {
      this.router.navigate(['/dashboard/clients/nouveau-client', clientId]);
    }
  }

  onDelete(clientId: number | undefined): void {
    if (!clientId) return;

    Swal.fire({
      title: 'Supprimer le client ?',
      text: 'Êtes-vous sûr de vouloir supprimer ce client ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading$.next(true);

        this.clientServices
          .delete_3(clientId)
          .pipe(finalize(() => this.loading$.next(false)))
          .subscribe({
            next: () => {
              Swal.fire('Supprimé !', 'Le client a été supprimé.', 'success');
              this.router.navigate(['/dashboard/clients']);
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

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Inconnu';

    const statusMap: Record<string, string> = {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente',
    };

    return statusMap[status] || status;
  }

  getRoleLabel(role: string | undefined): string {
    if (!role) return 'Inconnu';

    const roleMap: Record<string, string> = {
      EXTERNE: 'Externe',
      INTERNE: 'Interne',
      ETUDIANT: 'Étudiant',
      ADMIN: 'Administrateur',
      EMPLOYEE: 'Employé',
    };

    return roleMap[role] || role;
  }
}
