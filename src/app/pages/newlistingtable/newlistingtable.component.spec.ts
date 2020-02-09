import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';

import { NewlistingtableComponent } from './newlistingtable.component';

describe('NewlistingtableComponent', () => {
  let component: NewlistingtableComponent;
  let fixture: ComponentFixture<NewlistingtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewlistingtableComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewlistingtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
