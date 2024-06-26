import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobComponent } from './lob.component';

describe('LobComponent', () => {
  let component: LobComponent;
  let fixture: ComponentFixture<LobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
