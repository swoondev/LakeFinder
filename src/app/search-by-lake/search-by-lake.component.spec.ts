import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByLakeComponent } from './search-by-lake.component';

describe('SearchByLakeComponent', () => {
  let component: SearchByLakeComponent;
  let fixture: ComponentFixture<SearchByLakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchByLakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByLakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
