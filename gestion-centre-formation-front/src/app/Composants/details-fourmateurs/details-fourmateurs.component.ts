import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateursDto } from 'src/cni-api/src/models';
import { ApiService } from 'src/cni-api/src/services';
@Component({
  selector: 'app-details-fourmateurs',
  templateUrl: './details-fourmateurs.component.html',
  styleUrls: ['./details-fourmateurs.component.css']
})
export class DetailsFourmateursComponent implements OnInit {


  @Input() UtilisateursDto!: UtilisateursDto;
  @Output()
  suppressionResult = new EventEmitter();

  constructor( private router: Router,
    private clientService: ApiService) { }

  ngOnInit(): void {    

  }
  confirmerEtSupprimerClient(): void {
    console.log('Tentative de suppression de client avec ID :', { idClient: this.UtilisateursDto.id });
    if (this.UtilisateursDto.id) {
      this.clientService.delete_3(this.UtilisateursDto.id)
      .subscribe(res => {
        this.suppressionResult.emit('success');
      }, error => {
        this.suppressionResult.emit(error.error.error);
      });
    }}

    
    modifierClient(): void {
      this.router.navigate(['/dashbord/nouveau-client', { idClient: this.UtilisateursDto.id }]);
    } 
    AfficherDetailsSupplimentaire(): void {
      this.router.navigate(['/dashbord/clients/DetailsSupplimentaireClient', { idClient: this.UtilisateursDto.id }]);
    }

}
