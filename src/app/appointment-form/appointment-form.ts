import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentEditValidator } from '../appointment-edit/appointment-edit-validator';
import { AppointmentsService } from '../appointments.service';
import { provideNativeDateAdapter } from '@angular/material/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-appointment-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class AppointmentForm implements OnInit {
  id: number = 0;
  private activeModal = inject(NgbActiveModal);
  private appointmentsService = inject(AppointmentsService);
  private destroyRef = inject(DestroyRef);

  private appointment: Appointment | null = null;

  minDate: Date = new Date();
  availableTimes: string[] = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    date: new FormControl(<Date | null>null, [
      Validators.required,
      AppointmentEditValidator.validateDate
    ]),
    time: new FormControl('', [Validators.required]),
    additionalInfo: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadAppointmentData();
  }

  loadAppointmentData(): void {
    if (!this.id) {
      this.appointment = null;
      return;
    }

    this.appointmentsService.getAppointmentById(this.id).subscribe((appointment) => {
      this.appointment = appointment;
      this.form.patchValue({
        firstName: appointment.firstName,
        lastName: appointment.lastName,
        date: appointment.scheduledDate,
        time: appointment.scheduledDate.toTimeString().substring(0, 5),
        additionalInfo: appointment.additionalInfo ?? '',
      });
      this.setAvailableValues();
    });
  }

  setAvailableValues(): void {
    const selectedDate = this.form.get('date')?.value;

    if (selectedDate instanceof Date) {
      const availableTimes = this.appointmentsService.getAvailableTimesForDate(selectedDate);
      const currentTime = this.form.get('time')?.value;

      if (typeof currentTime === 'string' && currentTime !== '' && !availableTimes.includes(currentTime)) {
        availableTimes.push(currentTime);
      }

      this.availableTimes = availableTimes.sort();

      if (typeof currentTime === 'string' && currentTime !== '' && !this.availableTimes.includes(currentTime)) {
        this.form.patchValue({ time: '' });
      }
    } else {
      this.availableTimes = [];
      this.form.patchValue({ time: '' });
    }
  }
    
  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const firstName = this.form.get('firstName')?.value;
    const lastName = this.form.get('lastName')?.value;
    const selectedDate = this.form.get('date')?.value;
    const selectedTime = this.form.get('time')?.value;
    const additionalInfo = this.form.get('additionalInfo')?.value;

    this.appointmentsService.getAppointments().subscribe((appointments) => {
      const isBooked = appointments.some((appointment: Appointment) =>
        appointment.scheduledDate.toDateString() === selectedDate?.toDateString() &&
        appointment.scheduledDate.toTimeString().substring(0, 5) === selectedTime &&
        appointment.id !== this.id
      );

      if (isBooked) {
        alert('The selected date and time is already booked. Please choose a different time.');
        return;
      }

      const modifiedAppointment: Appointment = this.id > 0
        ? {
            ...(this.appointment ?? {
              id: 0,
              firstName: '',
              lastName: '',
              scheduledDate: new Date(),
              lastUpdatedDate: new Date(),
              additionalInfo: null,
            }),
          }
        : {
            id: 0,
            firstName: '',
            lastName: '',
            scheduledDate: new Date(),
            lastUpdatedDate: new Date(),
            additionalInfo: null,
          };

      if (typeof firstName === 'string' && firstName.trim() !== '') {
        modifiedAppointment.firstName = firstName;
      }

      if (typeof lastName === 'string' && lastName.trim() !== '') {
        modifiedAppointment.lastName = lastName;
      }

      if (selectedDate instanceof Date) {
        const appointmentDate = new Date(selectedDate);
        if (typeof selectedTime === 'string' && selectedTime.includes(':')) {
          const [hours, minutes] = selectedTime.split(':').map((part) => Number.parseInt(part, 10));
          appointmentDate.setHours(hours);
          appointmentDate.setMinutes(minutes);
        }
        modifiedAppointment.scheduledDate = appointmentDate;
      }

      if (typeof additionalInfo === 'string') {
        modifiedAppointment.additionalInfo = additionalInfo;
      }

      if (modifiedAppointment.id < 1) {
        this.appointmentsService.createAppointment(modifiedAppointment).subscribe(() => {
          this.activeModal.close('Data saved successfully');
        });
      } else {
        this.appointmentsService.editAppointment(modifiedAppointment).subscribe(() => {
          this.activeModal.close('Data saved successfully');
        });
      }

      console.log(this.form.value);
    });
  }

  cancel() {
    this.activeModal.dismiss('Canceled by the user');
  }
}
