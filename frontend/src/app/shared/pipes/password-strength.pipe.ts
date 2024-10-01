import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordStrength'
})
export class PasswordStrengthPipe implements PipeTransform {

  transform(password: string): string {
    let score = 0;

    if (!password) {
      return '';
    }

    if (password.length >= 8) score += 1;
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^a-zA-Z0-9]/)) score += 1;

    if (score <= 2) return 'weak';
    else if (score <= 4) return 'medium';
    else return 'strong';
  }

}
