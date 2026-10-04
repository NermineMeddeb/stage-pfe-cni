import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauAdminComponent } from './nouveau-admin.component';

describe('NouveauAdminComponent', () => {
  let component: NouveauAdminComponent;
  let fixture: ComponentFixture<NouveauAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
