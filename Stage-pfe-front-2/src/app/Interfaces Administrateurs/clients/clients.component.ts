import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';  
import Swal from 'sweetalert2';
import {
  Subject,
  Observable,
  BehaviorSubject,
  combineLatest,
  of,
  throwError,
  forkJoin,
  fromEvent,
} from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  catchError,
  tap,
  filter,
  startWith,
  finalize,
  take,
  shareReplay,
} from 'rxjs/operators';
import { UtilisateursDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';

export interface StudentFilter {
  searchTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  status?: string;
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
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
export class ClientsComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // State management
  private destroy$ = new Subject<void>();
  private refreshData$ = new BehaviorSubject<void>(undefined);

  // Filtering and sorting
  filterForm!: FormGroup;
  private filterSubject = new BehaviorSubject<StudentFilter>({
    searchTerm: '',
    sortBy: 'nom',
    sortDirection: 'asc',
    page: 1,
    pageSize: 10,
  });
  filter$ = this.filterSubject.asObservable();

  // Data streams
  students$!: Observable<UtilisateursDto[]>;
  filteredStudents$!: Observable<UtilisateursDto[]>;
  paginatedStudents$!: Observable<UtilisateursDto[]>;
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  totalItems$ = new BehaviorSubject<number>(0);

  // View properties
  selectedStudents: Set<number> = new Set();
  isAllSelected = false;
  isFilterExpanded = false;
  readonly filterOptions = {
    sortFields: [
      { value: 'nom', label: 'Nom' },
      { value: 'prenom', label: 'Prénom' },
      { value: 'email', label: 'Email' },
    ],
  };

  constructor(
    private router: Router,
    private clientServices: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Gestion des clients | CNI Platform');

    // Initialize filter form
    this.initFilterForm();

    // Setup data streams
    this.setupDataStreams();

    // Initial data load
    this.refreshData$.next();

    // Setup keyboard shortcuts
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      searchTerm: [''],
      sortBy: ['nom'],
      sortDirection: ['asc'],
      status: [''],
      page: [1],
      pageSize: [10],
    });

    // Subscribe to form changes
    this.filterForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filterSubject.next(filters);
      });
  }

  private setupDataStreams(): void {
    // Main data stream
    this.students$ = this.refreshData$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(() =>
        this.clientServices.findEtudiants().pipe(
          catchError((error) => {
            console.error('Error fetching students:', error);
            return throwError(() => error);
          })
        )
      ),
      tap((students) => {
        this.totalItems$.next(students.length);
        this.loading$.next(false);
        this.error$.next(null);
      }),
      shareReplay(1)
    );

    // Filtered data stream
    this.filteredStudents$ = combineLatest([this.students$, this.filter$]).pipe(
      map(([students, filter]) => this.applyFilters(students, filter)),
      tap((filtered) => this.totalItems$.next(filtered.length))
    );

    // Paginated data stream
    this.paginatedStudents$ = combineLatest([
      this.filteredStudents$,
      this.filter$,
    ]).pipe(
      map(([filtered, filter]) => this.applyPagination(filtered, filter))
    );
  }

  private applyFilters(
    students: UtilisateursDto[],
    filter: StudentFilter
  ): UtilisateursDto[] {
    let result = [...students];

    // Apply search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      result = result.filter(
        (student) =>
          student.nom?.toLowerCase().includes(searchLower) ||
          student.prenom?.toLowerCase().includes(searchLower) ||
          student.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (filter.sortBy) {
      result.sort((a, b) => {
        const aValue = a[filter.sortBy as keyof UtilisateursDto] || '';
        const bValue = b[filter.sortBy as keyof UtilisateursDto] || '';

        const comparison =
          typeof aValue === 'string'
            ? aValue.localeCompare(bValue as string)
            : (aValue as number) - (bValue as number);

        return filter.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }

  private applyPagination(
    students: UtilisateursDto[],
    filter: StudentFilter
  ): UtilisateursDto[] {
    const startIndex = (filter.page - 1) * filter.pageSize;
    return students.slice(startIndex, startIndex + filter.pageSize);
  }

  // Public interface methods
  refreshData(): void {
    this.refreshData$.next();
  }

  onSearch(term: string): void {
    this.filterForm.patchValue({ searchTerm: term, page: 1 });
  }

  onPageChange(page: number): void {
    this.filterForm.patchValue({ page });
  }

  onPageSizeChange(pageSize: number): void {
    this.filterForm.patchValue({ pageSize, page: 1 });
  }

  onSortChange(sortBy: string): void {
    const currentSortBy = this.filterForm.get('sortBy')?.value;
    const currentDirection = this.filterForm.get('sortDirection')?.value;

    // If clicking the same column, toggle direction
    const sortDirection =
      currentSortBy === sortBy && currentDirection === 'asc' ? 'desc' : 'asc';

    this.filterForm.patchValue({ sortBy, sortDirection });
  }

  NouveauClient(): void {
    this.router.navigate(['dashboard/clients/nouveau-client']);
  }

  handleSuppression(event: 'success' | string): void {
    if (event === 'success') {
      this.refreshData();
    } else {
      this.error$.next(event);
      setTimeout(() => this.error$.next(null), 5000);
    }
  }

  onToggleSelection(studentId: number): void {
    if (this.selectedStudents.has(studentId)) {
      this.selectedStudents.delete(studentId);
    } else {
      this.selectedStudents.add(studentId);
    }

    this.cdr.markForCheck();
  }

  onToggleSelectAll(students: UtilisateursDto[]): void {
    if (this.isAllSelected) {
      this.selectedStudents.clear();
    } else {
      students.forEach((student) => {
        if (student.id) {
          this.selectedStudents.add(student.id);
        }
      });
    }

    this.isAllSelected = !this.isAllSelected;
    this.cdr.markForCheck();
  }


  
  onBulkDelete(): void {
    if (this.selectedStudents.size === 0) return;
  
    Swal.fire({
      title: 'Suppression multiple',
      text: `Êtes-vous sûr de vouloir supprimer ${this.selectedStudents.size} étudiants ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading$.next(true);
  
        const studentIdsToDelete = Array.from(this.selectedStudents);
  
        const deleteObservables = studentIdsToDelete.map((id) =>
          this.clientServices.delete_3(id).pipe(
            catchError((error) => {
              console.error(`Erreur suppression étudiant ${id}:`, error);
              return of(false); // Échec
            }),
            map((result) => ({ id, success: result !== false }))
          )
        );
  
        forkJoin(deleteObservables)
          .pipe(finalize(() => this.loading$.next(false)))
          .subscribe((results) => {
            const successCount = results.filter((r) => r.success).length;
            const failCount = results.length - successCount;
  
            if (successCount > 0) {
              Swal.fire(
                'Succès',
                `${successCount} étudiant(s) supprimé(s) avec succès.`,
                'success'
              );
            }
  
            if (failCount > 0) {
              Swal.fire(
                'Erreur',
                `${failCount} suppression(s) ont échoué.`,
                'error'
              );
            }
  
            this.refreshData();
            this.selectedStudents.clear();
            this.isAllSelected = false;
          });
      }
    });
  }
  

  exportToCSV(): void {
    this.filteredStudents$.pipe(take(1)).subscribe((students) => {
      // Implement CSV export logic
      const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Status'];
      const csvContent = students.map((student) =>
        [student.id, student.nom, student.prenom, student.email].join(',')
      );

      // Create CSV content
      const csv = [headers.join(','), ...csvContent].join('\n');

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `etudiants_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  toggleFilterPanel(): void {
    this.isFilterExpanded = !this.isFilterExpanded;
  }
  gotodetailsclient(student: UtilisateursDto): void {
    const url = `dashboard/clients/details-supplimentaire-client/${student.id}`;
    console.log('Navigating to:', url);
    this.router.navigate([url]);
  }
}
