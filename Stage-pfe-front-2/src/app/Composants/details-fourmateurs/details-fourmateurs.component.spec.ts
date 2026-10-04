import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFourmateursComponent } from './details-fourmateurs.component';

describe('DetailsFourmateursComponent', () => {
  let component: DetailsFourmateursComponent;
  let fixture: ComponentFixture<DetailsFourmateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsFourmateursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsFourmateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
