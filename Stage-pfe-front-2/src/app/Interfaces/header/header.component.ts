import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateursDto } from 'src/cni-api/src/models';
import { UserService } from 'src/cni-api/src/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [] // Ajoutez vos animations ici si nécessaires
})
export class HeaderComponent implements OnInit {
  userData: UtilisateursDto | null = null;
  loading: boolean = false;
  userId: number | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading = true;
    const user = this.userService.getConnectedUser();
    if (user && user.id) {
      this.userId = user.id;
      this.userData = user;
      // this.loadUserFormations(user.id); // décommentez si nécessaire
    } else {
      this.router.navigate(['/login']);
    }
    this.loading = false;
  }
}
