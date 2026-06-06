import { Alert } from 'antd';
import '../styles/AppAlert.css';

export default function AppAlert({
  className = '',
  variant = 'default',
  showIcon = true,
  ...rest
}) {
  return (
    <Alert
      className={`app-alert app-alert--${variant} ${className}`.trim()}
      showIcon={showIcon}
      {...rest}
    />
  );
}
