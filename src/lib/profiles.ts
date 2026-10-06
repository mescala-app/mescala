export const PROFILES = [
  { value: 'organizador', label: 'Líder de Igreja', route: '/dashboard' },
  { value: 'lider', label: 'Líder de Equipe', route: '/lider' },
  { value: 'membro', label: 'Membro de Equipe', route: '/membro' },
] as const;

export type ProfileValue = (typeof PROFILES)[number]['value'];
