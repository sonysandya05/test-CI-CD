import { Card, Col, Form, Input, Row, Select, Space, Tooltip, Typography } from 'antd';
import { BankOutlined, InfoCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const defaultClientDetails = {
  subtitle: 'Basic client and contact information for this job',
  helperText: 'Select a client to view and complete the remaining job details.',
  values: {},
  options: {},
};

function toSelectOptions(options = []) {
  return options.map((option) => ({ label: option, value: option }));
}

export default function ClientDetailsCard({ data = defaultClientDetails }) {
  const details = {
    ...defaultClientDetails,
    ...data,
    values: data.values ?? defaultClientDetails.values,
    options: data.options ?? defaultClientDetails.options,
  };

  return (
    <Card
      className="client-details-card"
      title={
        <Space size={8} align="center">
          <BankOutlined className="cd-title-icon" />
          <Title level={5} className="cd-title-text">Client Details</Title>
        </Space>
      }
      extra={
        <Text className="cd-card-subtitle">
          {details.subtitle}
        </Text>
      }
    >
      <Form layout="horizontal" colon={false} className="cd-form">

        {/* Row 1: Name + Client Req ID */}
        <Row gutter={[32, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Text className="cd-label">*Name</Text>}
              className="cd-form-item"
            >
              <div className="cd-name-wrapper">
                <div className="cd-input-row">
                  <div className="cd-select-wrapper">
                    <BankOutlined className="cd-select-prefix-icon" />
                    <Select
                      className="cd-select"
                      defaultValue={details.values.clientName}
                      options={toSelectOptions(details.options.clientName)}
                    />
                  </div>
                  <PlusOutlined className="cd-add-icon" />
                </div>
                <div className="cd-helper">
                  <InfoCircleOutlined className="cd-helper-icon" />
                  <Text className="cd-helper-text">
                    {details.helperText}
                  </Text>
                </div>
              </div>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <div className="cd-label-group">
                  <Text className="cd-label">* Client Req ID</Text>
                  <Tooltip title="Client requisition identifier">
                    <InfoCircleOutlined className="cd-info-icon" />
                  </Tooltip>
                </div>
              }
              className="cd-form-item"
            >
              <Input className="cd-input" defaultValue={details.values.clientReqId} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: Contact Person + End Client */}
        <Row gutter={[32, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Text className="cd-label">Contact Person</Text>}
              className="cd-form-item"
            >
              <Select
                className="cd-input"
                defaultValue={details.values.contactPerson}
                options={toSelectOptions(details.options.contactPerson)}
                suffixIcon={<UserOutlined style={{ color: '#9ca3af' }} />}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={<Text className="cd-label">End Client</Text>}
              className="cd-form-item"
            >
              <Input className="cd-input" defaultValue={details.values.endClient} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: Client Location + Account Manager */}
        <Row gutter={[32, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<Text className="cd-label">Client Location</Text>}
              className="cd-form-item"
            >
              <Input className="cd-input" defaultValue={details.values.clientLocation} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={<Text className="cd-label">Account Manager</Text>}
              className="cd-form-item"
            >
              <Select
                className="cd-input"
                defaultValue={details.values.accountManager}
                options={toSelectOptions(details.options.accountManager)}
                suffixIcon={<UserOutlined style={{ color: '#9ca3af' }} />}
              />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Card>
  );
}
