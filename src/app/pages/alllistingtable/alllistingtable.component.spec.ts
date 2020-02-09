import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';

import { AlllistingtableComponent } from './alllistingtable.component';

describe('AlllistingtableComponent', () => {
  let component: AlllistingtableComponent;
  let fixture: ComponentFixture<AlllistingtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlllistingtableComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlllistingtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
