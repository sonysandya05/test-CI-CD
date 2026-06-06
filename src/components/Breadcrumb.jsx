import { Breadcrumb } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AppTypography from './typography/Typography';

export default function AppBreadcrumb({ items = [] }) {
  const breadcrumbItems = items.map((item, index) => {
    const isLast = index === items.length - 1;
    return {
      title: isLast ? (
        <AppTypography variant="body" weight="medium" color="link">
          {item.label}
        </AppTypography>
      ) : (
        <a href={item.href}>
          <AppTypography variant="body" color="secondary">
            {item.label}
          </AppTypography>
          {item.dropdown && <DownOutlined />}
        </a>
      ),
    };
  });

  return <Breadcrumb items={breadcrumbItems} />;
}
