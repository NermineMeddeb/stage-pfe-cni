import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleSessionsCalendrierComponent } from './nouvelle-sessions-calendrier.component';

describe('NouvelleSessionsCalendrierComponent', () => {
  let component: NouvelleSessionsCalendrierComponent;
  let fixture: ComponentFixture<NouvelleSessionsCalendrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelleSessionsCalendrierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleSessionsCalendrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
