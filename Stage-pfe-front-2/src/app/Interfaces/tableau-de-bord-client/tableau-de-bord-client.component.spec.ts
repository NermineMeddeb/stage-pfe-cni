import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauDeBordClientComponent } from './tableau-de-bord-client.component';

describe('TableauDeBordClientComponent', () => {
  let component: TableauDeBordClientComponent;
  let fixture: ComponentFixture<TableauDeBordClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableauDeBordClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauDeBordClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
