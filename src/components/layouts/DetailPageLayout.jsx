import { Row, Col } from "antd";

const DetailPageLayout = ({
  leftContent,
  rightContent,
  fullcontent
}) => {
  return (
    <Row gutter={16}>
      <Col span={16}>
        {leftContent}
      </Col>

      <Col span={8}>
        {rightContent}
      </Col>

      <Col span={24}>
        {fullcontent}
      </Col>
    </Row>
  );
};

export default DetailPageLayout;