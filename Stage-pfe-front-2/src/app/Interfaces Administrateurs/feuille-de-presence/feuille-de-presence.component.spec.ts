import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleDePresenceComponent } from './feuille-de-presence.component';

describe('FeuilleDePresenceComponent', () => {
  let component: FeuilleDePresenceComponent;
  let fixture: ComponentFixture<FeuilleDePresenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeuilleDePresenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeuilleDePresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
