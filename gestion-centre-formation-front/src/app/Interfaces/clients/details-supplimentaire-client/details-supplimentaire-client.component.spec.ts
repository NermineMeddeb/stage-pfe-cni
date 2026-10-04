import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSupplimentaireClientComponent } from './details-supplimentaire-client.component';

describe('DetailsSupplimentaireClientComponent', () => {
  let component: DetailsSupplimentaireClientComponent;
  let fixture: ComponentFixture<DetailsSupplimentaireClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsSupplimentaireClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsSupplimentaireClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
