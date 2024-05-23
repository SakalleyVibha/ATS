import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRoleComponent } from './job-role.component';

describe('JobRoleComponent', () => {
  let component: JobRoleComponent;
  let fixture: ComponentFixture<JobRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
