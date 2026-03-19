import { Routes } from "@angular/router";

import { TrackingComponent } from "./pages/tracking/tracking.component";
import { ExperienceComponent } from "./pages/experience/experience.component";
import { ReportsComponent } from "./reports.component";

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ReportsComponent },
      { path: 'experience', component: ExperienceComponent },
      { path: 'tracking', component: TrackingComponent },
    ]
  }
];
