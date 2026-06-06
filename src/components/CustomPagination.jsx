import { Flex, Pagination, Select, Space } from 'antd';
import AppTypography from './typography/Typography';
import { colorVars } from '../theme/colors/colors';

export default function CustomPagination({ current, pageSize, total, onChange, onPageSizeChange }) {
  const start = Math.min((current - 1) * pageSize + 1, total);
  const end = Math.min(current * pageSize, total);

  return (
    <Flex
      align="center"
      justify="space-between"
      className="custom-pagination"
      style={{ color: colorVars.textSecondary }}
    >
      <Space size={5} align="center">
        <AppTypography variant="body" color="secondary">
          Show
        </AppTypography>
        <Select
          value={pageSize}
          size="small"
          style={{ width: 72 }}
          popupMatchSelectWidth={72}
          onChange={(val) => {
            onPageSizeChange(val);
            onChange(1);
          }}
          options={[
            { value: 10, label: '10' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
          ]}
        />
        <AppTypography variant="body" color="secondary">
          / page
        </AppTypography>
      </Space>

      <Space size={16} align="center">
        <AppTypography variant="body" color="secondary">
          {`Showing ${start} - ${end} of ${total}`}
        </AppTypography>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          showSizeChanger={false}
          showQuickJumper={false}
          showLessItems
          onChange={onChange}
        />
      </Space>
    </Flex>
  );
}
