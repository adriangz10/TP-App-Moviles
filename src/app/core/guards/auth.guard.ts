import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from "../../services/auth/auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const user = await authService.getLoggedInUser();
    console.log('Usuario autenticado:', user);
    
    if (!user) {
      return router.createUrlTree(['/login']);
    }

    return true;
  } catch (e) {
    console.error('Error al verificar la autenticación:', e);
    return router.createUrlTree(['/login']);
  }
};
