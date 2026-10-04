import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/cni-api/src/services/api.service';
import { UserService } from 'src/cni-api/src/services/user/user.service';
import { AuthenticationRequest } from 'src/cni-api/src/models/authentication-request';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  // Modèle pour les données utilisateur
  user = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    role: 'ETUDIANT', // Valeur par défaut pour éviter les erreurs de validation
    photo: '',
    etablissement: '',
    cin: '',
    dateNaissance: '',
  };

  // Pour la confirmation du mot de passe
  confirmPassword: string = '';

  // Pour les messages d'erreur
  errorMessage: string = '';

  // Pour afficher le spinner pendant le chargement
  isLoading: boolean = false;

  // Fichier photo sélectionné
  selectedFile: File | null = null;

  // Image preview
  imagePreview: string | null = null;

  constructor(
    private userService: ApiService, 
    private router: Router,
    private connectedUserService: UserService // Injecter le UserService
  ) {}

  ngOnInit(): void {
    // Initialisation du composant, peut être utilisé pour pré-remplir des données
    // ou effectuer d'autres opérations au démarrage
    this.resetForm();
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.user = {
      id: 0,
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      telephone: '',
      role: 'ETUDIANT', // Valeur par défaut
      photo: '',
      etablissement: '',
      cin: '',
      dateNaissance: '',
    };
    this.confirmPassword = '';
    this.errorMessage = '';
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // Méthode pour gérer la sélection d'un fichier photo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)$/)) {
        this.errorMessage =
          'Format de fichier non supporté. Utilisez JPG, PNG ou GIF.';
        return;
      }

      // Vérifier la taille du fichier (max 1MB)
      if (file.size > 1024 * 1024) {
        this.errorMessage = "La taille de l'image ne doit pas dépasser 1MB.";
        return;
      }

      this.selectedFile = file;

      // Conversion en base64 pour l'aperçu
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Prévisualisation de l'image
        this.imagePreview = reader.result as string;

        // Compression de l'image si nécessaire
        this.compressImage(
          reader.result as string,
          800,
          600,
          0.85,
          (compressedBase64) => {
            // Format base64: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...
            const base64Data = compressedBase64.split(',')[1];
            this.user.photo = base64Data;
          }
        );
      };
    }
  }

  // Méthode pour compresser l'image
  compressImage(
    base64: string,
    maxWidth: number,
    maxHeight: number,
    quality: number,
    callback: (compressedBase64: string) => void
  ): void {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculer les nouvelles dimensions en gardant le ratio
      if (width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = width * (maxHeight / height);
        height = maxHeight;
      }

      // Créer un canvas pour redimensionner l'image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // Dessiner l'image redimensionnée
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      // Convertir en base64 avec compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

      callback(compressedBase64);
    };
  }

  // Validation du formulaire
  validateForm(): boolean {
    // Vérification que tous les champs obligatoires sont remplis
    if (
      !this.user.nom ||
      !this.user.prenom ||
      !this.user.email ||
      !this.user.motDePasse ||
      !this.user.telephone ||
      !this.user.cin ||
      !this.user.role ||
      !this.user.dateNaissance
    ) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return false;
    }

    // Validation de l'email avec une expression régulière
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide.';
      return false;
    }

    // Validation du numéro de téléphone
    const phoneRegex = /^[0-9]{8,}$/;
    if (!phoneRegex.test(this.user.telephone)) {
      this.errorMessage =
        'Le numéro de téléphone doit contenir au moins 8 chiffres.';
      return false;
    }

    // Vérification que les mots de passe correspondent
    if (this.user.motDePasse !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return false;
    }

    // Vérification de la complexité du mot de passe
    if (this.user.motDePasse.length < 8) {
      this.errorMessage =
        'Le mot de passe doit contenir au moins 8 caractères.';
      return false;
    }

    // Vérification de la date de naissance
    const birthDate = new Date(this.user.dateNaissance);
    const today = new Date();
    const minAge = 16; // Âge minimum, à ajuster selon vos besoins

    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - minAge);

    if (birthDate > today || birthDate > minDate) {
      this.errorMessage = `Vous devez avoir au moins ${minAge} ans pour vous inscrire.`;
      return false;
    }

    return true;
  }

  // Méthode pour l'inscription de l'utilisateur
  register(): void {
    // Validation du formulaire
    if (!this.validateForm()) {
      // Ajouter une animation de secousse au formulaire en cas d'erreur
      const formContainer = document.querySelector('.my-container');
      formContainer?.classList.add('shake-animation');
      setTimeout(() => {
        formContainer?.classList.remove('shake-animation');
      }, 500);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('User data being sent:', this.user); // Débogage

    // Création d'une copie de l'utilisateur pour l'envoi
    const userToSend = { ...this.user };

    // Limiter la taille de la photo si nécessaire
    if (userToSend.photo && userToSend.photo.length > 500000) {
      // Si plus de ~500KB en base64
      this.errorMessage =
        "L'image est trop volumineuse. Veuillez utiliser une image plus petite.";
      this.isLoading = false;
      return;
    }

    // Appel au service pour enregistrer l'utilisateur
    this.userService.save_3(userToSend).subscribe({
      next: (response) => {
        // Succès de l'inscription
        this.isLoading = false;
        console.log('Inscription réussie', response);

        // Connexion automatique de l'utilisateur
        this.autoLoginAfterRegistration(response);
      },
      error: (error: HttpErrorResponse) => {
        // Gestion des erreurs
        this.isLoading = false;

        if (error.status === 409) {
          this.errorMessage = 'Un compte avec cette adresse email existe déjà.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          console.error("Erreur d'inscription", error);
          this.errorMessage =
            "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.";

          // Afficher plus de détails sur l'erreur pour le débogage
          console.log('Erreur détaillée:', JSON.stringify(error));
        }
      },
    });
  }

  // Nouvelle méthode pour connecter automatiquement l'utilisateur après inscription
  autoLoginAfterRegistration(registeredUser: any): void {
    // Créer une requête d'authentification conforme à l'interface AuthenticationRequest
    const authRequest: AuthenticationRequest = {
      login: this.user.email,
      password: this.user.motDePasse
    };

    // Appeler le service d'authentification
    this.connectedUserService.login(authRequest).subscribe({
      next: (authResponse) => {
        console.log('Connexion automatique réussie', authResponse);
        
        // Sauvegarder le token d'authentification
        this.connectedUserService.setAccessToken(authResponse);
        
        // Récupérer les informations complètes de l'utilisateur
        this.connectedUserService.getUserByEmail(this.user.email).subscribe({
          next: (userInfo) => {
            console.log('Informations utilisateur récupérées', userInfo);
            
            // Définir l'utilisateur connecté
            this.connectedUserService.setConnectedUser(userInfo);
            
            // Rediriger vers la page d'accueil
            this.router.navigate(['/etudiant/accueil']);
          },
          error: (error) => {
            console.error("Erreur lors de la récupération des infos utilisateur", error);
            // En cas d'erreur, on redirige quand même mais avec des paramètres pour indiquer qu'il faut se connecter
            this.router.navigate(['/etudiant/accueil'], {
              queryParams: {
                registered: 'true',
                email: this.user.email,
              },
            });
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors de la connexion automatique", error);
        // En cas d'erreur, on redirige vers la page d'accueil avec des paramètres
        this.router.navigate(['/etudiant/accueil'], {
          queryParams: {
            registered: 'true',
            email: this.user.email,
          },
        });
      }
    });
  }
}