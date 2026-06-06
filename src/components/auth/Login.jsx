import {
  Alert,
  Button,
  Divider,
  Form,
  Input,
} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppTypography from '../typography/Typography';
import { colors } from '../../theme/colors/colors';
import { login } from '../../services/dropdownApi';
import Login1 from '../../assets/images/login-1.svg';
import Login2 from '../../assets/images/login-2.svg';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/';
  const sessionExpired = new URLSearchParams(location.search).get('session_expired') === '1';

  async function handleFinish(values) {
    setError('');
    setLoading(true);

    try {
      const result = await login({
        email: values.email,
        user_pwd: values.user_pwd,
      });

      onLogin?.(result);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-login-page">
      <section className="auth-login-bg" style={{ background: colors.brand }}>
        <div className="auth-login-static-section">
          <div>
            <img
              src={Login1}
              alt=""
              className="auth-login-img-one"
            />
          </div>
          <div className="auth-login-hero-wrap">
            <img
              src={Login2}
              alt=""
              className="auth-login-img-two"
            />
          </div>
          <AppTypography
            as="p"
            variant="body"
            color="inverse"
            size="2xl"
            weight="regular"
            align="right"
            className="auth-login-tagline"
          >
            Best in class processes in a box.
          </AppTypography>
        </div>
      </section>

      <section className="auth-login-form-layout">
        <div className="auth-login-form-container">
          <div className="auth-login-form-shell">
            {sessionExpired && (
              <div className="auth-login-session-expired-container">
                <div className="auth-login-slide-in">
                  <Alert
                    type="warning"
                    showIcon
                    icon={(
                      <ExclamationCircleFilled
                        style={{ fontSize: 30, color: '#FFC107' }}
                      />
                    )}
                    message={(
                      <div className="auth-login-alert-message-container">
                        <Divider className="auth-login-alert-divider" type="vertical" />
                        <div className="auth-login-alert-text">
                          Session expired. Please log in again.
                        </div>
                      </div>
                    )}
                    className="auth-login-session-expired-alert"
                  />
                </div>
              </div>
            )}

            <div className="auth-login-brand">
              <img src="/favicon.ico" alt="" className="auth-login-logo" />
              <AppTypography
                variant="h3"
                color="primary"
                weight="bold"
                className="auth-login-brand-text"
              >
                Zinnext
              </AppTypography>
            </div>

            <div className="auth-login-body">
              <div className="auth-login-sign-body">
                <AppTypography
                  variant="h2"
                  color="primary"
                  weight="bold"
                  align="center"
                  className="auth-login-title"
                >
                  Sign in
                </AppTypography>

                <div className="auth-login-form-con">
                  <Form
                    className="v1-form auth-login-form"
                    layout="vertical"
                    requiredMark={false}
                    onFinish={handleFinish}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          type: 'email',
                          required: true,
                          message: 'Enter valid email.',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Your work email"
                        autoComplete="email"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Password"
                      name="user_pwd"
                      rules={[
                        {
                          required: true,
                          message: 'Mandatory field.',
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        placeholder="Enter password"
                        autoComplete="current-password"
                      />
                    </Form.Item>

                    <Form.Item className="auth-login-forgot-row">
                      <Button
                        type="link"
                        className="auth-login-forgot"
                        htmlType="button"
                      >
                        Forgot Password?
                      </Button>
                    </Form.Item>

                    {error && (
                      <Form.Item>
                        <AppTypography color="danger" variant="body">
                          {error}
                        </AppTypography>
                      </Form.Item>
                    )}

                    <Button
                      className="auth-login-submit"
                      block
                      size="large"
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      id="znxt-signin"
                    >
                      Sign in
                    </Button>

                    <Form.Item className="auth-login-divider-row">
                      <Divider>Or</Divider>
                    </Form.Item>

                    <AppTypography
                      as="p"
                      variant="body"
                      color="secondary"
                      align="center"
                      className="auth-login-signup-text"
                    >
                      Not registered yet?{' '}
                      <Button
                        type="link"
                        htmlType="button"
                        className="auth-login-signup"
                        id="znxt-signup"
                      >
                        Sign up
                      </Button>
                    </AppTypography>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
