import { Routes } from '@angular/router';
import { AppointmentList } from './appointment-list/appointment-list';
import { AppointmentEdit } from './appointment-edit/appointment-edit';

export const routes: Routes = [
    { path: "*", component: AppointmentList },
    { path: "appointments", component: AppointmentList },
    { path: "appointments/edit", component: AppointmentEdit },
    { path: "appointments/edit/:id", component: AppointmentEdit}];
