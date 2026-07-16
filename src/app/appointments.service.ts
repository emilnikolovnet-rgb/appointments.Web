import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

private apiUrl = environment.apiUrl;

  availableTimes: string[] = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl).pipe(
      map(appointments => 
        appointments.map(appointment => ({
          ...appointment,
          scheduledDate: new Date(appointment.scheduledDate),
          lastUpdatedDate: new Date(appointment.lastUpdatedDate)
        }))),
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to load appointments', error);
        return throwError(() => error);
      })
    );
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`).pipe(
      map(appointment => ({
        ...appointment,
        scheduledDate: new Date(appointment.scheduledDate),
        lastUpdatedDate: new Date(appointment.lastUpdatedDate)
      }))
    );
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment).pipe(
      map(createdAppointment => ({
        ...createdAppointment,
        scheduledDate: new Date(createdAppointment.scheduledDate),
        lastUpdatedDate: new Date(createdAppointment.lastUpdatedDate)
      }))
    );
  }

  editAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${appointment.id}`, appointment).pipe(
      map(updatedAppointment => ({
        ...updatedAppointment,
        scheduledDate: new Date(updatedAppointment.scheduledDate),
        lastUpdatedDate: new Date(updatedAppointment.lastUpdatedDate)
      }))
    );
  }

  getAvailableTimesForDate(date: Date): string[] {
    return this.availableTimes;
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}