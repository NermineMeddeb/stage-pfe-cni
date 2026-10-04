import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierSessionsCalendrierComponent } from './modifier-sessions-calendrier.component';

describe('ModifierSessionsCalendrierComponent', () => {
  let component: ModifierSessionsCalendrierComponent;
  let fixture: ComponentFixture<ModifierSessionsCalendrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierSessionsCalendrierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierSessionsCalendrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
