import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesCertificationsComponent } from './mes-certifications.component';

describe('MesCertificationsComponent', () => {
  let component: MesCertificationsComponent;
  let fixture: ComponentFixture<MesCertificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesCertificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesCertificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
