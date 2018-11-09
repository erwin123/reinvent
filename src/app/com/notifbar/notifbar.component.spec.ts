import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifbarComponent } from './notifbar.component';

describe('NotifbarComponent', () => {
  let component: NotifbarComponent;
  let fixture: ComponentFixture<NotifbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
