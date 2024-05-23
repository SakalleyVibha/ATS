import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmploymentTypeFormComponent } from './manage-employment-type-form.component';

describe('ManageEmploymentTypeFormComponent', () => {
  let component: ManageEmploymentTypeFormComponent;
  let fixture: ComponentFixture<ManageEmploymentTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageEmploymentTypeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageEmploymentTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
