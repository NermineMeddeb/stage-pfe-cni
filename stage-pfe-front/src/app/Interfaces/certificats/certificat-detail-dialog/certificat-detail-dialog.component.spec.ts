import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatDetailDialogComponent } from './certificat-detail-dialog.component';

describe('CertificatDetailDialogComponent', () => {
  let component: CertificatDetailDialogComponent;
  let fixture: ComponentFixture<CertificatDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificatDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
