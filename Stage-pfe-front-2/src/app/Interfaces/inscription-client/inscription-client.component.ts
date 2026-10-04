import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormationsDto,
  InscriptionDto,
  SessionsDto,
} from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { UserService } from 'src/cni-api/src/services/user/user.service';

@Component({
  selector: 'app-inscription-client',
  templateUrl: './inscription-client.component.html',
  styleUrls: ['./inscription-client.component.css'],
})
export class InscriptionClientComponent implements OnInit {
  inscriptionForm!: FormGroup;
  formation!: FormationsDto;
  sessions: SessionsDto[] = [];
  formationId!: number;
  loading = false;
  submitted = false;
  userId!: number;
  showModal = false; // Contrôle l'affichage du modal

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.formationId = Number(this.route.snapshot.paramMap.get('id'));

    // Récupérer les infos de l'utilisateur connecté
    const user = this.userService.getConnectedUser();
    if (user.id !== undefined) {
      this.userId = user.id;
    } else {
      throw new Error('User ID is undefined');
    }

    // Initialiser le formulaire
    this.inscriptionForm = this.formBuilder.group({
      sessionId: ['', Validators.required],
    });

    // Charger les détails de la formation et ses sessions
    this.loadFormationDetails();
  }

  loadFormationDetails(): void {
    this.loading = true;

    // 1. Appel pour récupérer la formation
    this.apiService.findFormationById(this.formationId).subscribe(
      (data: FormationsDto) => {
        this.formation = data;

        // 2. Ensuite, appel pour récupérer les sessions liées à la formation
        this.apiService
          .findAvailableSessionsByFormationId(this.formationId)
          .subscribe(
            (sessions: SessionsDto[]) => {
              this.sessions = sessions; // ou filtrer ici si besoin
              this.loading = false;
            },
            (error) => {
              console.error('Erreur récupération sessions', error);
              this.loading = false;
            }
          );
      },
      (error) => {
        console.error('Erreur récupération formation', error);
        this.loading = false;
      }
    );
  }

  // Getter pour accéder facilement aux contrôles du formulaire
  get f() {
    return this.inscriptionForm.controls;
  }

  // Helper method to select a session
  selectSession(sessionId: number): void {
    this.inscriptionForm.patchValue({
      sessionId: sessionId,
    });
  }

  // Method to get the selected session object
  getSelectedSession(): SessionsDto | undefined {
    const sessionId = Number(this.f['sessionId'].value);
    return this.sessions.find((s) => s.sessionId === sessionId);
  }

  // Ouvrir le modal simple
  openConfirmationModal(): void {
    this.submitted = true;

    if (this.inscriptionForm.invalid) {
      return;
    }

    // Afficher le modal
    this.showModal = true;

    // Empêcher le scroll du body quand le modal est ouvert
    document.body.style.overflow = 'hidden';
  }

  // Fermer le modal simple
  closeModal(): void {
    this.showModal = false;

    // Réactiver le scroll du body
    document.body.style.overflow = 'auto';
  }

  // Process the final submission after confirmation
 confirmInscription(): void {
  this.loading = true;

  // Récupérer la session sélectionnée
  const sessionId = Number(this.f['sessionId'].value);
  const selectedSession = this.sessions.find(
    (s) => s.sessionId === sessionId
  );

  if (!selectedSession) {
    this.loading = false;
    return;
  }

  // Préparer les valeurs pour le formulaire d'inscription
  const formValues = {
    sessionId: selectedSession.sessionId || 0,
    utilisateurId: this.userId,
    dateInscription: new Date().toISOString().split('T')[0],
    dateDebut: selectedSession.dateDebut || '',
    dateFin: selectedSession.dateFin || '',
    statut: 'En attente',
    certificatGenere: false,
  };

  // Créer l'objet inscription selon le format souhaité
  const inscription: InscriptionDto = {
    id: 0, // Forcer l'ID à 0 pour un nouvel enregistrement
    sessionId: Number(formValues.sessionId),
    utilisateurId: Number(formValues.utilisateurId),
    dateInscription: formValues.dateInscription,
    dateDebut: formValues.dateDebut,
    dateFin: formValues.dateFin,
    statut: formValues.statut,
    certificatGenere: Boolean(formValues.certificatGenere),
  };

  console.log("Tentative d'inscription avec les données:", inscription);

  // Envoyer l'inscription au serveur avec le nouveau format
  this.apiService.saveInscription(inscription).subscribe({
    next: (response: InscriptionDto) => {
      console.log("Inscription réussie:", response);
      
      // Décrémenter le nombre de places disponibles
      if (
        selectedSession &&
        selectedSession.placesDisponibles !== undefined
      ) {
        // Vérifier qu'il reste des places
        if (selectedSession.placesDisponibles > 0) {
          // Mettre à jour les places disponibles
          const updatedSession: SessionsDto = {
            ...selectedSession,
            placesDisponibles: selectedSession.placesDisponibles - 1,
          };

          // Mettre à jour la session
          this.apiService.updatesessions(updatedSession).subscribe({
            next: () => {
              // Fermer le modal
              this.closeModal();

              // Ajouter l'utilisateur à la session
              this.apiService
                .addUserToSession({
                  utilisateurId: this.userId,
                  sessionId: sessionId,
                })
                .subscribe({
                  next: () => {
                    this.loading = false;
                    this.router.navigate(['/etudiant/mes-formations']);
                  },
                  error: (error) => {
                    console.error(
                      "Erreur lors de l'ajout de l'utilisateur à la session",
                      error
                    );
                    this.loading = false;
                  }
                });
            },
            error: (error) => {
              console.error(
                'Erreur lors de la mise à jour de la session',
                error
              );
              this.closeModal();
              this.loading = false;
            }
          });
        } else {
          // Plus de places disponibles
          this.closeModal();
          this.loading = false;
          // Afficher un message d'erreur indiquant qu'il n'y a plus de places
          console.error('Plus de places disponibles pour cette session');
        }
      } else {
        this.closeModal();
        this.loading = false;
        this.router.navigate(['/etudiant/mes-formations']);
      }
    },
    error: (error) => {
      // Fermer le modal en cas d'erreur aussi
      this.closeModal();
      this.loading = false;
      console.error("Erreur lors de l'inscription", error);
      // Ajouter une gestion d'erreur ici (notification toast, message d'erreur, etc.)
    }
  });
}

annuler(): void {
  this.router.navigate(['/etudiant/mes-formations']);
}}