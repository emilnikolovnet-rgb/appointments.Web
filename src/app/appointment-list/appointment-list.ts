import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentForm } from '../appointment-form/appointment-form';
import { RouterModule } from '@angular/router';
import { AppointmentsService } from '../appointments.service';

@Component({
  selector: 'app-appointment-list',
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
})
export class AppointmentList implements OnInit {
  
    currentPage: number = 1;
    pageSize: number = 1;

    private modalService = inject(NgbModal);
    appointments: Appointment[] = [];
    private appointmentsService = inject(AppointmentsService);
     private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
      const subscription = this.appointmentsService.getAppointments().subscribe({
        next: (appointments) => {
          this.appointments = appointments;
        },
        error: (error) => {
          console.error('Appointments list load failed', error);
        }
      });

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }

    openAppointmentForm(id?: number | null) {
      const modalRef = this.modalService.open(AppointmentForm, { size: 'lg', centered: true });
      modalRef.componentInstance.id = id;
      modalRef.componentInstance.loadAppointmentData();
      modalRef.result.then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
    }

  get pagedAppointments() {

    const startIndex = (this.currentPage - 1) * this.pageSize;
    
    return this.appointments.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.appointments.length / this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  deleteAppointment(id: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentsService.deleteAppointment(id).subscribe(() => {
        this.appointmentsService.getAppointments().subscribe((appointments) => {
          this.appointments = appointments;
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
        });
      });
    }
  }
}
