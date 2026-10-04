import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauDeBordFormationsComponent } from './tableau-de-bord-formations.component';

describe('TableauDeBordFormationsComponent', () => {
  let component: TableauDeBordFormationsComponent;
  let fixture: ComponentFixture<TableauDeBordFormationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableauDeBordFormationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauDeBordFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
