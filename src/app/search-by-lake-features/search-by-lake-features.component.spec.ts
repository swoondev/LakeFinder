import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByLakeFeaturesComponent } from './search-by-lake-features.component';

describe('SearchByLakeFeaturesComponent', () => {
  let component: SearchByLakeFeaturesComponent;
  let fixture: ComponentFixture<SearchByLakeFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchByLakeFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByLakeFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
