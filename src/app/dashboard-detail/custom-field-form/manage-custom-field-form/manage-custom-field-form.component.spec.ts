import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCustomFieldFormComponent } from './manage-custom-field-form.component';

describe('ManageCustomFieldFormComponent', () => {
  let component: ManageCustomFieldFormComponent;
  let fixture: ComponentFixture<ManageCustomFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageCustomFieldFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageCustomFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
