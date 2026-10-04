import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleSessionComponent } from './nouvelle-session.component';

describe('NouvelleSessionComponent', () => {
  let component: NouvelleSessionComponent;
  let fixture: ComponentFixture<NouvelleSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelleSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
