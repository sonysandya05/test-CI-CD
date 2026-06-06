import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import {
    Row,
    Col,
    Tabs,
    Tag,
    Space,
    Typography,
    Button,
    message,
    Spin,
} from 'antd';

import {
    EnvironmentOutlined,
    ClockCircleOutlined,
    DollarCircleOutlined,
    BankOutlined,
    UserOutlined,
    FileTextOutlined,
    MoreOutlined,
    SearchOutlined,
    HistoryOutlined,
    FormOutlined,
    MailOutlined,
    PhoneOutlined,
    IdcardOutlined,
    SafetyCertificateOutlined,
    PaperClipOutlined,
} from '@ant-design/icons';

import AppBreadcrumb from '../components/Breadcrumb';
import AppCard from '../components/cards/AppCard';
import AppButton from '../components/AppButton';
import { getJobs } from '../services/dropdownApi';


const { Text, Title, Paragraph } = Typography;

function getJobsList(res) {
    return res?.data?.joblist || res?.joblist || res?.data?.data?.joblist || [];
}

export default function JobDetailedView() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [job, setJob] = useState(location.state?.job || {});
    const [loading, setLoading] = useState(false);

    const jobId =
        searchParams.get('id') ||
        searchParams.get('jobId') ||
        location.state?.job?._id;

    const clientName = job?.clientInfo?.clientName || 'Client';
    const mspId = job?.mspreqId || job?.clientJobReferenceId || '-';
    const jobTitle = job?.jobTitle || 'Job Title Not Available';
    const status = job?.jobStatus || 'active';
    const locationName = job?.jobLocation || '-';

    const experience = job?.experience?.from
        ? `${job.experience.from}${job.experience.to ? ` - ${job.experience.to}` : ''} years`
        : '-';

    const workMode = Array.isArray(job?.jobRemoteStatus)
        ? job.jobRemoteStatus.join(', ')
        : '-';

    const employmentType = job?.employmentType
        ? job.employmentType.toUpperCase()
        : '-';

    const clientRate = job?.jobPayDetails?.clientBudgetStart
        ? `${job.jobPayDetails.clientBudgetCurrencySymbol || '$'}${job.jobPayDetails.clientBudgetStart}/${job.jobPayDetails.clientBudgetUnit || 'Hour'}`
        : '-';

    const primarySkills = job?.primarySkills || job?.skills || ['Java', 'React'];

    const description =
        job?.jobDescription ||
        job?.description ||
        `We are hiring for ${jobTitle}. The role requires ${experience} of experience with strong hands-on knowledge in ${Array.isArray(primarySkills) ? primarySkills.join(', ') : primarySkills}.`;

    const recruiterName = job?.recruiterData?.[0]?.recruiterName || 'admin_realtekh';
    const createdAt = job?.createdAt || '-';

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: `ZNXTJOB${mspId}` },
    ];

    useEffect(() => {
        async function fetchJobDetails() {
            try {
                setLoading(true);

                if (location.state?.job) {
                    setJob(location.state.job);
                    return;
                }

                const res = await getJobs({ limit: 50, offset: 0 });
                const jobs = getJobsList(res);

                const selectedJob =
                    jobs.find(
                        (item) =>
                            item?._id === jobId ||
                            item?.id === jobId ||
                            item?.mspreqId === jobId ||
                            item?.clientJobReferenceId === jobId
                    ) ||
                    jobs[0] ||
                    {};

                setJob(selectedJob);
            } catch (error) {
                console.log('Job details fetch error:', error);
                message.error('Failed to load job details');
            } finally {
                setLoading(false);
            }
        }

        fetchJobDetails();
    }, [jobId, location.state]);

    return (
        <main>
            <Spin spinning={loading}>
                <Space direction="vertical" size={16} block>
                    <AppBreadcrumb items={breadcrumbItems} />

                    <AppCard variant="flat">
                        <Row justify="space-between" align="top" gutter={[24, 16]}>
                            <Col xs={24} lg={17}>
                                <Space direction="vertical" size={8}>
                                    <Text type="secondary">
                                        {clientName} - MSP ID {mspId}
                                    </Text>

                                    <Space size={8} wrap>
                                        <Title level={4}>
                                            {jobTitle}
                                        </Title>

                                        <Tag color={status === 'active' ? 'success' : 'default'}>
                                            {status}
                                        </Tag>
                                    </Space>

                                    <Space size={18} wrap>
                                        <Text type="secondary">
                                            <Space size={4}>
                                                <EnvironmentOutlined />
                                                {locationName}
                                            </Space>
                                        </Text>

                                        <Text type="secondary">
                                            <Space size={4}>
                                                <ClockCircleOutlined />
                                                {experience}
                                            </Space>
                                        </Text>

                                        <Text type="secondary">
                                            <Space size={4}>
                                                <BankOutlined />
                                                {employmentType} · {workMode}
                                            </Space>
                                        </Text>

                                        <Text type="secondary">
                                            <Space size={4}>
                                                <DollarCircleOutlined />
                                                Client rate: {clientRate}
                                            </Space>
                                        </Text>
                                    </Space>

                                    <Tabs
                                        defaultActiveKey="details"
                                        items={[
                                            {
                                                key: 'details',
                                                label: (
                                                    <Space>
                                                        <FileTextOutlined />
                                                        Details
                                                    </Space>
                                                ),
                                            },
                                            // {
                                            //     key: 'candidates',
                                            //     label: (
                                            //         <Space>
                                            //             <UserOutlined />
                                            //             Candidates
                                            //         </Space>
                                            //     ),
                                            // },
                                        ]}
                                    />
                                </Space>
                            </Col>

                            <Col xs={24} lg={7}>
                                <Space direction="vertical" align="end" size={14}>
                                    <Space>
                                        <AppButton
                                            icon={<SearchOutlined />}
                                            variant="soft"
                                            onClick={() => navigate('/source-candidate', { state: { job } })}
                                        >
                                            Source Candidates
                                        </AppButton>

                                        <Button icon={<MoreOutlined />} />
                                    </Space>

                                    <Space size={28}>
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
                                        Created {createdAt}
                                    </Text>
                                </Space>
                            </Col>
                        </Row>
                    </AppCard>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={16}>
                            <Space direction="vertical" size={16} block>
                                <AppCard variant="flat" title="Client Information" icon={<IdcardOutlined />}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={8}>
                                            <Text type="secondary">Client Name</Text>
                                            <br />
                                            <Text strong>{clientName}</Text>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Text type="secondary">Contact Email</Text>
                                            <br />
                                            <Space size={4}>
                                                <MailOutlined />
                                                <Text strong>{job?.clientEmail || job?.recruiterData?.[0]?.recruiterEmail || '-'}</Text>
                                            </Space>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Text type="secondary">Phone Number</Text>
                                            <br />
                                            <Space size={4}>
                                                <PhoneOutlined />
                                                <Text strong>{job?.clientPhone || '-'}</Text>
                                            </Space>
                                        </Col>
                                    </Row>
                                </AppCard>

                                <AppCard variant="flat" title="Skills & Competencies" icon={<SafetyCertificateOutlined />}>
                                    <Space direction="vertical" size={14}>
                                        <div>
                                            <Text type="secondary">Primary Skills</Text>
                                            <br />
                                            <Space wrap>
                                                {(Array.isArray(primarySkills) ? primarySkills : [primarySkills]).map((skill) => (
                                                    <Tag color="blue" key={skill}>
                                                        {skill}
                                                    </Tag>
                                                ))}
                                            </Space>
                                        </div>

                                        <div>
                                            <Text type="secondary">Secondary Skills</Text>
                                            <br />
                                            <Text>{job?.secondarySkills || '-'}</Text>
                                        </div>
                                    </Space>
                                </AppCard>

                                <AppCard variant="flat" title="Role Summary" icon={<FileTextOutlined />}>
                                    <Paragraph>
                                        {description}
                                    </Paragraph>
                                </AppCard>

                                <AppCard variant="flat" title="Additional Details">
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={8}>
                                            <Text type="secondary">Priority</Text>
                                            <br />
                                            <Text strong>{job?.priority || '-'}</Text>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Text type="secondary">Recruitment Status</Text>
                                            <br />
                                            <Text strong>{job?.recruitmentStatus || '-'}</Text>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Text type="secondary">Job DV Status</Text>
                                            <br />
                                            <Text strong>{job?.jobDVStatus || '-'}</Text>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Text type="secondary">Client Reference ID</Text>
                                            <br />
                                            <Text strong>{job?.clientInfo?.clientReferenceId || '-'}</Text>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Text type="secondary">Client Job Reference ID</Text>
                                            <br />
                                            <Text strong>{job?.clientJobReferenceId || '-'}</Text>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Text type="secondary">Assigned Recruiter</Text>
                                            <br />
                                            <Text strong>{recruiterName}</Text>
                                        </Col>
                                    </Row>
                                </AppCard>

                                <AppCard variant="flat" title="Document" icon={<PaperClipOutlined />}>
                                    <Space direction="vertical" size={6}>
                                        <Text type="secondary">Attached Document</Text>
                                        {/* <a href={job?.documentUrl || '#'} target="_blank" rel="noreferrer">
                                            {job?.documentName || 'No document attached'}
                                        </a> */}
                                    </Space>
                                </AppCard>
                            </Space>
                        </Col>

                        <Col xs={24} lg={8}>
                            <AppCard variant="flat">
                                <Tabs
                                    defaultActiveKey="activity"
                                    items={[
                                        {
                                            key: 'activity',
                                            label: (
                                                <Space>
                                                    <HistoryOutlined />
                                                    Activity (2)
                                                </Space>
                                            ),
                                            children: (
                                                <Space direction="vertical" size={18}>
                                                    <div>
                                                        <Text type="secondary">Today · Jun 04, 2026</Text>
                                                        <br />
                                                        <Text strong>Shortlisted candidate moved forward</Text>
                                                        <Paragraph>
                                                            Jennifer Tran moved to <Tag>Good Fit</Tag> by {recruiterName}
                                                        </Paragraph>
                                                    </div>

                                                    <div>
                                                        <Text type="secondary">Created {createdAt}</Text>
                                                        <br />
                                                        <Text strong>Job created</Text>
                                                        <Paragraph>
                                                            {recruiterName} created this job requirement.
                                                        </Paragraph>
                                                    </div>
                                                </Space>
                                            ),
                                        },
                                        {
                                            key: 'notes',
                                            label: (
                                                <Space>
                                                    <FormOutlined />
                                                    Notes (0)
                                                </Space>
                                            ),
                                            children: (
                                                <Text type="secondary">
                                                    No notes added for this job.
                                                </Text>
                                            ),
                                        },
                                    ]}
                                />
                            </AppCard>
                        </Col>
                    </Row>
                </Space>
            </Spin>
        </main>
    );
}