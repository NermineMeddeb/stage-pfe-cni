import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tableau-de-bord',
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.css']
})
export class TableauDeBordComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Toute logique d'initialisation peut aller ici
  }

  // Données pour le graphique
  single = [
    {
      "name": "USA",
      "value": 8940000
    },
    {
      "name": "China",
      "value": 5000000
    },
    {
      "name": "Japan",
      "value": 7200000
    }
  ];

  // Options de graphique
  view: [number, number] = [700, 400];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

}
