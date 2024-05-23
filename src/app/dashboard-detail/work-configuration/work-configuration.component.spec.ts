import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkConfigurationComponent } from './work-configuration.component';

describe('WorkConfigurationComponent', () => {
  let component: WorkConfigurationComponent;
  let fixture: ComponentFixture<WorkConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
