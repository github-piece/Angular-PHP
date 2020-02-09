import { LayoutModule } from '@angular/cdk/layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatMenuModule,
} from '@angular/material';

import { UpcominglistingsdashboardComponent } from './upcominglistingsdashboard.component';
import {beforeEach, describe, expect, it} from '@angular/core/testing/src/testing_internal';

describe('UpcominglistingsdashboardComponent', () => {
  let component: UpcominglistingsdashboardComponent;
  let fixture: ComponentFixture<UpcominglistingsdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpcominglistingsdashboardComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        MatMenuModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcominglistingsdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
