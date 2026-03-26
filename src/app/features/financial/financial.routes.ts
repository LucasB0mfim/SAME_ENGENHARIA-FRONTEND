import { Routes } from "@angular/router";
import { InvoiceComponent } from "./pages/invoice/invoice.component";

export const FINANCIAL_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'invoice', component: InvoiceComponent },
    ]
  }
];
