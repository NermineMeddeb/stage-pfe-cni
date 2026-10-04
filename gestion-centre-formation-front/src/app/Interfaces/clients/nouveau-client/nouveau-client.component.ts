import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateursDto, RolesDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';
import { RoleService } from 'src/app/Services/role.service'; 

@Component({
  selector: 'app-nouveau-client',
  templateUrl: './nouveau-client.component.html',
  styleUrls: ['./nouveau-client.component.css'],
})
export class NouveauClientComponent implements OnInit {
  nouveauClientForm: FormGroup;
  roles: RolesDto[] = []; // Liste des rôles disponibles

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private roleservice: RoleService,

  ) {
    this.nouveauClientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      motDePasse: ['', Validators.required],
      photo: [''],
      adresse: [''],
      dateNaissance: [''],
      roles: [[]], // Initialiser avec un tableau vide
    });
  }

  ngOnInit(): void {
    this.loadRoles(); // Charger les rôles disponibles
  }

  // Charger les rôles depuis l'API
  loadRoles(): void {
    this.roleservice.getRoles().subscribe(
      (data) => (this.roles = data),
      (error) => console.error('Erreur lors du chargement des rôles', error)
    );
  }

  onSubmit(): void {
    if (this.nouveauClientForm.valid) {
      const newClient: UtilisateursDto = this.nouveauClientForm.value;
      console.log('Données du formulaire :', newClient);

      this.apiService.save_3(newClient).subscribe(
        (response) => {
          console.log('Client créé avec succès', response);
          this.router.navigate(['/clients']);
        },
        (error) => {
          console.error('Erreur lors de la création du client', error);
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}