import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EAccountingComponent } from './e-accounting.component';

describe('EAccountingComponent', () => {
  let component: EAccountingComponent;
  let fixture: ComponentFixture<EAccountingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EAccountingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
