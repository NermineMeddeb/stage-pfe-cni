import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilisateurs } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nouveau-client',
  templateUrl: './nouveau-client.component.html',
  styleUrls: ['./nouveau-client.component.css'],
})
export class NouveauClientComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  nouveauClientForm!: FormGroup;
  message!: string;
  messageType!: string;
  photoFile: File | null = null;
  photoPreview: string | ArrayBuffer | null = null;
  showPassword = false;
  isUpdateMode = false;
  clientId: number = 0;
  private routeSubscription!: Subscription;
  private originalPassword: string = '';
  originalPhotoValue: string | null = null; // Pour stocker la valeur originale de la photo
  photoChanged = false; // Indicateur si la photo a été modifiée

  constructor(
    private fb: FormBuilder,
    private clientService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we're in update mode first
    this.routeSubscription = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isUpdateMode = true;
        this.clientId = +params['id'];
      }

      // Initialize form after determining mode
      this.initializeForm();

      if (this.isUpdateMode) {
        this.loadClientData(this.clientId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private initializeForm(): void {
    this.nouveauClientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: [
        '',
        this.isUpdateMode ? [] : [Validators.required, Validators.minLength(6)],
      ],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      role: [{ value: 'ETUDIANT', disabled: true }],
      photo: [''],
      etablissement: ['', Validators.required],
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      dateNaissance: ['', Validators.required],
    });
  }

  loadClientData(id: number): void {
    this.clientService.findById_3(id).subscribe({
      next: (client: Utilisateurs) => {
        this.originalPassword = client.motDePasse || '';

        if (client.dateNaissance) {
          client.dateNaissance = this.formatDateForInput(client.dateNaissance);
        }

        // Stocker la valeur originale de la photo
        this.originalPhotoValue = client.photo || null;
        
        this.nouveauClientForm.patchValue({
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          telephone: client.telephone,
          role: 'ETUDIANT',
          photo: client.photo || '',
          etablissement: client.etablissement,
          cin: client.cin,
          dateNaissance: client.dateNaissance,
          motDePasse: '********', // Placeholder pour le mode édition
        });

        // Gestion de la prévisualisation de la photo
        if (client.photo) {
          if (this.isBase64Image(client.photo)) {
            // Photo déjà en base64
            this.photoPreview = client.photo;
          } else if (this.isImageUrl(client.photo)) {
            // Photo est une URL
            this.photoPreview = client.photo;
          } else {
            // Photo est un nom de fichier relatif
            this.photoPreview = 'assets/' + client.photo;
          }
        }
      },
      error: (error) => {
        console.error('Error loading client data:', error);
        this.showAlertMessage(
          'danger',
          'Failed to load client data: ' + this.extractErrorMessage(error)
        );
      },
    });
  }

  private isBase64Image(str: string): boolean {
    return typeof str === 'string' && str.startsWith('data:image');
  }

  private isImageUrl(str: string): boolean {
    return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://'));
  }

  onSubmit(): void {
    if (this.nouveauClientForm.invalid) {
      this.showAlertMessage(
        'danger',
        'Veuillez remplir tous les champs requis'
      );
      return;
    }

    const rawValue = this.nouveauClientForm.getRawValue();

    // Déterminer la valeur correcte pour la photo
    let photoValue: string = '';
    
    // Si une nouvelle photo a été sélectionnée, utiliser la valeur actuelle du formulaire (base64)
    if (this.photoChanged && this.photoPreview) {
      photoValue = this.photoPreview.toString();
    } 
    // En mode mise à jour et sans nouvelle photo, conserver la valeur originale
    else if (this.isUpdateMode && this.originalPhotoValue) {
      photoValue = this.originalPhotoValue;
    }
    // Sinon utiliser la valeur du formulaire ou chaîne vide
    else {
      photoValue = rawValue.photo || '';
    }

    // Créer l'objet client
    const clientData = {
      id: this.isUpdateMode ? this.clientId : 0,
      nom: rawValue.nom,
      prenom: rawValue.prenom,
      email: rawValue.email,
      telephone: rawValue.telephone,
      role: 'ETUDIANT',
      photo: photoValue,
      etablissement: rawValue.etablissement,
      cin: rawValue.cin,
      dateNaissance: this.formatDate(rawValue.dateNaissance),
      motDePasse:
        this.isUpdateMode && rawValue.motDePasse === '********'
          ? this.originalPassword
          : rawValue.motDePasse,
    };

    console.log('Données envoyées:', JSON.stringify(clientData, null, 2));

    const saveOperation = this.isUpdateMode
      ? this.clientService.updateUtilisateurs(clientData)
      : this.clientService.save_3(clientData);

    saveOperation.subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response);
        this.showAlertMessage(
          'success',
          this.isUpdateMode
            ? 'Client mis à jour avec succès'
            : 'Client ajouté avec succès'
        );
        this.router.navigate(['dashboard/clients']);
      },
      error: (error) => {
        console.error('Erreur complète:', error);
        this.showAlertMessage(
          'danger',
          'Erreur: ' + this.extractErrorMessage(error)
        );
      },
    });
  }

  // Format date for display in the date input
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  // Format date for API submission 'YYYY-MM-DD'
  formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  // Extract meaningful error message
  private extractErrorMessage(error: any): string {
    if (error.error?.message) return error.error.message;
    if (error.message) return error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error';
  }

  showAlertMessage(type: string, text: string) {
    this.messageType = type;
    this.message = text;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.photoFile = input.files[0];
      this.photoChanged = true; // Marquer que la photo a été modifiée

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
        this.nouveauClientForm.patchValue({
          photo: reader.result, // photo encodée en base64
        });
      };
      reader.readAsDataURL(this.photoFile);
    }
  }

  getPasswordStrengthClass(): string {
    const password = this.nouveauClientForm.get('motDePasse')?.value;
    if (!password) return '';

    const strength = this.calculatePasswordStrength(password);
    switch (strength) {
      case 'weak':
        return 'strength-weak';
      case 'medium':
        return 'strength-medium';
      case 'strong':
        return 'strength-strong';
      default:
        return '';
    }
  }

  getPasswordStrengthText(): string {
    const password = this.nouveauClientForm.get('motDePasse')?.value;
    if (!password) return '';

    const strength = this.calculatePasswordStrength(password);
    switch (strength) {
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'strong':
        return 'Strong';
      default:
        return '';
    }
  }

  calculatePasswordStrength(password: string): string {
    if (!password || password.length < 6) return 'weak';

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    if (hasLetters && hasNumbers && hasSpecial) return 'strong';
    if (
      (hasLetters && hasNumbers) ||
      (hasLetters && hasSpecial) ||
      (hasNumbers && hasSpecial)
    )
      return 'medium';
    return 'weak';
  }
}