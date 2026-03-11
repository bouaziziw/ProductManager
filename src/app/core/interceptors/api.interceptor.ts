import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Mock API base URL logic could be added here
  const clonedRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(clonedRequest).pipe(
    catchError(error => {
      console.error('API Error intercepted:', error);
      // Can add global toast notification service here later
      return throwError(() => error);
    })
  );
};
