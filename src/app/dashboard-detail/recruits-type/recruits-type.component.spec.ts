import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitsTypeComponent } from './recruits-type.component';

describe('RecruitsTypeComponent', () => {
  let component: RecruitsTypeComponent;
  let fixture: ComponentFixture<RecruitsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecruitsTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecruitsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
