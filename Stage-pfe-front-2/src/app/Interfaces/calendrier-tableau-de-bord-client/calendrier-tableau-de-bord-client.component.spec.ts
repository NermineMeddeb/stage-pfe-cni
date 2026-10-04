import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierTableauDeBordClientComponent } from './calendrier-tableau-de-bord-client.component';

describe('CalendrierTableauDeBordClientComponent', () => {
  let component: CalendrierTableauDeBordClientComponent;
  let fixture: ComponentFixture<CalendrierTableauDeBordClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendrierTableauDeBordClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendrierTableauDeBordClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
