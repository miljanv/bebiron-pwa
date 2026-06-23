const GENITIVE_EXCEPTIONS: Record<string, string> = {
  luka: 'Luke',
  nikola: 'Nikole',
  nikša: 'Nikše',
  maša: 'Maše',
  anđela: 'Anđele',
  matija: 'Matije',
  vojin: 'Vojina',
  jovan: 'Jovana',
  dunja: 'Dunje',
  sofija: 'Sofije',
  marija: 'Marije',
  milica: 'Milice',
  ana: 'Ane',
  sara: 'Sare',
  maja: 'Maje',
  jelena: 'Jelene',
  ivana: 'Ivane',
  petra: 'Petre',
  đorđe: 'Đorđa',
  vuk: 'Vuka',
  strahinja: 'Strahinje',
  vasilije: 'Vasilija',
  aleksa: 'Aleksa',
  lazar: 'Lazara',
};

function capitalizeLike(original: string, result: string): string {
  if (!original.length) return result;
  if (original === original.toUpperCase() && /[A-ZČĆŽŠĐ]/.test(original)) {
    return result.toUpperCase();
  }
  const first = original.charAt(0);
  if (first === first.toUpperCase() && first !== first.toLowerCase()) {
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

export function toGenitive(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;

  const lower = trimmed.toLocaleLowerCase('sr');
  const exception = GENITIVE_EXCEPTIONS[lower];
  if (exception) return capitalizeLike(trimmed, exception);

  if (/a$/i.test(trimmed)) {
    if (/ija$/i.test(trimmed)) return trimmed.slice(0, -1) + 'e';
    if (/ica$/i.test(trimmed)) return trimmed.slice(0, -1) + 'e';
    return trimmed.slice(0, -1) + 'e';
  }
  if (/o$/i.test(trimmed)) return trimmed.slice(0, -1) + 'a';
  if (/e$/i.test(trimmed)) return trimmed.slice(0, -1) + 'a';
  if (/ar$/i.test(trimmed)) return trimmed + 'a';
  return trimmed + 'a';
}
