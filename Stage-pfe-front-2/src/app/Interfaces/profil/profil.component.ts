import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import SavePhotoParams = PhotosService.SavePhotoParams;
import { UtilisateursDto } from 'src/cni-api/src/models';
import { UserService } from 'src/cni-api/src/services/user/user.service';
import { PhotosService } from 'src/cni-api/src/services/photoService';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {
  connectedUser: UtilisateursDto = {}; // The connected user
  file: File | null = null;
  origin = 'profile'; // Set a default origin/context
  errorMsg: Array<string> = [];
  imgUrl: string | ArrayBuffer = 'assets/default-avatar.png'; // Default image path

  constructor(
    private userService: UserService,
    private router: Router,
    private photoService: PhotosService
  ) {}

  ngOnInit(): void {
    // Retrieve connected user
    this.connectedUser = this.userService.getConnectedUser();
    console.log('Connected User:', this.connectedUser);

    // Update imgUrl if user has a profile photo
    if (this.connectedUser && this.connectedUser.photo) {
      this.imgUrl = 'assets/' + this.connectedUser.photo;
    }
  }

  modifierMotDePasse(): void {
    this.router.navigate(['/changer-le-pwd']);
  }

  modifierProfil(): void {
    this.router.navigate(['/dashbord/modifier-profil']);
  }

  // Handle the file input for the photo
  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
      if (this.file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file);
        fileReader.onload = () => {
          if (fileReader.result) {
            this.imgUrl = fileReader.result;
          }
        };
      }
    }
  }

  // Save photo to the backend and handle after-save logic
  savePhoto(): void {
    if (this.file && this.connectedUser.id) {
      const params: SavePhotoParams = {
        id: this.connectedUser.id,
        file: this.file,
        title: `${this.connectedUser.nom}_${this.connectedUser.prenom}_photo`,
        context: this.origin,
      };

      // Call the photo service to save the photo
      this.photoService.savePhoto(params).subscribe(
        () => {
          this.router.navigate(['/dashbord/utilisateur']); // Redirect to the user list page after save
        },
        (error) => {
          this.errorMsg.push('Error saving photo. Please try again.');
          console.error('Photo save failed', error);
        }
      );
    } else {
      this.errorMsg.push(
        'Please select a photo or ensure user information is loaded correctly.'
      );
    }
  }

  // Method to handle cancel click
  cancelClick(): void {
    this.router.navigate(['/dashbord/utilisateur']); // Redirect to the user list page
  }
}
