import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSessionsComponent } from './details-sessions.component';

describe('DetailsSessionsComponent', () => {
  let component: DetailsSessionsComponent;
  let fixture: ComponentFixture<DetailsSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
