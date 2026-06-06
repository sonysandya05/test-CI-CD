import { CheckCircleOutlined, ClockCircleOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AppTypography from '../typography/Typography';
import { onboardingStageToneColors } from '../../theme/colors/colors';

const toneIcon = {
  approved: CheckCircleOutlined,
  danger: ExclamationCircleOutlined,
  issued: CheckCircleOutlined,
  neutral: ClockCircleOutlined,
  success: CheckCircleOutlined,
  warning: ClockCircleOutlined,
};

export default function OnboardingStageCard({ stages = [] }) {
  return (
    <div className="onboarding-stage-card">
      {stages.map((stage) => {
        const Icon = toneIcon[stage.tone] ?? ClockCircleOutlined;
        const tone = onboardingStageToneColors[stage.tone] ?? onboardingStageToneColors.neutral;

        return (
          <div className="onboarding-stage-card__item" key={`${stage.title}-${stage.status}`}>
            <AppTypography
              className="onboarding-stage-card__title"
              variant="caption"
              color="primary"
              weight="medium"
              lineHeight="snug"
            >
              {stage.title}
            </AppTypography>
            <button
              className="onboarding-stage-card__status"
              style={{
                '--onboarding-stage-status-bg': tone.background,
                '--onboarding-stage-status-color': tone.text,
              }}
              type="button"
            >
              <AppTypography
                className="onboarding-stage-card__status-label"
                variant="caption"
                weight="medium"
                style={{ color: 'inherit' }}
              >
                <Icon className="onboarding-stage-card__status-icon" />
                {stage.status}
              </AppTypography>
              <DownOutlined className="onboarding-stage-card__chevron" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
