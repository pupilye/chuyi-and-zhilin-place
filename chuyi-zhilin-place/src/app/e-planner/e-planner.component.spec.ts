import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EPlannerComponent } from './e-planner.component';

describe('EPlannerComponent', () => {
  let component: EPlannerComponent;
  let fixture: ComponentFixture<EPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
