import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLobComponent } from './manage-lob.component';

describe('ManageLobComponent', () => {
  let component: ManageLobComponent;
  let fixture: ComponentFixture<ManageLobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageLobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageLobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
