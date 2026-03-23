import { Routes } from "@angular/router";
import { humanResourcesGuard } from "./guards/human-resources.guard";

import { BrkComponent } from "./pages/brk/brk.component";
import { TaskComponent } from "./pages/task/task.component";
import { AdmissionComponent } from "./pages/admission/admission.component";
import { TransportComponent } from "./pages/transport/transport.component";
import { ResignationComponent } from "./pages/resignation/resignation.component";
import { DisciplinaryMeasureComponent } from "./pages/disciplinary-measure/disciplinary-measure.component";

export const HUMAN_RESOURCES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [humanResourcesGuard],
    children: [
      { path: 'admission', component: AdmissionComponent },
      { path: 'brk', component: BrkComponent },
      { path: 'disciplinary-measure', component: DisciplinaryMeasureComponent },
      { path: 'resignation', component: ResignationComponent },
      { path: 'task', component: TaskComponent },
      { path: 'transport', component: TransportComponent },
    ]
  }
];
