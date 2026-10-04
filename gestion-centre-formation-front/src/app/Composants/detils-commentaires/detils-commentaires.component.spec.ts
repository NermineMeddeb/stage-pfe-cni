import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetilsCommentairesComponent } from './detils-commentaires.component';

describe('DetilsCommentairesComponent', () => {
  let component: DetilsCommentairesComponent;
  let fixture: ComponentFixture<DetilsCommentairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetilsCommentairesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetilsCommentairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
