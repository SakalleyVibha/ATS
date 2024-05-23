import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkAuthorizationComponent } from './manage-work-authorization.component';

describe('ManageWorkAuthorizationComponent', () => {
  let component: ManageWorkAuthorizationComponent;
  let fixture: ComponentFixture<ManageWorkAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageWorkAuthorizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageWorkAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
