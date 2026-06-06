/// UserForm.jsx

import React from "react";
import { Form, Input, Button, Row, Col, Space, Select, Upload, message } from "antd";
import { formatters, validationRules } from "./validation";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export const uploadValidation = {

    beforeUpload: (file) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "application/pdf",
        ];

        const isValidType =
            allowedTypes.includes(file.type);

        if (!isValidType) {

            message.error(
                "Only JPG, PNG and PDF files are allowed."
            );

            // Prevent file from upload list
            return Upload.LIST_IGNORE;
        }

        const isValidSize =
            file.size / 1024 / 1024 <= 2;

        if (!isValidSize) {

            message.error(
                "File upload must be 2 MB below."
            );

            // Prevent file from upload list
            return Upload.LIST_IGNORE;
        }

        // Prevent auto upload
        return false;
    },
};
const UserForm = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Form Values:", values);
    };

    return (
        <div style={{ padding: 24 }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={16}>
                    {/* EMAIL */}
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                validationRules.required("Email"),
                                validationRules.email(),
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    {/* PHONE */}
                    <Col span={12}>
                        <Form.Item
                            label="Phone Number"
                            name="phone"
                            rules={[
                                validationRules.required("Phone Number"),
                                validationRules.phone(),
                            ]}
                            validateTrigger={["onBlur", "onChange"]}
                        >
                            <Input
                                maxLength={10}
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        phone: formatters.phoneFormatter(
                                            e.target.value
                                        ),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>

                    {/* PASSWORD */}
                    <Col span={12}>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                validationRules.required("Password"),
                                validationRules.password(),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>

                    {/* FULL NAME */}
                    <Col span={12}>
                        <Form.Item
                            label="Full Name"
                            name="fullName"
                            rules={[
                                validationRules.required("Full Name"),
                                validationRules.alphabets(),
                                validationRules.firstNameMinLength(),
                                validationRules.firstNameMaxLength(),
                            ]}
                        >
                            <Input
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        fullName: formatters.firstNameFormatter(
                                            e.target.value
                                        ),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>

                    {/* USERNAME */}
                    <Col span={12}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                validationRules.required("Username"),
                                validationRules.alphanumeric(),
                            ]}
                        >
                            <Input
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        username:
                                            formatters.removeExtraSpaces(
                                                e.target.value
                                            ),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>

                    {/* WEBSITE URL */}
                    <Col span={12}>
                        <Form.Item
                            label="Website URL"
                            name="website"
                            rules={[
                                validationRules.required("Website URL"),
                                validationRules.url(),
                            ]}
                        >
                            <Input
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        website:
                                            formatters.removeExtraSpaces(
                                                e.target.value
                                            ),
                                    });
                                }} />
                        </Form.Item>
                    </Col>
                    {/* MSP Req ID */}
                    <Col span={12}>
                        <Form.Item
                            label="MSP Req ID"
                            name="mspreqID"
                            rules={[
                                validationRules.required("MSP Req ID"),
                                validationRules.candidateId("MSP Req ID"),
                            ]}
                        >
                            <Input
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        mspreqID:
                                            formatters.removeExtraSpaces(
                                                e.target.value
                                            ),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    {/* CANDIDATE ID */}
                    <Col span={12}>
                        <Form.Item
                            label="Candidate ID"
                            name="candidateId"
                            rules={[
                                validationRules.required("Candidate ID"),
                                validationRules.candidateId("Candidate ID"),
                            ]}
                        >
                            <Input
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        candidateId:
                                            formatters.removeExtraSpaces(
                                                e.target.value
                                            ),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>

                    {/* REMARKS */}
                    <Col span={24}>
                        <Form.Item
                            label="Remarks"
                            name="remarks"
                            rules={[
                                validationRules.required("Remarks"),
                                validationRules.remarks(),
                                validationRules.remarksMinLength(),
                                validationRules.remarksMaxLength(),
                            ]}
                        >
                            <Input.TextArea
                                rows={4}
                            />
                        </Form.Item>
                    </Col>

                    {/* DESIGNATION */}
                    <Col span={12}>
                        <Form.Item
                            label="Designation"
                            name="designation"
                            rules={[
                                validationRules.required("Designation"),
                                validationRules.designation(),
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    {/* DOB */}
                    <Col span={12}>
                        <Form.Item
                            label="Date of Birth"
                            name="dob"
                            rules={[validationRules.dob()]}
                        >
                            <Input
                                placeholder="MM/DD/YYYY"
                                maxLength={10}
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        dob: formatters.dobFormatter(
                                            e.target.value
                                        ),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>

                    {/* COMPANY NAME */}
                    <Col span={12}>
                        <Form.Item
                            label="Company Name"
                            name="companyName"
                            rules={[
                                validationRules.required("Company Name"),
                                validationRules.companyName(),
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="contractType"
                            label="Contract Type"
                        >
                            <Select

                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                <Select.Option value="C2C" label="C2C">
                                    C2C
                                </Select.Option>
                                <Select.Option
                                    value="W2-Contract"
                                    label="W2-Contract"
                                >
                                    W2-Contract
                                </Select.Option>
                                <Select.Option
                                    value="W2-Fulltime"
                                    label="W2-Fulltime"
                                >
                                    W2-Fulltime
                                </Select.Option>
                                <Select.Option value="1099" label="1099">
                                    1099
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="candidateProposedRateCurrency"
                            label="Currency"
                        >
                            <Select
                                showSearch
                                allowClear
                            >
                                <Select.Option value="$">$</Select.Option>
                                <Select.Option value="₹">₹</Select.Option>
                                <Select.Option value="€">€</Select.Option>
                                <Select.Option value="zł">
                                    zł
                                </Select.Option>
                                <Select.Option value="£">£</Select.Option>
                                <Select.Option value="kr">
                                    kr
                                </Select.Option>
                                <Select.Option value="Fr">
                                    Fr
                                </Select.Option>
                                <Select.Option value="kr">
                                    kr
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col span={12}>
                        <Form.Item
                            label="Resume"
                            name="resume"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e?.fileList}
                            rules={[
                                validationRules.singleFileUpload(),
                            ]}
                        >
                            <Upload
                                beforeUpload={
                                    uploadValidation.beforeUpload
                                }
                                maxCount={1}
                            >
                                <Button>
                                    Upload Resume
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col> */}
                    <Col span={12}>

                        <Form.Item
                            label="Resume new"
                            name="resume"
                        >
                            <Upload
                                beforeUpload={
                                    uploadValidation.beforeUpload
                                }
                                maxCount={1}
                            >
                                <Button>
                                    Upload Resume
                                </Button>
                            </Upload>
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Documents"
                            name="documents"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e?.fileList}
                            rules={[
                                validationRules.multiFileUpload(),
                            ]}
                        >
                            <Upload
                                multiple
                                beforeUpload={
                                    uploadValidation.beforeUpload
                                }
                            >
                                <Button>
                                    Upload Documents
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Upload File"
                            name="file"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e?.fileList}
                            rules={[
                                validationRules.fileUpload(),
                            ]}
                        >
                            <Upload
                                beforeUpload={
                                    uploadValidation.beforeUpload
                                }
                                maxCount={1}
                            >
                                <Button>
                                    Upload
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Form.List name="users">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <>
                                        <Col span={12}>
                                            <Form.Item
                                                required
                                                {...restField}
                                                rules={[{ required: true, message: "First name is requried" }]}
                                                name={[name, 'first']}
                                            // rules={[{ required: true, message: 'Missing first name' }]}
                                            >
                                                <Input placeholder="First Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={11}>
                                            <Form.Item
                                                {...restField}
                                                required
                                                name={[name, 'last']}
                                            // rules={[{ required: true, message: 'Missing last name' }]}
                                            >
                                                <Input placeholder="Last Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={1}>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Col>
                                    </>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add field
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Row>

                {/* SUBMIT BUTTON */}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>

                    <Button
                        style={{ marginLeft: 10 }}
                        onClick={() => form.resetFields()}
                    >
                        Reset
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserForm;
