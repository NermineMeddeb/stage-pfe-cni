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
  selector: 'app-nouveau-formateur',
  templateUrl: './nouveau-formateur.component.html',
  styleUrls: ['./nouveau-formateur.component.css'],
})
export class NouveauFormateurComponent implements OnInit {
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
      role: [
        { value: 'INTERNE', disabled: false },
        { value: 'EXTERNE', disabled: false },
      ],
      photo: [''],
      etablissement: ['', Validators.required],
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      dateNaissance: ['', Validators.required],
    });
  }

  // Modifiez la méthode loadClientData comme suit :
  // Modifiez la méthode loadClientData pour mieux gérer la photo
  loadClientData(id: number): void {
    this.clientService.findById_3(id).subscribe({
      next: (client: Utilisateurs) => {
        this.originalPassword = client.motDePasse || '';

        if (client.dateNaissance) {
          client.dateNaissance = this.formatDateForInput(client.dateNaissance);
        }

        this.nouveauClientForm.patchValue({
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          telephone: client.telephone,
          'role': client.role,
          photo: client.photo,
          etablissement: client.etablissement,
          cin: client.cin,
          dateNaissance: client.dateNaissance,
          motDePasse: '********', // Placeholder pour le mode édition
        });

        // Gestion améliorée de la photo
        if (client.photo) {
          if (this.isBase64Image(client.photo)) {
            this.photoPreview = client.photo;
          } else if (this.isImageUrl(client.photo)) {
            this.photoPreview = client.photo;
          } else {
            // Si c'est juste un nom de fichier
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

  // Ajoutez ces méthodes utilitaires
  private isBase64Image(str: string): boolean {
    return str.startsWith('data:image');
  }

  private isImageUrl(str: string): boolean {
    return str.startsWith('http://') || str.startsWith('https://');
  }

  // Modifiez onSubmit pour mieux gérer le mot de passe
  onSubmit(): void {
    if (this.nouveauClientForm.invalid) {
      this.showAlertMessage(
        'danger',
        'Veuillez remplir tous les champs requis'
      );
      return;
    }

    const rawValue = this.nouveauClientForm.getRawValue();

    // Créez l'objet exactement comme dans votre test Swagger réussi
    const clientData = {
      id: this.isUpdateMode ? this.clientId : 0,
      nom: rawValue.nom,
      prenom: rawValue.prenom,
      email: rawValue.email,
      telephone: rawValue.telephone,
      'role': rawValue.role,
      photo: rawValue.photo || '',
      etablissement: rawValue.etablissement,
      cin: rawValue.cin,
      dateNaissance: this.formatDate(rawValue.dateNaissance),
      motDePasse:
        this.isUpdateMode && rawValue.motDePasse === '********'
          ? this.originalPassword
          : rawValue.motDePasse,
    };

    // Debug: Vérifiez que les données correspondent à ce qui fonctionne dans Swagger
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
            ? 'Formteur mis à jour avec succès'
            : 'Formteur ajouté avec succès'
        );
        this.router.navigate(['dashboard/formateurs']);
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

  // Method to handle photo upload
  private uploadPhoto(clientId: number): void {
    if (!this.photoFile) return;

    const formData = new FormData();
    formData.append('file', this.photoFile);
    formData.append('clientId', clientId.toString());

    // Implement photo upload if API supports it
    // this.clientService.uploadPhoto(formData).subscribe({
    //   next: () => console.log('Photo uploaded successfully'),
    //   error: (error) => console.error('Error uploading photo:', error)
    // });
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

      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(this.photoFile);

      // Store only the filename in the form
      this.nouveauClientForm.patchValue({
        photo: this.photoFile.name,
      });
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
