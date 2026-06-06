import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoComplete, Button, Card, Col, Form, Input, Modal, Row, Select, Space, Typography, message } from 'antd';
import {
  FileTextOutlined,
  PlusOutlined,
  ProfileOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import AppBreadcrumb from '../../components/Breadcrumb';
import AppCard from '../../components/cards/AppCard';
import { addTestFlow, addTestingOption, getTestFlows, getTestingOptions } from '../../services/dropdownApi';
import { zinnextActionOptions } from '../../services/dropdownValues/testPageValues';

const { Text } = Typography;

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Test Cases', href: '/test-cases' },
];

const initialValues = {
  tags: 'regression',
  active: 1,
};

const testingOptionTypes = {
  module: {
    dbName: 'Modules',
    formField: 'module',
    label: 'Module',
  },
};

function toSelectOptions(items = []) {
  return items.map((item) => ({
    value: item,
    label: item,
  }));
}

function normalizeText(value = '') {
  return String(value ?? '').trim();
}

function normalizeLowerText(value = '') {
  return normalizeText(value).toLowerCase();
}

function getUniqueFlowOptions(rows = []) {
  const flowMap = new Map();

  rows.forEach((row) => {
    const flow = normalizeText(row?.flow);
    const key = flow.toLowerCase();

    if (flow && !flowMap.has(key)) {
      flowMap.set(key, flow);
    }
  });

  return Array.from(flowMap.values()).map((flow) => ({
    value: flow,
    label: flow,
  }));
}

function getNextStepOrder(rows = [], module, flow) {
  const selectedModule = normalizeText(module).toLowerCase();
  const selectedFlow = normalizeText(flow).toLowerCase();
  const lastStepOrder = rows.reduce((maxStepOrder, row) => {
    const rowModule = normalizeText(row?.module).toLowerCase();
    const rowFlow = normalizeText(row?.flow).toLowerCase();

    if (rowModule !== selectedModule || rowFlow !== selectedFlow) {
      return maxStepOrder;
    }

    const stepOrder = Number(row?.step_order) || 0;
    return Math.max(maxStepOrder, stepOrder);
  }, 0);

  return lastStepOrder + 1;
}

function SectionTitle({ icon, title }) {
  return (
    <Space size={10} align="center">
      <div className="v1-section-icon-box">{icon}</div>
      <Text strong className="v1-section-label">{title}</Text>
    </Space>
  );
}

export default function TestForm() {
  const [form] = Form.useForm();
  const [optionForm] = Form.useForm();
  const [moduleItems, setModuleItems] = useState([]);
  const [flowRows, setFlowRows] = useState([]);
  const [flowOptions, setFlowOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [flowsLoading, setFlowsLoading] = useState(false);
  const [optionModal, setOptionModal] = useState({ open: false, typeKey: 'module' });
  const [optionSaving, setOptionSaving] = useState(false);
  const [stepOrderLoading, setStepOrderLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const selectedOptionType = testingOptionTypes[optionModal.typeKey];
  const moduleOptions = useMemo(() => toSelectOptions(moduleItems), [moduleItems]);
  const selectedModule = Form.useWatch('module', form);
  const selectedFlow = Form.useWatch('flow', form);
  const hasSelectedModule = Boolean(normalizeText(selectedModule));
  const hasSelectedFlow = Boolean(normalizeText(selectedFlow));
  const areFlowFieldsDisabled = !hasSelectedModule;
  const areDetailsDisabled = !hasSelectedModule || !hasSelectedFlow;

  const setItemsByType = (typeKey, items = []) => {
    if (typeKey === 'module') {
      setModuleItems(items);
    }
  };

  const loadTestingOptions = async () => {
    setOptionsLoading(true);

    try {
      const modulesResponse = await getTestingOptions(testingOptionTypes.module.dbName);

      setModuleItems(modulesResponse?.items ?? []);
    } catch (error) {
      console.error('Unable to load testing options:', error);
      message.error('Unable to load testing options.');
    } finally {
      setOptionsLoading(false);
    }
  };

  const loadModuleFlows = useCallback(async (module) => {
    const normalizedModule = normalizeText(module);

    setFlowRows([]);
    setFlowOptions([]);
    form.setFieldsValue({ step_order: undefined });

    if (!normalizedModule) return;

    setFlowsLoading(true);

    try {
      const response = await getTestFlows({ limit: 10000, offset: 0, module: normalizedModule });
      const rows = Array.isArray(response?.items) ? response.items : [];

      setFlowRows(rows);
      setFlowOptions(getUniqueFlowOptions(rows));
    } catch (error) {
      console.error('Unable to load flows:', error);
      message.error('Unable to load flows.');
    } finally {
      setFlowsLoading(false);
    }
  }, [form]);

  const loadNextStepOrder = useCallback(async (module, flow, rows) => {
    const normalizedModule = normalizeText(module);
    const normalizedFlow = normalizeText(flow);

    if (!normalizedModule || !normalizedFlow) {
      form.setFieldsValue({ step_order: undefined });
      return;
    }

    setStepOrderLoading(true);

    try {
      form.setFieldsValue({ step_order: getNextStepOrder(rows, normalizedModule, normalizedFlow) });
    } catch (error) {
      console.error('Unable to load step order:', error);
      message.error('Unable to load step order.');
    } finally {
      setStepOrderLoading(false);
    }
  }, [form]);

  useEffect(() => {
    Promise.resolve().then(loadTestingOptions);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => loadModuleFlows(selectedModule));
  }, [loadModuleFlows, selectedModule]);

  useEffect(() => {
    Promise.resolve().then(() => loadNextStepOrder(selectedModule, selectedFlow, flowRows));
  }, [flowRows, loadNextStepOrder, selectedFlow, selectedModule]);

  const onFinish = async (values) => {
    const payload = {
      module: normalizeText(values.module),
      flow: normalizeText(values.flow),
      step_order: Number(values.step_order),
      description: normalizeText(values.description),
      keyword: normalizeLowerText(values.keyword),
      target: normalizeText(values.target),
      value: normalizeText(values.value),
      expected: normalizeText(values.expected),
      tags: values.tags ? normalizeText(values.tags) : initialValues.tags,
      active: Number(values.active),
    };

    setSubmitting(true);
    try {
      await addTestFlow(payload);
      message.success('Test case details saved successfully.');
      form.resetFields();
      setFlowRows([]);
      setFlowOptions([]);
    } catch (error) {
      console.error('Unable to save test case:', error);
      message.error('Unable to save test case.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeExtraSpaces = (fieldName, value) => {
    form.setFieldsValue({
      [fieldName]: normalizeText(value),
    });
  };

  const handleModuleChange = (value) => {
    form.setFieldsValue({
      module: normalizeText(value),
      flow: undefined,
      step_order: undefined,
      keyword: undefined,
      description: undefined,
      target: undefined,
      tags: initialValues.tags,
      value: undefined,
      expected: undefined,
    });
  };

  const handleFlowChange = (value) => {
    form.setFieldsValue({
      flow: normalizeText(value),
      step_order: undefined,
    });
  };

  const openOptionModal = (typeKey) => {
    const optionType = testingOptionTypes[typeKey];

    setOptionModal({ open: true, typeKey });
    optionForm.setFieldsValue({
      name: '',
      type: optionType.label,
    });
  };

  const closeOptionModal = () => {
    setOptionModal((current) => ({ ...current, open: false }));
    optionForm.resetFields();
  };

  const saveTestingOption = async () => {
    try {
      const values = await optionForm.validateFields();
      const name = normalizeText(values.name);
      const response = await addTestingOption({
        name,
        type: selectedOptionType.dbName,
      });

      setItemsByType(optionModal.typeKey, response?.items ?? []);
      form.setFieldsValue({ [selectedOptionType.formField]: name });
      message.success(`${selectedOptionType.label} added successfully.`);
      closeOptionModal();
    } catch (error) {
      if (error?.errorFields) return;

      console.error('Unable to save testing option:', error);
      message.error(`Unable to add ${selectedOptionType.label.toLowerCase()}.`);
    } finally {
      setOptionSaving(false);
    }
  };

  const submitTestingOption = () => {
    setOptionSaving(true);
    saveTestingOption();
  };

  return (
    <main className="jobs-list-page">
<Row align="middle" justify="space-between" className="breadcrumb-action-wrapper">
  <Col>
    <AppBreadcrumb items={breadcrumbItems} />
  </Col>

  <Col>
    <Button type="link" onClick={() => navigate('/zinnext-home')}>
      View Table
    </Button>
  </Col>
</Row>

      <div className="v1-page">
        <div className="v1-page-inner">
          <div className="v1-page-header">
            <Space align="center" size={10}>
              <ProfileOutlined className="v1-outer-icon" />
              <div>
                <Text strong style={{ fontSize: 16 }}>Add Test Case</Text>
              </div>
            </Space>
          </div>

          <AppCard>
            <Form
              form={form}
              className="v1-form"
              layout="vertical"
              colon={false}
              requiredMark={(label, { required }) => (
                <>
                  {label}
                  {required && <span className="v1-required-mark"> *</span>}
                </>
              )}
              initialValues={initialValues}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Card
                className="v1-card"
                title={<SectionTitle icon={<FileTextOutlined />} title="Test Case Details" />}
                extra={
                  <Text type="secondary" className="v1-card-subtitle">
                    Module, flow, step order and execution data
                  </Text>
                }
              >
                <Row gutter={[24, 0]}>
                  <Col xs={24} md={12}>
                    <Space.Compact style={{ width: '100%' }}>
                      <Form.Item
                        label="Module"
                        name="module"
                        style={{ flex: 1 }}
                      >
                        <Select
                          allowClear
                          showSearch
                          loading={optionsLoading}
                          optionFilterProp="label"
                          placeholder="Select module"
                          options={moduleOptions}
                          onChange={handleModuleChange}
                        />
                      </Form.Item>
                      <Button
                        aria-label="Add module"
                        icon={<PlusOutlined />}
                        style={{ marginTop: 30 }}
                        onClick={() => openOptionModal('module')}
                      />
                    </Space.Compact>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Flow"
                      name="flow"
                    >
                      <AutoComplete
                        maxLength={100}
                        allowClear
                        disabled={areFlowFieldsDisabled}
                        options={flowOptions}
                        placeholder={flowsLoading ? 'Loading flows' : 'Enter flow'}
                        onChange={handleFlowChange}
                        filterOption={(inputValue, option) =>
                          option?.value?.toLowerCase().includes(inputValue.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Step Order"
                      name="step_order"
                      validateTrigger={['onBlur', 'onChange']}
                    >
                      <Input
                        maxLength={10}
                        disabled
                        placeholder={stepOrderLoading ? 'Loading step order' : 'Step order'}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Action"
                      name="keyword"
                    >
                      <Select
                        allowClear
                        showSearch
                        disabled={areDetailsDisabled}
                        optionFilterProp="label"
                        placeholder="Select action"
                        options={zinnextActionOptions}
                        onChange={(value) => form.setFieldsValue({ keyword: normalizeLowerText(value) })}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Description"
                      name="description"
                    >
                      <Input.TextArea
                        rows={3}
                        maxLength={255}
                        disabled={areDetailsDisabled}
                        placeholder="Enter description"
                        showCount
                        onBlur={(e) => removeExtraSpaces('description', e.target.value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Key"
                      name="target"
                    >
                      <Input
                        maxLength={255}
                        disabled={areDetailsDisabled}
                        placeholder="Enter target"
                        onBlur={(e) => removeExtraSpaces('target', e.target.value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tags"
                      name="tags"
                    >
                      <Input
                        maxLength={200}
                        disabled={areDetailsDisabled}
                        placeholder="Enter tags"
                        prefix={<TagsOutlined className="v1-input-icon" />}
                        onBlur={(e) => removeExtraSpaces('tags', e.target.value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Value"
                      name="value"
                    >
                      <Input.TextArea
                        rows={4}
                        disabled={areDetailsDisabled}
                        placeholder="Enter value"
                        onBlur={(e) => removeExtraSpaces('value', e.target.value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Expected"
                      name="expected"
                    >
                      <Input.TextArea
                        rows={4}
                        disabled={areDetailsDisabled}
                        placeholder="Enter expected result"
                        onBlur={(e) => removeExtraSpaces('expected', e.target.value)}
                      />
                    </Form.Item>
                  </Col>

                  {/* <Col xs={24} md={12}>
                    <Form.Item label="Active" name="active">
                      <Select
                        suffixIcon={<CheckCircleOutlined />}
                        options={[
                          { value: 1, label: 'Active' },
                          { value: 0, label: 'Inactive' },
                        ]}
                      />
                    </Form.Item>
                  </Col> */}
                </Row>
              </Card>
                <div className="v1-form-actions">
                    <Form.Item>
                        <Space>
                        <Button type="primary" htmlType="submit" loading={submitting} disabled={areDetailsDisabled}>
                            Submit
                        </Button>
                        <Button onClick={() => {
                          form.resetFields();
                          setFlowRows([]);
                          setFlowOptions([]);
                        }}
                        >
                            Reset
                        </Button>
                        </Space>
                    </Form.Item>
                </div>
            </Form>
          </AppCard>

          <Modal
            title={`Add ${selectedOptionType.label}`}
            open={optionModal.open}
            confirmLoading={optionSaving}
            okText="Add"
            onCancel={closeOptionModal}
            onOk={submitTestingOption}
            destroyOnHidden
          >
            <Form
              form={optionForm}
              layout="vertical"
              colon={false}
              className="v1-form"
              requiredMark={(label, { required }) => (
                <>
                  {label}
                  {required && <span className="v1-required-mark"> *</span>}
                </>
              )}
            >
              <Form.Item
                label="Name"
                name="name"
              >
                <Input
                  maxLength={100}
                  placeholder={`Enter ${selectedOptionType.label.toLowerCase()} name`}
                  onBlur={(e) => {
                    optionForm.setFieldsValue({
                      name: normalizeText(e.target.value),
                    });
                  }}
                />
              </Form.Item>

              <Form.Item label="Type" name="type">
                <Input disabled />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </main>
  );
}
