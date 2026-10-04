import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenererCertificationAutoComponent } from './generer-certification-auto.component';

describe('GenererCertificationAutoComponent', () => {
  let component: GenererCertificationAutoComponent;
  let fixture: ComponentFixture<GenererCertificationAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenererCertificationAutoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenererCertificationAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
