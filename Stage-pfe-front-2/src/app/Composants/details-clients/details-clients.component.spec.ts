import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsClientsComponent } from './details-clients.component';

describe('DetailsClientsComponent', () => {
  let component: DetailsClientsComponent;
  let fixture: ComponentFixture<DetailsClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsClientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
