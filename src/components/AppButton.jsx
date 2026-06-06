import { Button } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
import '../styles/AppButton.css';

export default function AppButton({
  children,
  className = '',
  icon,
  to,
  variant = 'default',
  ...rest
}) {
  const button = (
    <Button
      className={`app-button app-button--${variant} ${className}`.trim()}
      icon={icon}
      {...rest}
    >
      {children}
    </Button>
  );

  if (to) {
    return (
      <RouterLink className="app-button-link" to={to}>
        {button}
      </RouterLink>
    );
  }

  return button;
}
