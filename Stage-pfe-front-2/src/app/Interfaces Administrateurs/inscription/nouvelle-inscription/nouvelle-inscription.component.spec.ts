import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleInscriptionComponent } from './nouvelle-inscription.component';

describe('NouvelleInscriptionComponent', () => {
  let component: NouvelleInscriptionComponent;
  let fixture: ComponentFixture<NouvelleInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelleInscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
