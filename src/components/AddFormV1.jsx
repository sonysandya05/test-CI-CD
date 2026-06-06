import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Radio,
    Row,
    Select,
    Space,
    Spin,
    TimePicker,
    Typography,
    Upload,
} from 'antd';
import {
    CalendarOutlined,
    DeleteOutlined,
    DownOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusOutlined,
  SolutionOutlined,
    TagsOutlined,
    UpOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getFormGroups } from '../services/dropdownApi';
import AppBreadcrumb from '../components/Breadcrumb';

const { Text } = Typography;
const { TextArea } = Input;
const emptyGroups = [];

const sectionIcons = [
    <UserOutlined />,
    <EnvironmentOutlined />,
    <SolutionOutlined />,
    <InfoCircleOutlined />,
    <FileTextOutlined />,
];

const fieldIcons = {
    email: <MailOutlined className="v1-input-icon" />,
    contactNumber: <PhoneOutlined className="v1-input-icon" />,
    phone: <PhoneOutlined className="v1-input-icon" />,
    currentLocation: <EnvironmentOutlined className="v1-input-icon" />,
    preferredLocation: <EnvironmentOutlined className="v1-input-icon" />,
    skills: <TagsOutlined className="v1-input-icon" />,
    firstName: <UserOutlined className="v1-input-icon" />,
    lastName: <UserOutlined className="v1-input-icon" />,
};

const truthy = (value) => value === true || value === 1 || value === '1';
const editable = (field) => field?.edit === undefined || truthy(field.edit);

function normalizeOptions(options = []) {
    return options.map((option) => {
        if (typeof option === 'string') return { label: option, value: option };
        return {
            label: option.label ?? option.name ?? option.value,
            value: option.value ?? option.id ?? option.name ?? option.label,
        };
    });
}

function normalizeGroups(formGroups = []) {
    return [...formGroups]
        .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
        .map((group) => ({
            ...group,
            fields: [...(group.fields ?? [])]
                .filter((field) => field.show === undefined || truthy(field.show))
                .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)),
        }))
        .filter((group) => group.fields.length);
}

const empty = (value) => value === undefined || value === null || value === '';

const numberRangeRule = ({ label, message, value, compare, text }) => ({
    validator: (_, input) => {
        if (empty(input)) return Promise.resolve();
        return compare(Number(input), Number(value))
            ? Promise.resolve()
            : Promise.reject(new Error(message ?? `${label} ${text} ${value}`));
    },
});

const validationRulesByType = {
    required: ({ message }) => ({ required: true, message: message ?? 'Mandatory Field' }),
    email: ({ label, message }) => ({ type: 'email', message: message ?? `Enter valid ${label}` }),
    url: ({ label, message }) => ({ type: 'url', message: message ?? `Enter valid ${label}` }),
    number: ({ label, message }) => ({ pattern: /^[0-9]+$/, message: message ?? `${label} must be a number` }),
    phone: ({ message }) => ({ pattern: /^[0-9]{10}$/, message: message ?? 'Phone number must contain exactly 10 digits' }),
    len: ({ label, message, value }) => ({ len: Number(value), message: message ?? `${label} must be ${value} characters` }),
    pattern: ({ label, message, rule }) => ({
        pattern: new RegExp(rule.pattern ?? rule.value, rule.flags),
        message: message ?? `Enter valid ${label}`,
    }),
    min: ({ field, label, message, value }) => (
        field.type === 'number'
            ? numberRangeRule({ label, message, value, compare: (input, min) => input >= min, text: 'must be at least' })
            : { min: Number(value), message: message ?? `${label} must be at least ${value} characters` }
    ),
    max: ({ field, label, message, value }) => (
        field.type === 'number'
            ? numberRangeRule({ label, message, value, compare: (input, max) => input <= max, text: 'must not exceed' })
            : { max: Number(value), message: message ?? `${label} must not exceed ${value} characters` }
    ),
};

function validationToRule(validation, field) {
    const rule = typeof validation === 'string' ? { type: validation } : validation;
    const type = rule.type ?? rule.rule ?? rule.name;
    const value = rule.value ?? rule.length ?? rule.min ?? rule.max;
    const label = field.label ?? field.field ?? 'Field';
    const factory = validationRulesByType[type];

    return factory
        ? factory({ field, label, message: rule.message, rule, value })
        : rule;
}

function getRules(field) {
    const label = field.label ?? field.field ?? 'Field';
    const apiRules = field.validations ?? field.validation ?? field.rules ?? [];
    const hasApiRequired = apiRules.some((rule) => (typeof rule === 'string' ? rule : rule?.type) === 'required');
    const hasApiEmail = apiRules.some((rule) => (typeof rule === 'string' ? rule : rule?.type) === 'email');
    const rules = [];

    if (truthy(field.req) && !hasApiRequired) rules.push({ required: true, message: 'Mandatory Field' });
    if (field.type === 'email' && !hasApiEmail) rules.push({ type: 'email', message: `Enter valid ${label}` });
    if (field.type === 'number') rules.push({ pattern: /^[0-9]+$/, message: `${label} must be a number` });

    return [
        ...rules,
        ...apiRules.map((rule) => validationToRule(rule, field)),
    ];
}

function getValidationValue(field, type) {
    const rules = field.validations ?? field.validation ?? field.rules ?? [];
    const rule = rules.find((item) => (typeof item === 'string' ? item : item?.type) === type);
    if (!rule || typeof rule === 'string') return undefined;
    return rule.value ?? rule.length ?? rule[type];
}

function getInputLimits(field) {
    const len = field.len ?? getValidationValue(field, 'len');
    const min = field.min ?? getValidationValue(field, 'min');
    const max = field.max ?? getValidationValue(field, 'max');

    if (field.type === 'number') {
        return {
            min: min ?? undefined,
            max: max ?? undefined,
        };
    }

    return {
        minLength: min ?? undefined,
        maxLength: field.maxLength ?? len ?? max ?? undefined,
    };
}

function cleanValue(value, formatter) {
    if (!formatter) return value;
    if (formatter === 'phone' || formatter === 'digits') return value.replace(/\D/g, '').slice(0, 10);
    if (formatter === 'email' || formatter === 'noSpaces') return value.replace(/\s/g, '');
    if (formatter === 'name') return value.replace(/\s+/g, ' ').trimStart().replace(/\b\w/g, (char) => char.toUpperCase());
    return value;
}

function FieldControl({ field, form, name }) {
    const type = field.type ?? 'text';
    const disabled = !editable(field);
    const options = normalizeOptions(field.options ?? field.values ?? []);
    const placeholder = field.placeholder ?? `${type === 'select' ? 'Select' : 'Enter'} ${String(field.label ?? '').toLowerCase()}`;
    const inputLimits = getInputLimits(field);
    const validateField = () => {
        setTimeout(() => {
            form.validateFields([name]).catch(() => { });
        });
    };

    const inputProps = {
        ...inputLimits,
        disabled,
    placeholder,
    prefix: field.icon ? null : fieldIcons[field.field],
    onChange: (event) => {
      const value = field.formatter
        ? cleanValue(event.target.value, field.formatter)
        : event.target.value;

      form.setFieldValue(name, value);
      validateField();
    },
  };

    if (type === 'select') {
        return (
            <Select
                allowClear
                disabled={disabled}
                options={options}
                placeholder={placeholder}
                onChange={validateField}
            />
        );
    }
    if (type === 'radio') return <Radio.Group disabled={disabled} options={options} onChange={validateField} />;
    if (type === 'checkbox') {
        return (
            <Checkbox disabled={disabled} onChange={validateField}>
                {field.checkboxLabel ?? field.label}
            </Checkbox>
        );
    }
    if (type === 'textarea') return <TextArea {...inputProps} rows={field.rows ?? 3} />;
    if (type === 'date') {
        return (
            <DatePicker
                disabled={disabled}
                placeholder={placeholder}
                style={{ width: '100%' }}
                suffixIcon={<CalendarOutlined />}
                onChange={validateField}
            />
        );
    }
    if (type === 'time') return <TimePicker disabled={disabled} placeholder={placeholder} style={{ width: '100%' }} onChange={validateField} />;
    if (type === 'file') {
        return (
            <Upload beforeUpload={() => false} maxCount={field.maxCount ?? 1}>
                <Button icon={<PlusOutlined />}>{field.buttonLabel ?? 'Upload'}</Button>
            </Upload>
        );
    }

    return <Input {...inputProps} type={type === 'number' ? 'number' : type} />;
}

function SectionTitle({ icon, title }) {
    return (
        <Space size={10} align="center">
            <div className="v1-section-icon-box">{icon}</div>
            <Text strong className="v1-section-label">{title}</Text>
        </Space>
    );
}

export default function AddFormV1({
    moduleName,
    formGroups: providedFormGroups,
    loading: providedLoading = false,
    error: providedError = '',
    breadcrumbItems = [],
    submitText = 'Create',
    cancelPath = '/candidates',
    onSubmit,
}) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [collapsed, setCollapsed] = useState({});
    const [apiFormGroups, setApiFormGroups] = useState([]);
    const [apiLoading, setApiLoading] = useState(Boolean(moduleName));
    const [apiError, setApiError] = useState('');
    const formGroups = moduleName ? apiFormGroups : (providedFormGroups ?? emptyGroups);
    const loading = moduleName ? apiLoading : providedLoading;
    const error = moduleName ? apiError : providedError;
    const groups = useMemo(() => normalizeGroups(formGroups), [formGroups]);

    useEffect(() => {
        if (!moduleName) return undefined;

        let cancelled = false;

        async function fetchFormGroups() {
            try {
                setApiLoading(true);
                setApiError('');
                const data = await getFormGroups({ module: moduleName });
                if (!cancelled) setApiFormGroups(data);
            } catch (err) {
                console.error(`Failed to fetch ${moduleName} form groups:`, err);
                if (!cancelled) setApiError(err?.message || 'Failed to fetch form groups');
            } finally {
                if (!cancelled) setApiLoading(false);
            }
        }

        fetchFormGroups();

        return () => {
            cancelled = true;
        };
    }, [moduleName]);

    const toggle = (key) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
    const submit = (values) => (onSubmit ? onSubmit(values) : console.log('Form values:', values));

    const renderField = (field, namePrefix) => {
        const name = namePrefix ? [namePrefix, field.field] : field.field;
        const valuePropName = field.type === 'checkbox' ? 'checked' : field.type === 'file' ? 'fileList' : 'value';

        return (
            <Col key={field.field} xs={24} md={field.col ?? 12}>
                <Form.Item
                    label={field.type === 'checkbox' ? '' : field.label}
                    name={name}
                    rules={getRules(field)}
                    valuePropName={valuePropName}
                    getValueFromEvent={field.type === 'file' ? (event) => event?.fileList : undefined}
                    validateTrigger={['onBlur', 'onChange']}
                >
                    <FieldControl field={field} form={form} name={name} />
                </Form.Item>
            </Col>
        );
    };

    const renderGroup = (group, index) => {
        const key = group.name ?? group.id ?? String(index);
        const body = group.addRow ? (
            <Form.List name={group.name ?? key}>
                {(rows, { add, remove }) => (
                    <>
                        <Button type="link" icon={<PlusOutlined />} onClick={() => add()}>
                            {group.addLabel ?? `Add ${group.label ?? 'Row'}`}
                        </Button>
                        {rows.map(({ key: rowKey, name }) => (
                            <Row key={rowKey} gutter={[24, 0]} align="top">
                                {group.fields.map((field) => renderField(field, name))}
                                <Col xs={24} md={2}>
                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                </Col>
                            </Row>
                        ))}
                    </>
                )}
            </Form.List>
        ) : (
            <Row gutter={[24, 0]}>{group.fields.map((field) => renderField(field))}</Row>
        );

        return (
            <Card
                key={key}
                className="v1-card"
                title={<SectionTitle icon={sectionIcons[index % sectionIcons.length]} title={group.label ?? group.name ?? 'Details'} />}
                extra={(
                    <Button
                        type="text"
                        size="small"
                        icon={collapsed[key] ? <DownOutlined /> : <UpOutlined />}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggle(key);
                        }}
                    />
                )}
            >
                <div style={{ display: collapsed[key] ? 'none' : 'block' }}>{body}</div>
            </Card>
        );
    };

    return (
        <main>
            {breadcrumbItems.length > 0 && <AppBreadcrumb items={breadcrumbItems} />}
            <div className="v1-page">
                <div className="v1-page-inner">
          <Spin spinning={loading} description="Loading form fields...">
                        <Form
                            form={form}
                            layout="vertical"
                            colon={false}
                            className="v1-form"
                            requiredMark={(label, { required }) => (
                                <>
                                    {label}
                                    {required && <span className="v1-required-mark"> *</span>}
                                </>
                            )}
                            onFinish={submit}
                        >
                            {groups.map(renderGroup)}
                            {!loading && !error && groups.length === 0 && (
                                <Alert type="info" showIcon message="No form fields are configured." />
                            )}
                        </Form>
                    </Spin>
                </div>

                <div className="v1-footer">
                    <Text type="secondary">All Unsaved Changes will be lost if you cancel and reload.</Text>
                    <Space size={12}>
                        <Button onClick={() => navigate(cancelPath)}>Cancel</Button>
                        <Button type="primary" onClick={() => form.submit()} disabled={loading || !groups.length}>
                            {submitText}
                        </Button>
                    </Space>
                </div>
            </div>
        </main>
    );
}
