import { useMemo } from 'react';
import {
  Drawer,
  Flex,
  Form,
  Select,
  Space,
  Spin,
  Alert,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AppButton from '../AppButton';
import AppTypography from '../typography/Typography';
import { useDropdownFields } from '../../hooks/useDropdownFields';
import { useDropdownValues } from '../../hooks/useDropdownValues';
import '../../styles/DynamicFieldFilter.css';

const operatorOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' },
  { label: 'Is Empty', value: 'isEmpty' },
  { label: 'Not Empty', value: 'notEmpty' },
];

const defaultFilterRow = { operator: 'and', field: undefined, values: [] };

function getFieldLabel(field) {
  return field.label ?? field.fieldLabel ?? field.name ?? field.fieldName ?? field.value;
}

function getFieldValue(field) {
  return field.value ?? field.field ?? field.fieldName ?? field.name ?? field.label;
}

export default function DynamicFieldFilter({
  moduleName,
  open = false,
  onClose,
  onApply,
}) {
  const [form] = Form.useForm();
  const filterRows = Form.useWatch('filters', form) ?? [];

  // Fetch field list only while drawer is open to avoid unnecessary requests
  const { fields, loading: fieldsLoading, error: fieldsError } = useDropdownFields(
    open ? moduleName : null,
  );

  const apiFields = useMemo(() => (
    (fields ?? [])
      .map((field) => ({
        label: getFieldLabel(field),
        value: getFieldValue(field),
        type: field.type,
      }))
      .filter((field) => field.label && field.value)
  ), [fields]);

  const { valuesByField, loadingFields, fetchValues } = useDropdownValues(moduleName);

  function handleReset() {
    form.setFieldsValue({ filters: [defaultFilterRow] });
  }

  function handleApply() {
    const values = form.getFieldsValue();
    onApply?.({ moduleName, filters: values.filters ?? [] });
    onClose?.();
  }

  function handleFieldChange(rowName, newField) {
    // Clear previously selected values when field changes
    const currentFilters = form.getFieldValue('filters') ?? [];
    form.setFieldValue(
      'filters',
      currentFilters.map((row, index) => (index === rowName ? { ...row, values: [] } : row)),
    );
    // Eagerly load values for the newly selected field
    if (newField) fetchValues(newField);
  }

  return (
    <Drawer
      title={(
        <AppTypography variant="card-title" color="primary">
          Filters
        </AppTypography>
      )}
      placement="right"
      width={720}
      open={open}
      onClose={onClose}
      rootClassName="dynamic-field-filter"
      footer={(
        <Space className="dynamic-field-filter__footer">
          <AppButton onClick={handleReset}>Reset</AppButton>
          <AppButton variant="primary" onClick={handleApply}>Apply</AppButton>
        </Space>
      )}
    >

      {fieldsError && (
        <Alert
          type="error"
          message="Could not load filter fields"
          description={fieldsError}
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Spin spinning={fieldsLoading} tip="Loading fields…">
        <Form
          form={form}
          layout="vertical"
          className="dynamic-field-filter__form"
          initialValues={{ filters: [defaultFilterRow] }}
        >
          <Form.List name="filters">
            {(formFields, { add, remove }) => (
              <Space direction="vertical" className="dynamic-field-filter__rows">
                {formFields.map((formField, index) => {
                  const selectedField = filterRows[index]?.field;
                  const selectedOperator = filterRows[index]?.operator;
                  const disableValues = !selectedField
                    || selectedOperator === 'isEmpty'
                    || selectedOperator === 'notEmpty';

                  const valueOptions = valuesByField[selectedField] ?? [];
                  const valuesLoading = loadingFields.has(selectedField);

                  // Fields already chosen in OTHER rows — disable them in this row's dropdown
                  const usedElsewhere = new Set(
                    filterRows
                      .filter((_, i) => i !== index)
                      .map((r) => r?.field)
                      .filter(Boolean),
                  );

                  const fieldOptions = apiFields.map((f) => ({
                    ...f,
                    disabled: usedElsewhere.has(f.value),
                  }));

                  return (
                    <Space
                      key={formField.key}
                      direction="vertical"
                      className="dynamic-field-filter__row"
                    >
                      {index > 0 && (
                        <Flex justify="center">
                          <Form.Item
                            name={[formField.name, 'operator']}
                            rules={[{ required: true, message: 'Select condition' }]}
                            className="dynamic-field-filter__operator"
                          >
                            <Select options={operatorOptions} placeholder="Condition" />
                          </Form.Item>
                        </Flex>
                      )}

                      <Flex align="end" gap="middle" wrap>
                        <Form.Item
                          label={<AppTypography variant="label" color="secondary">Field</AppTypography>}
                          name={[formField.name, 'field']}
                          rules={[{ required: true, message: 'Select field' }]}
                          style={{ flex: 1, minWidth: 220 }}
                        >
                          <Select
                            allowClear
                            showSearch
                            placeholder="Select field"
                            options={fieldOptions}
                            optionFilterProp="label"
                            loading={fieldsLoading}
                            onChange={(val) => handleFieldChange(formField.name, val)}
                          />
                        </Form.Item>

                        <Form.Item
                          label={<AppTypography variant="label" color="secondary">Values</AppTypography>}
                          name={[formField.name, 'values']}
                          style={{ flex: 1, minWidth: 220 }}
                        >
                          <Select
                            allowClear
                            disabled={disableValues}
                            loading={valuesLoading}
                            mode="multiple"
                            options={valueOptions}
                            placeholder={selectedField ? 'Select values' : 'Select field first'}
                            showSearch
                            // Server-side search — disable client filter, call API on type
                            filterOption={false}
                            onSearch={(search) => {
                              if (selectedField) fetchValues(selectedField, search);
                            }}
                            // Reload full list when dropdown opens (clears any search)
                            onDropdownVisibleChange={(visible) => {
                              if (visible && selectedField) fetchValues(selectedField);
                            }}
                          />
                        </Form.Item>

                        {formFields.length > 1 && (
                          <AppButton
                            variant="danger"
                            htmlType="button"
                            icon={<DeleteOutlined />}
                            aria-label="Remove filter row"
                            onClick={() => remove(formField.name)}
                          />
                        )}
                      </Flex>
                    </Space>
                  );
                })}

                <AppButton
                  htmlType="button"
                  variant="soft"
                  icon={<PlusOutlined />}
                  onClick={() => add(defaultFilterRow)}
                >
                  Add Row
                </AppButton>
              </Space>
            )}
          </Form.List>
        </Form>
      </Spin>

    </Drawer>
  );
}
