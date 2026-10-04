import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/cni-api/src/services';

@Component({
  selector: 'app-nouvelle-session',
  templateUrl: './nouvelle-session.component.html',
  styleUrls: ['./nouvelle-session.component.css'],
})
export class NouvelleSessionComponent implements OnInit {
  formations: any[] = [];
  salles: any[] = [];
  utilisateurs: any[] = [];
  sessionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sessionService: ApiService,
    private formationService: ApiService,
    private salleService: ApiService,
    private utilisateurService: ApiService,
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      capacite: [null, [Validators.required, Validators.min(1)]],
      dateDebut: [null, Validators.required],
      dateFin: [null, Validators.required],
      formationId: [null, Validators.required],
      placesDisponibles: [null, [Validators.required, Validators.min(0)]],
      salleId: [null, Validators.required],
      utilisateurId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadFormations();
    this.loadSalles();
    this.loadUtilisateurs();
  }

  loadFormations(): void {
    this.formationService.findAllFormations().subscribe(
      (data) => this.formations = data,
      (error) => console.error('Erreur lors du chargement des formations', error)
    );
  }

  loadSalles(): void {
    this.salleService.getAllSalles().subscribe(
      (data) => this.salles = data,
      (error) => console.error('Erreur lors du chargement des salles', error)
    );
  }

  loadUtilisateurs(): void {
    this.utilisateurService.findAll_4().subscribe(
      (data) => this.utilisateurs = data,
      (error) => console.error('Erreur lors du chargement des utilisateurs', error)
    );
  }
  onSubmit(): void {
    if (this.sessionForm.valid) {
      console.log("Envoi des données...", this.sessionForm.value);
      this.sessionService.save_1(this.sessionForm.value).subscribe(
        (response) => {
          console.log('Session créée avec succès', response);
          this.router.navigate(['/sessions']);
        },
        (error) => {
          console.error('Erreur lors de la création de la session', error);
          if (error.error) {
            console.log('Détails de l\'erreur :', error.error);
          }
        }
      );
    } else {
      console.error('Le formulaire est invalide', this.sessionForm.errors);
    }
  }
  

  onCancel(): void {
    this.router.navigate(['/sessions']);
  }
}
