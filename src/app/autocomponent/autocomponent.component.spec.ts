import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocomponentComponent } from './autocomponent.component';

describe('AutocomponentComponent', () => {
  let component: AutocomponentComponent;
  let fixture: ComponentFixture<AutocomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
