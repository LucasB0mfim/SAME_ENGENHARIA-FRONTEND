import { Routes } from "@angular/router";

import { TrackingComponent } from "./pages/tracking/tracking.component";
import { ExperienceComponent } from "./pages/experience/experience.component";
import { InvoiceComponent } from "./pages/invoice/invoice.component";

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'experience', component: ExperienceComponent },
      { path: 'tracking', component: TrackingComponent },
      { path: 'invoice', component: InvoiceComponent }
    ]
  }
];
