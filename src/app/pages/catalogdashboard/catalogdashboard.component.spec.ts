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

import { CatalogdashboardComponent_1_15 } from './catalogdashboard.component_1_15';

describe('CatalogdashboardComponent_1_15', () => {
  let component: CatalogdashboardComponent_1_15;
  let fixture: ComponentFixture<CatalogdashboardComponent_1_15>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogdashboardComponent_1_15],
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
    fixture = TestBed.createComponent(CatalogdashboardComponent_1_15);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
