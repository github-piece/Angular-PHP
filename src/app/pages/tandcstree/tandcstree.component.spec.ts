import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatIconModule, MatTreeModule } from '@angular/material';

import { TandcstreeComponent } from './tandcstree.component';

describe('TandcstreeComponent', () => {
  let component: TandcstreeComponent;
  let fixture: ComponentFixture<TandcstreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TandcstreeComponent ],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatTreeModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TandcstreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
