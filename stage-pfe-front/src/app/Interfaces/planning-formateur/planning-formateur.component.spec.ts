import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningFormateurComponent } from './planning-formateur.component';

describe('PlanningFormateurComponent', () => {
  let component: PlanningFormateurComponent;
  let fixture: ComponentFixture<PlanningFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningFormateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
