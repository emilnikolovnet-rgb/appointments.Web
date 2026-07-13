import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppointmentForm } from './appointment-form';
import { AppointmentsService } from '../appointments.service';

describe('AppointmentForm', () => {
  let component: AppointmentForm;
  let fixture: ComponentFixture<AppointmentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentForm],
      providers: [{ provide: NgbActiveModal, useValue: { close: () => {}, dismiss: () => {} } }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load appointment data when an id is provided', () => {
    const appointmentsService = TestBed.inject(AppointmentsService);

    component.id = 1;
    component.loadAppointmentData();

    expect(component.form.get('firstName')?.value).toBe('Joe');
    expect(component.form.get('lastName')?.value).toBe('Doe');
    expect(component.form.get('date')?.value).toBe(appointmentsService.getAppointmentById(1).scheduledDate.toISOString().split('T')[0]);
  });
});
