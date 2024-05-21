import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRecruitsTypeComponent } from './manage-recruits-type.component';

describe('ManageRecruitsTypeComponent', () => {
  let component: ManageRecruitsTypeComponent;
  let fixture: ComponentFixture<ManageRecruitsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageRecruitsTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageRecruitsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
