import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Tabs,
  Table,
  Tag,
  Avatar,
  Dropdown,
  Button,
  Typography,
  Space,
  Checkbox,
  Card,
  Row,
  Col,
  Flex,
  message,
} from "antd";

import {
  AppstoreOutlined,
  TeamOutlined,
  SendOutlined,
  ShareAltOutlined,
  NotificationOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SafetyOutlined,
  MoreOutlined,
  GlobalOutlined,
  DeploymentUnitOutlined,
  UsergroupAddOutlined,
  ProfileOutlined,
  BellOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  BankOutlined,
  UserOutlined,
  DownOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import "antd/dist/reset.css";
import DetailPageLayout from "../components/layouts/DetailPageLayout";
import { getJobDetailedView } from "../services/jobsApi";
import CalendarCard from "../components/cards/CalendarCard";
import "../styles/mode-theme.css";
import SectionValue from "../components/detailed-view/sectionValue";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function ZinnextDetailedView({
  module, id
}) {
  const [theme, setTheme] = useState("theme-light");
  const [detailedView, setDetailedView] = useState([]);
  console.log("detailedView", detailedView);
  const [loading, setLoading] = useState(false);

  const fetchDetailedView = async () => {
    try {
      setLoading(true);

      const response = await getJobDetailedView(module, id);
      console.log(
        response, "response"
      )
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
    <div className={`dashboard-wrapper ${theme} app-theme`}>
      <Content className="content-wrap">
        <DetailPageLayout
          leftContent={
            <Row gutter={[16, 16]}>
              {detailedView.map((section) => (
                <Col span={24} key={section.header}>
                  <Card>
                    <div className="sectionHeader">
                      {section.header}
                    </div>

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
      </Content>
    </div>
  );
}