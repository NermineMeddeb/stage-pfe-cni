import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/cni-api/src/models/authentication-request';
import { UserService } from 'src/cni-api/src/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  authenticationRequest: AuthenticationRequest = {};
  errorMessage = '';
  isLoading = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Vérifier si un email est stocké dans le localStorage (fonctionnalité "Se souvenir de moi")
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.authenticationRequest.login = savedEmail;
      // Cocher automatiquement la case "Se souvenir de moi"
      setTimeout(() => {
        const checkbox = document.getElementById(
          'rememberMe'
        ) as HTMLInputElement;
        if (checkbox) checkbox.checked = true;
      }, 0);
    }
  }

  login() {
    // Vérification basique des champs
    if (
      !this.authenticationRequest.login ||
      !this.authenticationRequest.password
    ) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    // Traitement de l'option "Se souvenir de moi"
    const rememberMe = (
      document.getElementById('rememberMe') as HTMLInputElement
    )?.checked;
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', this.authenticationRequest.login);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Activation de l'état de chargement
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.login(this.authenticationRequest).subscribe(
      (data) => {
        this.userService.setAccessToken(data);
        // Récupère les infos utilisateur par email
        this.getUserByEmail();
        console.log('Login successful:', data);
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Votre Login ou mot de passe est incorrect';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la connexion';
        }

        // Animation du formulaire en cas d'erreur
        const card = document.querySelector('.card');
        if (card) {
          card.classList.add('shake-animation');
          setTimeout(() => {
            card.classList.remove('shake-animation');
          }, 500);
        }
      }
    );
  }

  getUserByEmail(): void {
    this.userService.getUserByEmail(this.authenticationRequest.login).subscribe(
      (user) => {
        this.isLoading = false;
        this.userService.setConnectedUser(user);

        // Redirection en fonction du rôle
        if (user.role === 'ADMIN') {
          this.router.navigate(['dashboard/tableau-de-bord-formations']);
        } else if (user.role === 'ETUDIANT') {
          this.router.navigate(['/etudiant/accueil']);
        } else {
          this.errorMessage = 'Rôle non reconnu';
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage =
          'Erreur lors de la récupération des informations utilisateur';
      }
    );
  }

  // Fonction pour réinitialiser le formulaire
  resetForm(): void {
    this.authenticationRequest = {};
    this.errorMessage = '';
  }
}
