import { Routes } from "@angular/router";

import { TrackingComponent } from "./pages/tracking/tracking.component";
import { ExperienceComponent } from "./pages/experience/experience.component";

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'experience', component: ExperienceComponent },
      { path: 'tracking', component: TrackingComponent },
    ]
  }
];
