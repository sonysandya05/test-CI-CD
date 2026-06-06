export const colors = {
  brand: '#0053a5',
  brandDark: '#1d4ed8',
  brandDarker: '#1e40af',

  textPrimary: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#586888',
  textSubtle: '#9ca3af',
  textInverse: '#ffffff',
  textLink: '#1677ff',

  surfacePage: '#f5f6fa',
  surfaceSoft: '#f8fafc',
  surfaceSofter: '#f3f8fb',
  surfaceCard: '#ffffff',
  surfaceHover: '#eff6ff',
  surfaceSelected: '#dbeafe',

  border: '#e5e7eb',
  borderLight: '#eef3f8',
  borderSofter: '#f0f0f0',

  iconMuted: '#d1d5db',
  danger: '#dc2626',
  dangerSoft: '#ef4444',
  success: '#15803d',
  successSoft: '#16a34a',
  warning: '#f97316',
  info: '#3b82f6',

  avatarNeutralBg: '#d9d9d9',
  avatarNeutralText: '#555555',
  avatarIndigo: '#6366f1',
  avatarPurple: '#8b5cf6',
  avatarBlue: '#3b82f6',
  avatarGreen: '#10b981',
  linkedIn: '#0077b5',
};

export const typographyColors = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  subtle: colors.textSubtle,
  inverse: colors.textInverse,
  link: colors.textLink,
  danger: colors.danger,
  success: colors.success,
};

export const onboardingStageToneColors = {
  approved: {
    background: '#f2f2e8',
    text: '#79772d',
  },
  danger: {
    background: '#fde7e9',
    text: colors.danger,
  },
  issued: {
    background: '#e9f2fb',
    text: colors.textLink,
  },
  neutral: {
    background: colors.surfaceSoft,
    text: colors.textSecondary,
  },
  success: {
    background: '#e7f5ee',
    text: colors.success,
  },
  warning: {
    background: '#fbf0e7',
    text: colors.warning,
  },
};

export const colorVars = {
  brand: 'var(--color-brand)',
  brandDark: 'var(--color-brand-dark)',
  brandDarker: 'var(--color-brand-darker)',

  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textMuted: 'var(--color-text-muted)',
  textSubtle: 'var(--color-text-subtle)',
  textInverse: 'var(--color-text-inverse)',
  textLink: 'var(--color-text-link)',

  surfacePage: 'var(--color-surface-page)',
  surfaceSoft: 'var(--color-surface-soft)',
  surfaceSofter: 'var(--color-surface-softer)',
  surfaceCard: 'var(--color-surface-card)',
  surfaceHover: 'var(--color-surface-hover)',
  surfaceSelected: 'var(--color-surface-selected)',

  border: 'var(--color-border)',
  borderLight: 'var(--color-border-light)',
  borderSofter: 'var(--color-border-softer)',

  iconMuted: 'var(--color-icon-muted)',
  danger: 'var(--color-danger)',
  dangerSoft: 'var(--color-danger-soft)',
  success: 'var(--color-success)',
  successSoft: 'var(--color-success-soft)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)',
};
