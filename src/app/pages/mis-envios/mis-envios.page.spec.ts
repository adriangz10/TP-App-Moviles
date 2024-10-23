import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisEnviosPage } from './mis-envios.page';

describe('MisEnviosPage', () => {
  let component: MisEnviosPage;
  let fixture: ComponentFixture<MisEnviosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisEnviosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
