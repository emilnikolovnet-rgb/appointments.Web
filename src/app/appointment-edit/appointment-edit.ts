import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppointmentEditValidator } from './appointment-edit-validator';

@Component({
  selector: 'app-appointment-edit',
  imports: [],
  templateUrl: './appointment-edit.html',
  styleUrl: './appointment-edit.css',
})
export class AppointmentEdit {
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({

    title: new FormControl('', [Validators.required]),
    date: new FormControl('', [
      Validators.required, 
      AppointmentEditValidator.validateDate]),
    time: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  onSubmit() { 

  }
}
