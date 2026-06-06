import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons';

const { Text } = Typography;

const defaultStats = [
  { label: 'Total Jobs', value: 1697, icon: 'fileText' },
  { label: 'Active Jobs', value: 1685, icon: 'checkCircle' },
  { label: 'My Jobs', value: 600, icon: 'user' },
];

const iconByName = {
  fileText: <FileTextOutlined />,
  checkCircle: <CheckCircleOutlined />,
  user: <UserOutlined />,
  filter: <FilterOutlined />,
};

export default function StatsCards({ stats = defaultStats }) {
  return (
    <Card>
      <Row gutter={[12, 12]}>
        {stats.map(s => (
          <Col key={s.label} xs={24} sm={24} md={8} lg={8} xl={8}>
            <Card className="stats-inner-card">
              <Space align="center">
                {iconByName[s.icon] ?? iconByName.fileText}
                <Text>{s.label}</Text>
              </Space>
              <Statistic value={s.value} />
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
