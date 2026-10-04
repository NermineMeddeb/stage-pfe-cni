import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauDeBordFinanceComponent } from './tableau-de-bord-finance.component';

describe('TableauDeBordFinanceComponent', () => {
  let component: TableauDeBordFinanceComponent;
  let fixture: ComponentFixture<TableauDeBordFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableauDeBordFinanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauDeBordFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
