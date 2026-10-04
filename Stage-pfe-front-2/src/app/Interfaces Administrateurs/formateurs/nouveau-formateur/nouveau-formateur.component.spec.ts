import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauFormateurComponent } from './nouveau-formateur.component';

describe('NouveauFormateurComponent', () => {
  let component: NouveauFormateurComponent;
  let fixture: ComponentFixture<NouveauFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauFormateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
