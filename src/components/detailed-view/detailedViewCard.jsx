import React, { useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Spin,
} from "antd";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import SectionHeader from "./SectionHeader";
import SectionValue from "./sectionValue";
import DetailPageLayout from "../layouts/DetailPageLayout";

import {
  fetchDetailedView,
} from "../../redux/slices/detailedViewSlice";

import { fetchActivities } from "../../redux/slices/activitySlice";

export default function DetailedViewCard({
  module,
  id,
}) {
  const dispatch = useDispatch();

  const {
    data: detailedView,
    loading,
    error,
  } = useSelector(
    (state) => state.detailedView
  );

  useEffect(() => {
    dispatch(
      fetchDetailedView({
        module,
        id,
      })
    );
  }, [dispatch, module, id]);


  const {
    data: activities
  } = useSelector(
    (state) => state.activities
  );

  console.log("Activities =>", activities);
  useEffect(() => {
    dispatch(
      fetchActivities()
    );
  }, [dispatch, module, id]);

  return (
    <DetailPageLayout
      leftContent={
        loading ? (
          <Spin />
        ) : (
          <Row gutter={[16, 16]}>
            {Array.isArray(
              detailedView
            ) &&
              detailedView.map(
                (section) => (
                  <Col
                    span={24}
                    key={
                      section.header
                    }
                  >
                    <Card>
                      <SectionHeader
                        title={
                          section.header
                        }
                      />

                      <Row
                        gutter={[
                          16, 16,
                        ]}
                      >
                        {section.items?.map(
                          (item) => (
                            <SectionValue
                              key={
                                item.title
                              }
                              title={
                                item.title
                              }
                            >
                              {
                                item.value
                              }
                            </SectionValue>
                          )
                        )}
                      </Row>
                    </Card>
                  </Col>
                )
              )}
          </Row>
        )
      }
      rightContent={
        <Card>Activity
          {activities?.users?.map(
            (activity) => (
              <ul key={activity.id}>
                <li>{activity.firstName} {activity.lastName} - {activity.email}</li>
              </ul>
            )
          )}
        </Card>
      }
    />
  );
}