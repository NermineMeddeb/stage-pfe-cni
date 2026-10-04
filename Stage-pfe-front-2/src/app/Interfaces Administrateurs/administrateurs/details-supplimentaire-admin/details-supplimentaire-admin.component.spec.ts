import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSupplimentaireAdminComponent } from './details-supplimentaire-admin.component';

describe('DetailsSupplimentaireAdminComponent', () => {
  let component: DetailsSupplimentaireAdminComponent;
  let fixture: ComponentFixture<DetailsSupplimentaireAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsSupplimentaireAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsSupplimentaireAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
