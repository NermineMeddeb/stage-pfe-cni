import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFormationAdminComponent } from './details-formation-admin.component';

describe('DetailsFormationAdminComponent', () => {
  let component: DetailsFormationAdminComponent;
  let fixture: ComponentFixture<DetailsFormationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsFormationAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsFormationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
