import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeConfirmationComponent } from './modal-de-confirmation.component';

describe('ModalDeConfirmationComponent', () => {
  let component: ModalDeConfirmationComponent;
  let fixture: ComponentFixture<ModalDeConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
