import { map } from 'rxjs/operators';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { DashboardService } from '../services/dashboard.service';

export const constructionAccessGuard: CanActivateFn = (route, state) => {

  const _router = inject(Router);
  const _dashboardService = inject(DashboardService);

  return _dashboardService.findAll().pipe(
    map(response => {
      if (response.employee.role === 'Compras' || response.employee.role === 'Desenvolvedor') {
        return true
      } else if (response.employee.position === 'Diretor') {
        return true
      } else {
        _router.navigate(['/dashboard']);
        console.log('Você não possui permissão para entrar...');
        alert('Você não possui permissão para entrar...');
        return false;
      }
    })
  );
};
