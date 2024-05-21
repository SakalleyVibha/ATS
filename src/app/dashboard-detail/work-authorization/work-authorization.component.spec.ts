import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAuthorizationComponent } from './work-authorization.component';

describe('WorkAuthorizationComponent', () => {
  let component: WorkAuthorizationComponent;
  let fixture: ComponentFixture<WorkAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkAuthorizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
