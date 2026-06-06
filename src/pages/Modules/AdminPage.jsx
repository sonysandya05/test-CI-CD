import { useMemo, useState } from "react";
import {
    Breadcrumb, Button, Col, Empty,
    Input, Menu, Row, Space, Statistic, Typography,
} from "antd";
import {
    AppstoreOutlined, BankOutlined, BellOutlined, BuildOutlined,
    CheckCircleOutlined, DashboardOutlined, FileTextOutlined,
    HomeOutlined, MailOutlined, RightOutlined, SafetyOutlined,
    SearchOutlined, SettingOutlined, TeamOutlined, UserOutlined,
} from "@ant-design/icons";

import AppCard from "../../components/cards/AppCard";
import "../../styles/AdminPage.css";
import StatsCards from "../../components/cards/StatsCards";
import OnboardingCard from "../../components/cards/OnboardingCard";

const { Text, Title } = Typography;

/* ─────────────────────────────────────────────
DATA
───────────────────────────────────────────── */
const adminSections = [
    {
        group: "Dashboard",
        items: [
            {
                id: "dashboard",
                label: "Admin Dashboard",
                icon: <DashboardOutlined />,
            },
        ],
    },
    {
        group: "Settings",
        items: [
            {
                id: "org", label: "Organization", icon: <BankOutlined />,
                heading: "Organization Settings",
                desc: "Manage your company profile and location details",
                cards: [
                    { label: "Company Information", icon: <BankOutlined />, desc: "Manage company profile, address and business details." },
                    { label: "Location", icon: <BuildOutlined />, desc: "Manage office locations, branches and regions." },
                ],
            },
            {
                id: "users", label: "User Settings", icon: <TeamOutlined />,
                heading: "User Settings",
                desc: "Manage users, teams, roles and access limits",
                cards: [
                    { label: "Users", icon: <UserOutlined />, desc: "Create and manage platform users." },
                    { label: "Teams", icon: <TeamOutlined />, desc: "Organize users into teams." },
                    { label: "Roles", icon: <SafetyOutlined />, desc: "Control permissions and access." },
                    { label: "User Limits", icon: <CheckCircleOutlined />, desc: "Manage user limits and restrictions." },
                ],
            },
            {
                id: "templates", label: "Templates", icon: <FileTextOutlined />,
                heading: "Templates",
                desc: "Email and signature templates for communications",
                cards: [
                    { label: "Email", icon: <MailOutlined />, desc: "Manage reusable email templates." },
                    { label: "Signature", icon: <FileTextOutlined />, desc: "Configure user email signatures." },
                ],
            },
        ],
    },
    {
        group: "Clients",
        items: [
            {
                id: "clients", label: "Clients", icon: <BankOutlined />,
                heading: "Clients",
                desc: "Manage client accounts and settings",
                cards: [
                    { label: "Clients", icon: <BankOutlined />, desc: "Manage client companies and account details." },
                ],
            },
        ],
    },
    {
        group: "Master",
        items: [
            {
                id: "jobs", label: "Jobs", icon: <AppstoreOutlined />,
                heading: "Jobs Master",
                desc: "Configure job sources and status types",
                cards: [
                    { label: "Sources", icon: <AppstoreOutlined />, desc: "Manage job source master values." },
                    { label: "Job Status", icon: <CheckCircleOutlined />, desc: "Configure job workflow status." },
                ],
            },
            {
                id: "candidates", label: "Candidates", icon: <UserOutlined />,
                heading: "Candidates Master",
                desc: "Skills, sources and work authorization settings",
                cards: [
                    { label: "Sources", icon: <AppstoreOutlined />, desc: "Manage candidate source values." },
                    { label: "Skills", icon: <SettingOutlined />, desc: "Manage skill master data." },
                    { label: "Work Authorization", icon: <SafetyOutlined />, desc: "Manage visa and authorization types." },
                ],
            },
            {
                id: "submissions", label: "Submissions", icon: <FileTextOutlined />,
                heading: "Submissions Master",
                desc: "Rejection reasons and submission status configuration",
                cards: [
                    { label: "Rejection Reasons", icon: <FileTextOutlined />, desc: "Manage common rejection reasons." },
                    { label: "Client Submission Status", icon: <CheckCircleOutlined />, desc: "Manage client submission statuses." },
                ],
            },
            {
                id: "clientmaster", label: "Client Master", icon: <BankOutlined />,
                heading: "Client Master",
                desc: "Payment terms, client types and contact types",
                cards: [
                    { label: "Payment Terms", icon: <FileTextOutlined />, desc: "Manage billing and payment terms." },
                    { label: "Client Type", icon: <AppstoreOutlined />, desc: "Classify client business types." },
                    { label: "Client Contact Type", icon: <TeamOutlined />, desc: "Manage client contact categories." },
                ],
            },
        ],
    },
];

/* ─────────────────────────────────────────────
DASHBOARD STATIC DATA
───────────────────────────────────────────── */
const dashboardStats = [
    { label: "Total Jobs", value: 1697, sub: "+12 this week", icon: <FileTextOutlined /> },
    { label: "Active Jobs", value: 1685, sub: "99.3% active rate", icon: <CheckCircleOutlined /> },
    { label: "My Jobs", value: 600, sub: "35% of total", icon: <UserOutlined /> },
    { label: "Total Candidates", value: 4320, sub: "+84 this month", icon: <TeamOutlined /> },
    { label: "Submissions", value: 892, sub: "312 pending", icon: <FileTextOutlined /> },
];

const onboardingItems = [
    { label: "In Progress", value: 107, sub: "Under review", color: "blue" },
    { label: "Hired", value: 2, sub: "Onboarded", color: "green" },
    { label: "Project Completed", value: 2, sub: "Project cycle closed", color: "purple" },
    { label: "Archive", value: 2, sub: "No longer active", color: "peach" },
];

const pipelineStages = [
    { label: "Sourced", count: 312, color: "#378ADD", pct: 35 },
    { label: "Screened", count: 223, color: "#7F77DD", pct: 25 },
    { label: "Interview", count: 161, color: "#1D9E75", pct: 18 },
    { label: "Offered", count: 107, color: "#EF9F27", pct: 12 },
    { label: "Rejected", count: 89, color: "#E24B4A", pct: 10 },
];

const topClients = [
    { name: "Tcs", jobs: 14, candidates: 86 },
    { name: "Empasis", jobs: 9, candidates: 64 },
    { name: "NovaSystems", jobs: 7, candidates: 51 },
    { name: "Brightwave", jobs: 5, candidates: 38 },
];

const recentActivity = [
    { text: "New candidate Ravi Kumar added to Java Developer role", time: "2 min ago", color: "#378ADD" },
    { text: "Submission approved by Acme Corp for Sr. React Dev", time: "18 min ago", color: "#1D9E75" },
    { text: "User Priya S. added to Recruiters team", time: "1 hr ago", color: "#7F77DD" },
    { text: "Job Data Analyst — TechFlow moved to archived", time: "3 hr ago", color: "#EF9F27" },
    { text: "Candidate rejected — work authorization mismatch", time: "5 hr ago", color: "#E24B4A" },
];

/* ─────────────────────────────────────────────
SUB-COMPONENTS
───────────────────────────────────────────── */

/** Full dashboard view rendered when activeId === "dashboard" */
function DashboardContent() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Header card */}
            <AppCard icon={<DashboardOutlined />} title="Admin Dashboard">
                <div className="admin-accent-bar" />
                <Title level={5}>Admin Dashboard</Title>
                <Text type="secondary">
                    Overview of jobs, candidates, onboarding and recent activity
                </Text>
            </AppCard>

            {/* Stats row */}
            <div className="admin-dashboard-stats">
                <StatsCards stats={[
                    { label: "Total Jobs", value: 1697, icon: "fileText" },
                    { label: "Active Jobs", value: 1685, icon: "checkCircle" },
                    { label: "My Jobs", value: 600, icon: "user" },
                    { label: "Total Candidates", value: 4320, icon: "team" },
                    { label: "Submissions", value: 892, icon: "fileText" },
                ]} />
            </div>

            {/* Onboarding + Pipeline */}
            <div className="admin-dashboard-mid-row">
                <OnboardingCard />

                <AppCard icon={<AppstoreOutlined />} title="Candidate Pipeline">
                    <Text type="secondary" style={{ fontSize: 12 }}>By stage (892 total)</Text>
                    <div className="admin-pipeline-bar">
                        {pipelineStages.map((s) => (
                            <div key={s.label} className="admin-pipeline-seg"
                                style={{ width: `${s.pct}%`, background: s.color }} />
                        ))}
                    </div>
                    <div className="admin-pipeline-legend">
                        {pipelineStages.map((s) => (
                            <div key={s.label} className="admin-pipeline-legend-item">
                                <span className="admin-pipeline-dot" style={{ background: s.color }} />
                                {s.label} {s.count}
                            </div>
                        ))}
                    </div>
                    <div className="admin-divider" />
                    <Text strong style={{ fontSize: 12 }}>Submission status</Text>
                    <div className="admin-sub-status-list" style={{ marginTop: 6 }}>
                        <div className="admin-sub-status-item">
                            <Text style={{ fontSize: 13 }}>Pending client review</Text>
                            <span className="admin-badge warn">312</span>
                        </div>
                        <div className="admin-sub-status-item">
                            <Text style={{ fontSize: 13 }}>Client approved</Text>
                            <span className="admin-badge success">248</span>
                        </div>
                        <div className="admin-sub-status-item">
                            <Text style={{ fontSize: 13 }}>Rejected</Text>
                            <span className="admin-badge danger">89</span>
                        </div>
                    </div>
                </AppCard>
            </div>

            {/* Top Clients + Recent Activity */}
            <div className="admin-dashboard-bottom-row">
                <AppCard
                    icon={<BankOutlined />}
                    title="Top Clients"
                    extra={<Button type="link" size="small">View all</Button>}
                >
                    {topClients.map((c) => (
                        <div key={c.name} className="admin-client-row">
                            <div className="admin-client-left">
                                <div className="admin-client-icon"><BankOutlined /></div>
                                <div>
                                    <div className="admin-client-name">{c.name}</div>
                                    <div className="admin-client-sub">{c.jobs} open jobs</div>
                                </div>
                            </div>
                            <div className="admin-client-right">
                                <div className="admin-client-val">{c.candidates}</div>
                                <div className="admin-client-sub">candidates</div>
                            </div>
                        </div>
                    ))}
                </AppCard>

                <AppCard icon={<BellOutlined />} title="Recent Activity">
                    {recentActivity.map((a, i) => (
                        <div key={i} className="admin-activity-row">
                            <div className="admin-activity-dot" style={{ background: a.color }} />
                            <div>
                                <div className="admin-activity-text">{a.text}</div>
                                <div className="admin-activity-time">{a.time}</div>
                            </div>
                        </div>
                    ))}
                </AppCard>
            </div>

            {/* Config overview */}
            <AppCard
                icon={<SettingOutlined />}
                title="Admin Configuration Overview"
                extra={<Button type="link" size="small">Manage</Button>}
            >
                <Row gutter={[24, 0]}>
                    <Col span={8}>
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Settings</Text>
                        {[["Organization", 2], ["User Settings", 4], ["Templates", 2]].map(([k, v]) => (
                            <div key={k} className="admin-cfg-overview-row">
                                <Text style={{ fontSize: 12 }}>{k}</Text>
                                <span className="admin-badge info">{v} items</span>
                            </div>
                        ))}
                    </Col>
                    <Col span={8}>
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Master</Text>
                        {[["Jobs", 2], ["Candidates", 3], ["Submissions", 2]].map(([k, v]) => (
                            <div key={k} className="admin-cfg-overview-row">
                                <Text style={{ fontSize: 12 }}>{k}</Text>
                                <span className="admin-badge info">{v} items</span>
                            </div>
                        ))}
                    </Col>
                    <Col span={8}>
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>System</Text>
                        {[["Total Groups", 4], ["Total Modules", 9], ["Config Items", 19]].map(([k, v]) => (
                            <div key={k} className="admin-cfg-overview-row">
                                <Text style={{ fontSize: 12 }}>{k}</Text>
                                <Text strong style={{ fontSize: 12 }}>{v}</Text>
                            </div>
                        ))}
                    </Col>
                </Row>
            </AppCard>

        </div>
    );
}

/** Config items view for Settings / Master sections */
function SettingsContent({ activeSection, activeGroup, filteredCards, searchText, setSearchText, allItems, handleNav }) {
    return (
        <Row gutter={[16, 16]}>

            {/* Header */}
            <Col span={24}>
                <AppCard
                    icon={activeSection?.icon}
                    title={activeSection?.heading}
                    extra={
                        <Input
                            className="admin-search"
                            prefix={<SearchOutlined />}
                            placeholder="Search settings…"
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    }
                >
                    <div className="admin-accent-bar" />
                    <Title level={5}>{activeSection?.heading}</Title>
                    <Text type="secondary">{activeSection?.desc}</Text>
                </AppCard>
            </Col>

            {/* Config items */}
            <Col xs={24} xl={16} style={{ alignSelf: "flex-start" }}>
                <AppCard
                    icon={<AppstoreOutlined />}
                    title="Configuration Items"
                    extra={
                        <Text type="secondary">
                            {filteredCards.length} item{filteredCards.length !== 1 ? "s" : ""}
                        </Text>
                    }
                >
                    <Row gutter={[14, 14]}>
                        {filteredCards.length > 0 ? (
                            filteredCards.map((card) => (
                                <Col xs={24} sm={12} xl={8} key={card.label}>
                                    <div className="admin-config-item">
                                        <div className="admin-config-top-bar" />
                                        <div className="admin-config-body">
                                            <div className="admin-config-icon">{card.icon}</div>
                                            <div className="admin-config-text">
                                                <span className="admin-config-label">{card.label}</span>
                                                <span className="admin-config-desc">{card.desc}</span>
                                            </div>
                                        </div>
                                        <div className="admin-config-divider" />
                                        <Button
                                            type="link"
                                            size="small"
                                            className="admin-config-manage"
                                            icon={<RightOutlined />}
                                            iconPosition="end"
                                        >
                                            Manage
                                        </Button>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <Col span={24}>
                                <div className="admin-config-empty">
                                    <Empty
                                        description="No settings found"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                </div>
                            </Col>
                        )}
                    </Row>
                </AppCard>
            </Col>

            {/* Section overview */}
            <Col xs={24} xl={8} style={{ alignSelf: "flex-start" }}>
                <AppCard icon={<FileTextOutlined />} title="Section Overview">
                    <div className="admin-overview-list">
                        {adminSections
                            .filter((s) => s.group !== "Dashboard")
                            .map((section) => {
                                const isActive = section.group === activeGroup?.group;
                                return (
                                    <div
                                        key={section.group}
                                        className={`admin-overview-item${isActive ? " active" : ""}`}
                                        onClick={() => {
                                            const first = section.items[0];
                                            if (first) handleNav(first.id);
                                        }}
                                    >
                                        <div className="admin-overview-left">
                                            <div className="admin-overview-icon">
                                                {section.items[0]?.icon}
                                            </div>
                                            <div className="admin-overview-text">
                                                <span className="admin-overview-name">{section.group}</span>
                                                <span className="admin-overview-sub">
                                                    {section.items.length} module{section.items.length !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`admin-overview-count${isActive ? " active" : ""}`}>
                                            {section.items.length}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                    <div className="admin-overview-footer">
                        <span className="admin-overview-footer-label">Total configuration items</span>
                        <span className="admin-overview-footer-value">
                            {allItems.filter((i) => i.cards).reduce((acc, i) => acc + i.cards.length, 0)}
                        </span>
                    </div>
                </AppCard>
            </Col>

        </Row>
    );
}

/* ─────────────────────────────────────────────
MAIN PAGE
───────────────────────────────────────────── */
export default function AdminPage() {
    const [activeId, setActiveId] = useState("dashboard");
    const [searchText, setSearchText] = useState("");

    const allItems = useMemo(() => adminSections.flatMap((s) => s.items), []);

    const activeSection = useMemo(
        () => allItems.find((i) => i.id === activeId),
        [allItems, activeId]
    );

    const activeGroup = useMemo(
        () => adminSections.find((s) => s.items.some((i) => i.id === activeId)),
        [activeId]
    );

    const filteredCards = useMemo(() => {
        if (!activeSection?.cards) return [];
        const q = searchText.trim().toLowerCase();
        if (!q) return activeSection.cards;
        return activeSection.cards.filter(
            (c) => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
        );
    }, [activeSection, searchText]);

    const menuItems = useMemo(
        () =>
            adminSections.map((s) => ({
                key: s.group,
                type: "group",
                label: s.group,
                children: s.items.map((item) => ({
                    key: item.id,
                    icon: item.icon,
                    label: item.label,
                })),
            })),
        []
    );

    const handleNav = (id) => {
        setActiveId(id);
        setSearchText("");
    };

    /* Breadcrumb last crumb */
    const activeCrumb = activeId === "dashboard"
        ? "Admin Dashboard"
        : activeSection?.heading ?? "Admin";

    return (
        <main className="admin-page">

            {/* Breadcrumb */}
            <div className="admin-breadcrumb">
                <Breadcrumb
                    items={[
                        { title: <><HomeOutlined /> Home</> },
                        { title: "Admin" },
                        // { title: activeCrumb },
                    ]}
                />
            </div>

            <Row gutter={[16, 16]} className="admin-wrapper">

                {/* ════ SIDEBAR ════ */}
                <Col xs={24} lg={6} xl={5}>
                    <AppCard title="Admin Console" icon={<SettingOutlined />}>

                        {/* Gradient banner */}
                        <div className="admin-sidebar-banner">
                            <span className="admin-sidebar-banner-title">Admin Panel</span>
                            <span className="admin-sidebar-banner-sub">Configuration Center</span>
                            <Row gutter={[8, 0]}>
                                <Col span={12}>
                                    <div className="admin-sidebar-pill">
                                        <span className="admin-sidebar-pill-label">Groups</span>
                                        <span className="admin-sidebar-pill-value">
                                            {adminSections.length}
                                        </span>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="admin-sidebar-pill">
                                        <span className="admin-sidebar-pill-label">Modules</span>
                                        <span className="admin-sidebar-pill-value">
                                            {allItems.length}
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Menu */}
                        <Menu
                            mode="inline"
                            selectedKeys={[activeId]}
                            items={menuItems}
                            onClick={({ key }) => handleNav(key)}
                            className="admin-sidebar-menu"
                        />
                    </AppCard>
                </Col>

                {/* ════ CONTENT ════ */}
                <Col xs={24} lg={18} xl={19}>
                    {activeId === "dashboard" ? (
                        <DashboardContent />
                    ) : (
                        <SettingsContent
                            activeSection={activeSection}
                            activeGroup={activeGroup}
                            filteredCards={filteredCards}
                            searchText={searchText}
                            setSearchText={setSearchText}
                            allItems={allItems}
                            handleNav={handleNav}
                        />
                    )}
                </Col>

            </Row>
        </main>
    );
}