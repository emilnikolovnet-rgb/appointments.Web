import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'appointments/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'appointments/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'appointments',
    renderMode: RenderMode.Prerender
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
