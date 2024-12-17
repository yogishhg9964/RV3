export const CAB_PROVIDERS = [
  { label: 'Uber', value: 'UBER' },
  { label: 'Ola', value: 'OLA' },
  { label: 'Auto', value: 'AUTO' },
  { label: ' Rapido', value: 'RAPIDO' },
  { label: 'Other', value: 'OTHER' },
];

export type CabProvider = typeof CAB_PROVIDERS[number]['value']; 