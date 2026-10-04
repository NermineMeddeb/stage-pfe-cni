import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauClientComponent } from './nouveau-client.component';

describe('NouveauClientComponent', () => {
  let component: NouveauClientComponent;
  let fixture: ComponentFixture<NouveauClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
