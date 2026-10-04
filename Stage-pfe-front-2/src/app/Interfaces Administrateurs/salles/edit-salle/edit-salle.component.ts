import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SallesDto } from 'src/cni-api/src/models';

@Component({
  selector: 'app-edit-salle',
  templateUrl: './edit-salle.component.html',
  styleUrls: ['./edit-salle.component.css'],
})
export class EditSalleComponent implements OnInit {
  salleForm!: FormGroup;
  isEditMode = false;
  salleId: number | undefined;
  statusOptions = ['DISPONIBLE', 'OCCUPE', 'EN_MAINTENANCE'];
  loading = false;

  // IMPORTANT: API URLs
  private apiBaseUrl = 'http://localhost:8080';

  // Popup properties
  showPopup = false;
  popupType = 'info';
  popupTitle = '';
  popupMessage = '';
  popupTimeout: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Log l'URL de base pour vérification
    console.log('URL API de base utilisée:', this.apiBaseUrl);

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.salleId = +params['id'];
        this.loading = true;

        // URL pour récupérer une salle par ID
        const getUrl = `${this.apiBaseUrl}/api/salles/${this.salleId}`;
        console.log('URL GET utilisée:', getUrl);

        this.http.get<SallesDto>(getUrl).subscribe({
          next: (salle) => {
            console.log('Données reçues:', salle);
            this.salleForm.patchValue({
              nom: salle.nom,
              capacite: salle.capacite,
              equipement: salle.equipement,
              statut: salle.statut,
            });
            this.loading = false;
            this.showNotification(
              'info',
              'Information',
              `Vous modifiez la salle "${salle.nom}"`,
              3000
            );
          },
          error: (error) => {
            console.error('Erreur lors du chargement de la salle:', error);
            this.loading = false;
            this.showNotification(
              'error',
              'Erreur',
              'Impossible de charger les informations de la salle',
              4000
            );
            this.router.navigate(['dashboard/salles']);
          },
        });
      } else {
        this.showNotification(
          'info',
          'Nouvelle salle',
          'Veuillez remplir tous les champs requis',
          3000
        );
      }
    });
  }

  initForm(): void {
    this.salleForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      capacite: ['', [Validators.required, Validators.min(1)]],
      equipement: ['', Validators.required],
      statut: ['DISPONIBLE', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.salleForm.invalid) {
      this.showNotification(
        'warning',
        'Attention',
        'Veuillez corriger les erreurs dans le formulaire',
        4000
      );
      return;
    }

    this.loading = true;

    const salle: SallesDto = {
      nom: this.salleForm.value.nom,
      capacite: Number(this.salleForm.value.capacite),
      equipement: this.salleForm.value.equipement,
      statut: this.salleForm.value.statut,
    };

    if (this.isEditMode && this.salleId) {
      salle.id = this.salleId;
    }

    // Déterminer quelle URL utiliser selon le mode (création ou modification)
    let requestUrl = this.isEditMode
      ? `${this.apiBaseUrl}/api/updateSalle` // URL pour la mise à jour
      : `${this.apiBaseUrl}/api/save`; // URL pour la création

    console.log(
      `URL ${this.isEditMode ? 'PUT' : 'POST'} utilisée:`,
      requestUrl
    );
    console.log('Données à envoyer:', JSON.stringify(salle));

    // Utiliser la méthode HTTP appropriée selon le mode
    const request$ = this.isEditMode
      ? this.http.put<SallesDto>(requestUrl, salle) // PUT pour mise à jour
      : this.http.post<SallesDto>(requestUrl, salle); // POST pour création

    request$.subscribe({
      next: (response) => {
        console.log("Réponse de l'API:", response);
        this.loading = false;
        this.showNotification(
          'success',
          'Succès',
          `La salle "${salle.nom}" a été ${
            this.isEditMode ? 'modifiée' : 'créée'
          } avec succès`,
          3000
        );
        setTimeout(() => this.router.navigate(['dashboard/salles']), 3000);
      },
      error: (error) => {
        console.error(
          `Erreur lors de la ${this.isEditMode ? 'modification' : 'création'}:`,
          error
        );
        this.loading = false;
        this.showNotification(
          'error',
          'Erreur',
          `Erreur lors de la ${
            this.isEditMode ? 'modification' : 'création'
          } de la salle: ${error.message || JSON.stringify(error)}`,
          4000
        );
      },
    });
  }

  goBack(): void {
    this.router.navigate(['dashboard/salles']);
  }

  // Méthodes pour le popup
  showNotification(
    type: string,
    title: string,
    message: string,
    duration: number = 4000
  ): void {
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
    }

    this.popupType = type;
    this.popupTitle = title;
    this.popupMessage = message;
    this.showPopup = true;

    this.popupTimeout = setTimeout(() => {
      this.closePopup();
    }, duration);
  }

  closePopup(): void {
    this.showPopup = false;
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
      this.popupTimeout = null;
    }
  }

  getPopupIcon(): string {
    switch (this.popupType) {
      case 'success':
        return 'icon-success';
      case 'error':
        return 'icon-error';
      case 'warning':
        return 'icon-warning';
      case 'info':
      default:
        return 'icon-info';
    }
  }
}
