import { Card } from 'antd';
import '../../styles/AppCard.css';

export default function AppCard({
  title,
  icon,
  extra,
  children,
  variant = 'default',
  ...rest
}) {
  const cardTitle = (icon || title) ? (
    <span className="app-card-title">
      {icon && <span className="app-card-title-icon">{icon}</span>}
      {title}
    </span>
  ) : undefined;

  return (
    <Card
      className={`app-card app-card--${variant}`}
      title={cardTitle}
      extra={extra}
      {...rest}
    >
      {children}
    </Card>
  );
}
