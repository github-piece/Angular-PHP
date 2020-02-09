import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatIconModule, MatTreeModule } from '@angular/material';

import { PortanalysistreeComponent } from './portanalysistree.component';

describe('PortanalysistreeComponent', () => {
  let component: PortanalysistreeComponent;
  let fixture: ComponentFixture<PortanalysistreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortanalysistreeComponent ],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatTreeModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortanalysistreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
