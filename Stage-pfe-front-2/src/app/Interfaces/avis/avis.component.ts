import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, tap, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AvisDto,
  FormationsDto,
  SessionsDto,
  UtilisateursDto,
} from 'src/cni-api/src/models';
import { AuthenticationService } from 'src/cni-api/src/services/AuthenticationService';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/cni-api/src/services/user/user.service';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css'],
})
export class AvisComponent implements OnInit {
  appreciationForm!: FormGroup;
  formateurs: UtilisateursDto[] = [];
  showConfirmation: boolean = false;
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  sessionData: SessionsDto | null = null;
  formationData: FormationsDto | null = null;
  currentUser: UtilisateursDto | null = null;
  userData: UtilisateursDto | null = null;
  userId: number | null = null;

  // Options d'évaluation avec emojis
  ratingOptions = [
    { value: 0, emoji: '😞', label: 'Non satisfait' },
    { value: 3, emoji: '😐', label: 'Moyen' },
    { value: 4, emoji: '🙂', label: 'Bien' },
    { value: 5, emoji: '😄', label: 'Très bien' },
  ];

  // Modèle d'appréciation
  appreciation: AvisDto = {
    id: 0,
    sessionsId: 0,
    utilisateursId: 0,
    dateFormation: '',
    lieuFormation: '',
    formateurIds: [],
    evaluationFormateur: 0,
    evaluationEnvironnement: 0,
    evaluationMoyens: 0,
    evaluationFormation: 0,
    noteGlobale: 0,
    nouveauxBesoinFormation: false,
    besoinsFormation: '',
    responsableNom: '',
    responsableTel: '',
    responsableEmail: '',
    suggestions: '',
  };

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Récupération de l'id depuis l'URL
    const sessionId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(sessionId)) {
      this.appreciation.sessionsId = sessionId;
      this.loadSessionData(sessionId);
    } else {
      this.isLoading = false;
    }

    // Récupérer l'utilisateur courant (à adapter selon votre système d'authentification)
    this.getCurrentUser();
    console.log('Utilisateur courant:', this.currentUser);
  }

  initForm(): void {
    this.appreciationForm = this.fb.group({
      intitule: [{ value: '', disabled: true }, Validators.required],
      dateFormation: ['', Validators.required],
      lieuFormation: ['', Validators.required],
      participant: [{ value: '', disabled: this.currentUser !== null }],
      evaluationFormateur: [0, Validators.required],
      evaluationEnvironnement: [0, Validators.required],
      evaluationMoyens: [0, Validators.required],
      evaluationFormation: [0, Validators.required],
      nouveauxBesoinFormation: [''],
      besoinsFormation: [''],
      responsableNom: [''],
      responsableTel: [''],
      responsableEmail: ['', Validators.email],
      suggestions: [''],
    });

    const formateurControls = this.formateurs.map(() => this.fb.control(false));
    this.appreciationForm.setControl(
      'formateurIds',
      this.fb.array(formateurControls)
    );

    this.appreciationForm.valueChanges.subscribe((values) => {
      this.appreciation.formateurIds = this.getSelectedFormateurs();
      this.appreciation.dateFormation = values.dateFormation;
      this.appreciation.lieuFormation = values.lieuFormation;
      this.appreciation.evaluationFormateur = values.evaluationFormateur;
      this.appreciation.evaluationEnvironnement =
        values.evaluationEnvironnement;
      this.appreciation.evaluationMoyens = values.evaluationMoyens;
      this.appreciation.evaluationFormation = values.evaluationFormation;
      this.appreciation.nouveauxBesoinFormation =
        values.nouveauxBesoinFormation;
      this.appreciation.besoinsFormation = values.besoinsFormation;
      this.appreciation.responsableNom = values.responsableNom;
      this.appreciation.responsableTel = values.responsableTel;
      this.appreciation.responsableEmail = values.responsableEmail;
      this.appreciation.suggestions = values.suggestions;
      this.appreciation.noteGlobale = this.calculateGlobalScore();
    });
  }

  /**
   * Charge toutes les données nécessaires pour la session
   */
  loadSessionData(sessionId: number): void {
    this.isLoading = true;

    let sessionData: SessionsDto;

    this.apiService
      .findById_1(sessionId)
      .pipe(
        catchError((error) => {
          console.error(
            'Erreur lors de la récupération des données de la session:',
            error
          );
          this.isLoading = false;
          return throwError(() => error);
        }),
        switchMap((session: SessionsDto) => {
          sessionData = session;
          this.sessionData = session;

          // Charger la formation si elle existe
          const formation$ = session.formationId
            ? this.apiService.findFormationById(session.formationId).pipe(
                catchError((error) => {
                  console.error(
                    'Erreur lors de la récupération des données de la formation:',
                    error
                  );
                  return of(null); // Continue même en cas d'erreur
                }),
                tap((formation: FormationsDto | null) => {
                  if (formation) {
                    this.formationData = formation;
                    this.appreciationForm.patchValue({
                      intitule: formation.titre || '',
                    });
                  }
                })
              )
            : of(null);

          return formation$;
        }),
        switchMap(() => {
          // Charger les formateurs liés à la session
          return this.apiService.getFormateur(sessionData.sessionId).pipe(
            catchError((error) => {
              console.error('Erreur lors du chargement des formateurs:', error);
              return of([]); // Continue même en cas d'erreur
            }),
            tap((formateurs: UtilisateursDto[]) => {
              this.formateurs = formateurs;

              const formateurControls = this.formateurs.map(() =>
                this.fb.control(false)
              );
              this.appreciationForm.setControl(
                'formateurIds',
                this.fb.array(formateurControls)
              );
            })
          );
        }),
        finalize(() => {
          this.isLoading = false;
          this.updateFormWithSessionData();
        })
      )
      .subscribe();
  }

  /**
   * Met à jour le formulaire avec les données de la session
   */
  updateFormWithSessionData(): void {
    if (this.sessionData) {
      // Préparer la date de formation à partir des dates de la session
      const dateDebut = this.sessionData.dateDebut
        ? this.formatDate(this.sessionData.dateDebut)
        : '';

      // Récupérer les informations de la salle si disponible
      if (this.sessionData.salleId) {
        this.apiService
          .findById_4(this.sessionData.salleId)
          .pipe(
            catchError(() => of(null)),
            tap((salle) => {
              if (salle && salle.nom) {
                this.appreciationForm.patchValue({
                  lieuFormation: salle.nom,
                });
              }
            })
          )
          .subscribe();
      }

      const formData = {
        dateFormation: dateDebut,
      };

      this.appreciationForm.patchValue(formData);
    }
  }

  /**
   * Récupère les informations de l'utilisateur courant
   */
  getCurrentUser(): void {
    const user = this.userService.getConnectedUser();
    if (user && user.id) {
      this.userId = user.id;
      this.userData = user;
      this.currentUser = user;

      // Mettre à jour le champ participant avec le nom de l'utilisateur connecté
      if (this.appreciationForm) {
        this.appreciationForm.patchValue({
          participant: user.nom + ' ' + user.prenom,
        });
      }
    } else {
      // Rediriger vers la page de connexion si aucun utilisateur n'est connecté
      this.router.navigate(['/login']);
    }
  }

  setRating(field: string, value: number): void {
    this.appreciationForm.patchValue({ [field]: value });
  }

  calculateGlobalScore(): number {
    const formateur = this.appreciation.evaluationFormateur || 0;
    const environnement = this.appreciation.evaluationEnvironnement || 0;
    const moyens = this.appreciation.evaluationMoyens || 0;
    const formation = this.appreciation.evaluationFormation || 0;

    // Calcul de la note globale sur 20
    return (formateur + environnement + moyens + formation) * 1;
  }

  /**
   * Format une date au format YYYY-MM-DD pour l'input de type date
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return '';
    }
  }

  onSubmit(): void {
    if (this.appreciationForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.appreciationForm.controls).forEach((key) => {
        const control = this.appreciationForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isSubmitting = true;

    // Préparer les données pour l'envoi
    const appreciationData: AvisDto = {
      ...this.appreciation,
      utilisateursId: this.userId || 0,
      noteGlobale: this.calculateGlobalScore(),
      // Make sure formateurId is properly set from the form
      formateurIds: this.getSelectedFormateurs(),
    };

    console.log("Données d'appréciation:", appreciationData);

    // Envoyer les données au serveur
    this.apiService
      .save(appreciationData)
      .pipe(
        tap((response) => {
          console.log('Appréciation enregistrée avec succès:', response);
          this.showConfirmation = true;

          // Envoi de l'email de confirmation
          const sujet = 'Merci pour votre retour sur la formation';
          const contenu =
            'Votre appréciation a bien été enregistrée. Merci pour votre participation.';
          this.apiService
            .sendEmail(this.userData?.email || '', sujet, contenu)
            .subscribe({
              next: () => console.log('Email envoyé.'),
              error: (err) =>
                console.error('Erreur lors de envoi de email :', err),
            });
        }),
        catchError((error) => {
          console.error(
            "Erreur lors de l'enregistrement de l'appréciation:",
            error
          );
          alert(
            "Une erreur est survenue lors de l'enregistrement de votre appréciation. Veuillez réessayer."
          );
          return throwError(() => error);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe();
  }
  getSelectedFormateurs(): number[] {
    return this.appreciationForm.value.formateurIds
      .map((checked: boolean, i: number) =>
        checked ? this.formateurs[i].id : null
      )
      .filter((id: number | null) => id !== null);
  }

  closeConfirmation(): void {
    this.showConfirmation = false;
    this.appreciationForm.reset();
    this.initForm();

    // Recharger les données si une session est définie
    if (this.appreciation.sessionsId) {
      this.loadSessionData(this.appreciation.sessionsId);
    }
  }

  // Handle radio selection for formateur instead of checkboxes
  onFormateurSelect(formateurId: number): void {
    this.appreciationForm.patchValue({
      formateurId: formateurId,
    });
  }
}
