import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
  // Variable pour savoir si le sidebar est ouvert ou non
  isSidebarOpen = true;

  // Méthode pour basculer entre ouvert/fermé
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
