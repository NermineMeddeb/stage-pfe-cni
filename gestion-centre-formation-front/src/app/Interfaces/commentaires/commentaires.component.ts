import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commentaires',
  templateUrl: './commentaires.component.html',
  styleUrls: ['./commentaires.component.css']
})
export class CommentairesComponent implements OnInit {

// Liste des commentaires
commentaires = [
  { auteur: 'John Doe', texte: 'Ceci est un super article!', date: new Date() },
  { auteur: 'Jane Smith', texte: 'J\'ai beaucoup appris, merci!', date: new Date() }
];

constructor() { }

ngOnInit(): void {
}
}

