import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApercuProgrammeComponent } from './apercu-programme.component';

describe('ApercuProgrammeComponent', () => {
  let component: ApercuProgrammeComponent;
  let fixture: ComponentFixture<ApercuProgrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApercuProgrammeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApercuProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
