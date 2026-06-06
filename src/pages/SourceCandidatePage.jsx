import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import {
    Row,
    Col,
    Tabs,
    Input,
    Select,
    Checkbox,
    Space,
    Typography,
    Tag,
    Form,
    message,
    Spin,
} from 'antd';

import {
    SearchOutlined,
    FilterOutlined,
    FileTextOutlined,
    RobotOutlined,
    UpOutlined,
    DownOutlined,
    GlobalOutlined,
    ApartmentOutlined,
    TeamOutlined,
    InboxOutlined,
    UserOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    DollarCircleOutlined,
    BankOutlined,
} from '@ant-design/icons';

import AppButton from '../components/AppButton';
import AppCard from '../components/cards/AppCard';
import AppBreadcrumb from '../components/Breadcrumb';
import { getJobById } from '../services/jobsApi';
import { getJobs } from '../services/dropdownApi';
import { validationRules, formatters } from '../components/form/validation';

const { Text, Title } = Typography;

const createdDateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' },
];

const searchPreferenceOptions = ['All', 'Internal', 'Dice', 'Network'];

function getJobFromApiResponse(response) {
    return response?.data?.joblist?.[0]
        || response?.joblist?.[0]
        || response?.data?.data?.joblist?.[0]
        || response?.data?.job
        || response?.job
        || response?.data
        || {};
}

export default function SourceCandidatePage() {
    const [form] = Form.useForm();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [job, setJob] = useState(location.state?.job || {});
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const jobId =
        searchParams.get('id') ||
        searchParams.get('jobId') ||
        location.state?.job?._id;

    const jobTabs = [
        {
            key: 'candidates',
            label: (
                <Space>
                    <UserOutlined />
                    Candidates
                </Space>
            ),
        },
    ];

    const candidateTabs = [
        {
            key: 'source',
            label: (
                <Space>
                    <GlobalOutlined />
                    Source
                </Space>
            ),
        },
        // {
        //     key: 'pipeline',
        //     label: (
        //         <Space>
        //             <ApartmentOutlined />
        //             Pipeline ({job?.hiringProgress?.pipeline || 0})
        //         </Space>
        //     ),
        // },
        // {
        //     key: 'shortlisted',
        //     label: (
        //         <Space>
        //             <TeamOutlined />
        //             Shortlisted ({job?.hiringProgress?.shortlisted || 0})
        //         </Space>
        //     ),
        // },
        // {
        //     key: 'submitted',
        //     label: (
        //         <Space>
        //             <InboxOutlined />
        //             Submitted ({job?.hiringProgress?.submitted || job?.submissionCount || 0})
        //         </Space>
        //     ),
        // },
    ];

    const locationOptions = [
        job?.jobLocation && { value: job.jobLocation, label: job.jobLocation },
        { value: 'onsite', label: 'Onsite' },
        { value: 'remote', label: 'Remote' },
        { value: 'hybrid', label: 'Hybrid' },
    ].filter(Boolean);

    const clientName = job?.clientInfo?.clientName || '-';
    const mspId = job?.mspreqId || job?.clientJobReferenceId || '-';
    const jobTitle = job?.jobTitle || '';
    const jobLocation = job?.jobLocation || '';
    const status = job?.jobStatus || 'active';

    const experience = job?.experience?.from
        ? `${job.experience.from}${job.experience.to ? ` - ${job.experience.to}` : ''} years`
        : '';

    const workMode = Array.isArray(job?.jobRemoteStatus)
        ? job.jobRemoteStatus.join(', ')
        : '';

    const clientRate = job?.jobPayDetails?.clientBudgetStart
        ? `${job.jobPayDetails.clientBudgetCurrencySymbol || '$'}${job.jobPayDetails.clientBudgetStart}/${job.jobPayDetails.clientBudgetUnit || 'Hour'}`
        : '-';

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: `ZNXTJOB${mspId}`, href: `/job-detailedView?id=${job?._id || ''}` },
        { label: 'Source Candidates' },
    ];

    const initialFormValues = {
        keyword: '',
        createdDate: undefined,
        location: jobLocation || undefined,
        jobTitle,
        skills: '',
        experience: {
            from: job?.experience?.from || '',
            to: job?.experience?.to || '',
        },
        searchPreference: ['All', 'Internal'],
    };

    useEffect(() => {
        let isMounted = true;

        async function fetchJob() {
            try {
                setLoading(true);

                if (location.state?.job) {
                    setJob(location.state.job);
                    return;
                }

                if (jobId) {
                    try {
                        const detailRes = await getJobById(jobId);
                        console.log('Job Detail API Response:', detailRes);

                        const detailJob = getJobFromApiResponse(detailRes);

                        if (isMounted && detailJob?._id) {
                            setJob(detailJob);
                            return;
                        }
                    } catch (error) {
                        console.log('Detail API failed, loading from list API:', error);
                    }
                }

                const listRes = await getJobs({ limit: 1, offset: 0 });
                console.log('Jobs List API Response:', listRes);

                const firstJob = getJobFromApiResponse(listRes);

                if (isMounted) {
                    setJob(firstJob || {});
                }
            } catch (error) {
                console.log('Job fetch failed:', error);
                message.error('Failed to fetch job details');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchJob();

        return () => {
            isMounted = false;
        };
    }, [jobId, location.state]);

    useEffect(() => {
        form.setFieldsValue(initialFormValues);
    }, [job]);

    const handleSearch = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                jobId: job?._id,
                clientId: job?.clientId,
                clientName,
                mspreqId: mspId,
                keyword: values.keyword,
                createdDate: values.createdDate,
                location: values.location,
                jobTitle: values.jobTitle,
                skills: values.skills,
                experienceFrom: values.experience?.from,
                experienceTo: values.experience?.to,
                searchPreference: values.searchPreference,
            };

            console.log('Source Candidate Search Payload:', payload);
            message.success('Search applied successfully');
        } catch {
            message.error('Please fill all mandatory fields correctly');
        }
    };

    const handleReset = () => {
        form.resetFields();
        form.setFieldsValue(initialFormValues);
        message.success('Filters reset successfully');
    };

    return (
        <main>
            <Spin spinning={loading}>
                <Space direction="vertical" size={16} block>
                    <AppBreadcrumb items={breadcrumbItems} />
                    <AppCard variant="flat">
                        <Row justify="space-between" align="top" gutter={[24, 16]}>
                            <Col xs={24} lg={16}>
                                <Space direction="vertical" size={8}>
                                    <Text type="secondary">
                                        {clientName} - MSP ID {mspId}
                                    </Text>

                                    <Space size={8} wrap>
                                        <Title level={4}>{jobTitle || 'Job Title Not Available'}</Title>
                                        <Tag color={status === 'active' ? 'success' : 'default'}>
                                            {status}
                                        </Tag>
                                    </Space>

                                    <Space size={18} wrap>
                                        <Text type="secondary">
                                            <Space size={4}>
                                                <EnvironmentOutlined />
                                                {jobLocation || '-'}
                                            </Space>
                                        </Text>

                                        <Text type="secondary">
                                            <Space size={4}>
                                                <ClockCircleOutlined />
                                                {experience || '-'}
                                            </Space>
                                        </Text>

                                        <Text type="secondary">
                                            <Space size={4}>
                                                <BankOutlined />
                                                {(job?.employmentType || '-').toUpperCase()} · {workMode || '-'}
                                            </Space>
                                        </Text>

                                        <Text type="secondary">
                                            <Space size={4}>
                                                <DollarCircleOutlined />
                                                Client rate: {clientRate}
                                            </Space>
                                        </Text>
                                    </Space>

                                    <Tabs defaultActiveKey="candidates" items={jobTabs} />
                                </Space>
                            </Col>

                            <Col xs={24} lg={6}>
                                <Space direction="vertical" align="end" size={16}>
                                    <Space size={32} wrap>
                                        <Space direction="vertical" align="center" size={2}>
                                            <Text type="secondary">Target submissions</Text>
                                            <Text strong>{job?.targetSubmission || 0}</Text>
                                        </Space>

                                        <Space direction="vertical" align="center" size={2}>
                                            <Text type="secondary">In Pipeline</Text>
                                            <Text strong>{job?.hiringProgress?.pipeline || 0}</Text>
                                        </Space>
                                    </Space>

                                    <Text type="secondary">
                                        Created {job?.createdAt || '-'}
                                    </Text>
                                </Space>
                            </Col>
                        </Row>
                    </AppCard>

                    <AppCard variant="flat">
                        <Tabs defaultActiveKey="source" items={candidateTabs} />
                    </AppCard>

                    <AppCard
                        variant="flat"
                        title="Build Your Search Query"
                        icon={<SearchOutlined />}
                        extra={(
                            <Space wrap>
                                <AppButton type="text" icon={<FilterOutlined />} onClick={handleReset}>
                                    Reset filters
                                </AppButton>

                                <AppButton icon={<SearchOutlined />} variant="primary" onClick={handleSearch}>
                                    Search
                                </AppButton>

                                <AppButton icon={<RobotOutlined />} variant="soft" onClick={handleSearch}>
                                    AI Search
                                </AppButton>

                                <AppButton icon={<FileTextOutlined />}>
                                    Job Description
                                </AppButton>

                                <AppButton
                                    type="text"
                                    icon={collapsed ? <DownOutlined /> : <UpOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                />
                            </Space>
                        )}
                    >
                        {!collapsed && (
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={initialFormValues}
                                validateTrigger={['onBlur', 'onChange']}
                            >
                                <Row gutter={[24, 8]}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="keyword"
                                            rules={[
                                                validationRules.required('Keyword'),
                                                validationRules.remarks(),
                                            ]}
                                        >
                                            <Input
                                                prefix={<SearchOutlined />}
                                                placeholder='Enter keyword, e.g., Java OR (J2EE AND "Apache Kafka")'
                                                onChange={(event) =>
                                                    form.setFieldsValue({
                                                        keyword: formatters.removeExtraSpaces(event.target.value),
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Created Date"
                                            name="createdDate"
                                            rules={[validationRules.required('Created Date')]}
                                        >
                                            <Select
                                                allowClear
                                                placeholder="Select created date"
                                                options={createdDateOptions}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Location"
                                            name="location"
                                            rules={[validationRules.required('Location')]}
                                        >
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder="Select location"
                                                options={locationOptions}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Job Title"
                                            name="jobTitle"
                                            rules={[
                                                validationRules.required('Job Title'),
                                                validationRules.alphanumeric(),
                                            ]}
                                        >
                                            <Input placeholder="Enter job title" />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Skills"
                                            name="skills"
                                            rules={[
                                                validationRules.required('Skills'),
                                                validationRules.remarks(),
                                            ]}
                                        >
                                            <Input placeholder="Enter skills" />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item label="Experience in Years" required>
                                            <Row gutter={[12, 0]}>
                                                <Col xs={12}>
                                                    <Form.Item
                                                        name={['experience', 'from']}
                                                        rules={[validationRules.required('From Experience')]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            addonBefore="From"
                                                            placeholder="0"
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={12}>
                                                    <Form.Item
                                                        name={['experience', 'to']}
                                                        rules={[validationRules.required('To Experience')]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            addonBefore="To"
                                                            placeholder="30"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Search Preference"
                                            name="searchPreference"
                                            rules={[validationRules.required('Search Preference')]}
                                        >
                                            <Checkbox.Group options={searchPreferenceOptions} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </AppCard>
                </Space>
            </Spin>
        </main>
    );
}