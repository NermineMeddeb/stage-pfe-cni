import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent implements OnInit {
//je veux envoyer un evenement de composants fils au composants parents
@Input()
isNouveauVisible = true;
@Input()
isExporterVisible = true;
@Input()
isImporterVisible = true;
@Output() clickEvent = new EventEmitter<void>(); 

  constructor() { }

  ngOnInit(): void {}

  buttonNouveauClick(): void {
    console.log("Button clicked, emitting event...");
    this.clickEvent.emit();
  }
}
