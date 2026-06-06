import { Row, Col } from "antd";
import AppBreadcrumb from "../components/Breadcrumb";
import ListView from "../components/ListView";

const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Onboarding', href: '/onboarding' },
];

export default function OnboardingHomePage() {
    return (
        <div>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <AppBreadcrumb items={breadcrumbItems} />
                </Col>

                <Col span={24}>
                    <ListView moduleName="Onboarding" />
                </Col>
            </Row>

        </div>
    )
}