import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierClientComponent } from './calendrier-client.component';

describe('CalendrierClientComponent', () => {
  let component: CalendrierClientComponent;
  let fixture: ComponentFixture<CalendrierClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendrierClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendrierClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
