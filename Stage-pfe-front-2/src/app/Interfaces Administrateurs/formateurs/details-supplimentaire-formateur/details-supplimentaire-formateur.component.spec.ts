import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSupplimentaireFormateurComponent } from './details-supplimentaire-formateur.component';

describe('DetailsSupplimentaireFormateurComponent', () => {
  let component: DetailsSupplimentaireFormateurComponent;
  let fixture: ComponentFixture<DetailsSupplimentaireFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsSupplimentaireFormateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsSupplimentaireFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
