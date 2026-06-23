import type { Locale } from './config';

const AUTH_ERROR_MAP: Record<string, { sr: string; en: string }> = {
  'Invalid login credentials': {
    sr: 'Pogrešan email ili lozinka.',
    en: 'Incorrect email or password.',
  },
  'Invalid credentials': {
    sr: 'Pogrešan email ili lozinka.',
    en: 'Incorrect email or password.',
  },
  'Email not confirmed': {
    sr: 'Potvrdite email pre prijave (proverite inbox).',
    en: 'Confirm your email before signing in (check your inbox).',
  },
  'User already registered': {
    sr: 'Nalog sa ovim emailom već postoji.',
    en: 'An account with this email already exists.',
  },
  'Password should be at least 6 characters': {
    sr: 'Lozinka mora imati najmanje 6 karaktera.',
    en: 'Password must be at least 6 characters.',
  },
  'Signup requires a valid password': {
    sr: 'Unesite ispravnu lozinku.',
    en: 'Enter a valid password.',
  },
  'Unable to validate email address: invalid format': {
    sr: 'Email adresa nije ispravna.',
    en: 'Email address is not valid.',
  },
  'User not found': {
    sr: 'Korisnik nije pronađen.',
    en: 'User not found.',
  },
  'Email rate limit exceeded': {
    sr: 'Previše pokušaja. Pokušajte ponovo za nekoliko minuta.',
    en: 'Too many attempts. Try again in a few minutes.',
  },
  'For security purposes, you can only request this once every 60 seconds': {
    sr: 'Sačekajte minut pre sledećeg pokušaja.',
    en: 'Wait a minute before trying again.',
  },
  'Network request failed': {
    sr: 'Nema internet konekcije. Proverite mrežu.',
    en: 'No internet connection. Check your network.',
  },
};

const FALLBACK: Record<Locale, string> = {
  sr: 'Došlo je do greške. Pokušajte ponovo.',
  en: 'Something went wrong. Please try again.',
};

export function translateAuthError(message: string | undefined, locale: Locale): string {
  if (!message?.trim()) return FALLBACK[locale];

  const normalized = message.trim();
  const exact = AUTH_ERROR_MAP[normalized];
  if (exact) return exact[locale];

  const lower = normalized.toLowerCase();
  if (lower.includes('invalid login') || lower.includes('invalid credentials')) {
    return AUTH_ERROR_MAP['Invalid login credentials']![locale];
  }
  if (lower.includes('already registered') || lower.includes('already exists')) {
    return AUTH_ERROR_MAP['User already registered']![locale];
  }
  if (lower.includes('email not confirmed')) {
    return AUTH_ERROR_MAP['Email not confirmed']![locale];
  }
  if (lower.includes('password') && lower.includes('6')) {
    return AUTH_ERROR_MAP['Password should be at least 6 characters']![locale];
  }
  if (lower.includes('rate limit')) {
    return AUTH_ERROR_MAP['Email rate limit exceeded']![locale];
  }
  if (lower.includes('network')) {
    return AUTH_ERROR_MAP['Network request failed']![locale];
  }

  return FALLBACK[locale];
}
