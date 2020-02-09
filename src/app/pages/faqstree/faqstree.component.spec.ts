import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatIconModule, MatTreeModule } from '@angular/material';

import { FaqstreeComponent } from './faqstree.component';

describe('FaqstreeComponent', () => {
  let component: FaqstreeComponent;
  let fixture: ComponentFixture<FaqstreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqstreeComponent ],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatTreeModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqstreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
