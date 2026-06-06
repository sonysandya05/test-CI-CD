import { Typography } from 'antd';
import { colorVars } from '../../theme/colors/colors';

const { Text, Title, Paragraph, Link } = Typography;

const defaultElementByVariant = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  'section-title': 'h3',
  'card-title': 'h4',
  subtitle: 'span',
  body: 'span',
  'body-strong': 'span',
  label: 'span',
  caption: 'span',
  meta: 'span',
  metric: 'span',
  helper: 'span',
  link: 'a',
};

const namedSizes = {
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  md: 'var(--font-size-md)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  '3xl': 'var(--font-size-3xl)',
  '4xl': 'var(--font-size-4xl)',
};

const namedWeights = {
  regular: 'var(--font-weight-regular)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
  extrabold: 'var(--font-weight-extrabold)',
};

const namedLineHeights = {
  tight: 'var(--line-height-tight)',
  snug: 'var(--line-height-snug)',
  normal: 'var(--line-height-normal)',
  relaxed: 'var(--line-height-relaxed)',
};

const namedColors = {
  primary: colorVars.textPrimary,
  secondary: colorVars.textSecondary,
  muted: colorVars.textMuted,
  subtle: colorVars.textSubtle,
  inverse: colorVars.textInverse,
  link: colorVars.textLink,
  danger: colorVars.danger,
  success: colorVars.success,
};

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function tokenValue(value, tokens) {
  if (value === undefined || value === null) return undefined;
  return tokens[value] || value;
}

function getAntTypographyComponent(tag, variant) {
  if (variant === 'link' || tag === 'a') return Link;
  if (tag === 'p') return Paragraph;
  if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(tag)) return Title;
  return Text;
}

function getTitleLevel(tag, variant) {
  const resolvedTag = tag || defaultElementByVariant[variant];
  if (!resolvedTag?.startsWith('h')) return undefined;
  return Number(resolvedTag.slice(1));
}

export default function AppTypography({
  as,
  tag,
  variant = 'body',
  color,
  size,
  weight,
  lineHeight,
  align,
  truncate = false,
  display,
  className,
  style,
  children,
  ...props
}) {
  const resolvedTag = tag || as || defaultElementByVariant[variant] || 'span';
  const Component = getAntTypographyComponent(resolvedTag, variant);
  const titleLevel = getTitleLevel(resolvedTag, variant);
  const dynamicStyle = {
    color: tokenValue(color, namedColors),
    fontSize: tokenValue(size, namedSizes),
    fontWeight: tokenValue(weight, namedWeights),
    lineHeight: tokenValue(lineHeight, namedLineHeights),
    display,
    ...style,
  };

  return (
    <Component
      {...(titleLevel ? { level: titleLevel } : {})}
      className={cx(
        'app-typography',
        `app-typography--${variant}`,
        color && namedColors[color] && `app-typography--${color}`,
        align && `app-typography--${align}`,
        truncate && 'app-typography--truncate',
        className,
      )}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
