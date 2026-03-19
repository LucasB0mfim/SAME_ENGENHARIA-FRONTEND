import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

export const humanResourcesGuard: CanActivateFn = () => {
  const _router = inject(Router);
  const _userService = inject(UserService);
  const user = _userService.getUser();

  if (user?.funcao === 'RECURSOS HUMANOS' || user?.funcao === 'TI') return true;

  _router.navigate(['/workspace/dashboard']);
  return false;
};
