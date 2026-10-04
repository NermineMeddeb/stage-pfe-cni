import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauPaiementComponent } from './nouveau-paiement.component';

describe('NouveauPaiementComponent', () => {
  let component: NouveauPaiementComponent;
  let fixture: ComponentFixture<NouveauPaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauPaiementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
