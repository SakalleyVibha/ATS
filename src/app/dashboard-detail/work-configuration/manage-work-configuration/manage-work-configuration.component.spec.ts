import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkConfigurationComponent } from './manage-work-configuration.component';

describe('ManageWorkConfigurationComponent', () => {
  let component: ManageWorkConfigurationComponent;
  let fixture: ComponentFixture<ManageWorkConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageWorkConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageWorkConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
