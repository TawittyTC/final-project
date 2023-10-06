import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDeviceComponent } from './table-device.component';

describe('TableDeviceComponent', () => {
  let component: TableDeviceComponent;
  let fixture: ComponentFixture<TableDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
