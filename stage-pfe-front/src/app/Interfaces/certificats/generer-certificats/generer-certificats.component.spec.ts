import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenererCertificatsComponent } from './generer-certificats.component';

describe('GenererCertificatsComponent', () => {
  let component: GenererCertificatsComponent;
  let fixture: ComponentFixture<GenererCertificatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenererCertificatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenererCertificatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
