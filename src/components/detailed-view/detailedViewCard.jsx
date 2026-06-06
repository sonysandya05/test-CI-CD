import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import SectionHeader from "./SectionHeader";
import SectionValue from "./sectionValue";
import { getJobDetailedView } from "../../services/jobsApi";
import DetailPageLayout from "../layouts/DetailPageLayout";

export default function DetailedViewCard({ module, id }) {
  const [detailedView, setDetailedView] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDetailedView = async () => {
    try {
      setLoading(true);
      const response = await getJobDetailedView(module, id);
      if (module === "jobs") {
        setDetailedView(response.data.jobDetailedView || []);
      } else if (module === "candidates") {
        setDetailedView(response.data.candidatesDetailedView || []);
      } else if (module === "submission") {
        setDetailedView(response.data.submissionsDetailedView || []);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailedView();
  }, [module]);
  return (
    <DetailPageLayout
      leftContent={
        <Row gutter={[16, 16]}>
          {detailedView.map((section) => (
            <Col span={24}>
              <Card>
                <SectionHeader title={section.header} />
                <Row gutter={[16, 16]}>
                  {section.items?.map((item) => (
                    <SectionValue
                      key={item.title}
                      title={item.title}
                    >
                      {item.value}
                    </SectionValue>
                  ))}
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      }
      rightContent={
        <Card>
          Activity
        </Card>
      }
    />
  );
}