import { Card, Col } from "antd";

const SectionValue = ({ Header, title, children }) => {
    return (
        <Col lg={8}>
            <div style={{ marginBottom: 16 }}>
                <div className="sectionCardtitle">{title}</div>
                <div className="sectionCardChildren">{children}</div>
            </div>
        </Col>
    );
};

export default SectionValue;