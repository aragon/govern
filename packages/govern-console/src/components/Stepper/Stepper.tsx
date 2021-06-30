import React, { useState, useCallback } from 'react';
import {
  GU,
  RADII,
  useLayout,
  useTheme,
  ButtonIcon,
  IconPlus,
  IconMinus,
  textStyle,
} from '@aragon/ui';

const adornmentPadding = 1 * GU;
const adornmentWidth = 40;

type StepperProps = {
  defaultValue?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  value?: number;
};

const isDisableMin = (value: number, min: number) => value <= min;
const isDisabledMax = (value: number, max?: number) => max && value >= max;

export const Stepper: React.FC<StepperProps> = ({
  defaultValue,
  value,
  onChange,
  min = 0,
  max,
}) => {
  const theme = useTheme();
  const { layoutName } = useLayout();

  const [internalValue, setInternalValue] = useState(() => {
    let newValue = value || defaultValue || min;
    if (newValue < min) {
      newValue = min;
    }
    return newValue;
  });

  const updateCount = useCallback(
    (type: 'up' | 'down') => {
      const newValue = type === 'up' ? internalValue + 1 : internalValue - 1;
      setInternalValue(newValue);
      onChange(newValue);
    },
    [internalValue, setInternalValue, onChange],
  );

  return (
    <div
      css={`
        display: inline-flex;
        position: relative;
        height: ${5 * GU}px;
        border: 2px solid ${theme.border};
        border-radius: ${layoutName === 'large' ? RADII.small : RADII[layoutName]}px;
        & > div {
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
        }
      `}
    >
      <div
        css={`
          color: ${isDisableMin(internalValue, min)
            ? theme.selectedDisabled
            : theme.surfaceContentSecondary};
          border-right: 2px solid ${theme.border};
          padding-right: ${adornmentPadding}px;
          &:hover {
            outline: none;
            color: ${isDisableMin(internalValue, min) ? theme.selectedDisabled : theme.selected};
          }
        `}
      >
        <ButtonIcon
          label="decrement"
          onClick={isDisableMin(internalValue, min) ? undefined : () => updateCount('down')}
        >
          <IconMinus />
        </ButtonIcon>
      </div>
      <div
        css={`
          ${textStyle('body2')}
          min-width: ${adornmentWidth}px;
        `}
      >
        {value}
      </div>
      <div
        css={`
          color: ${isDisabledMax(internalValue, max)
            ? theme.selectedDisabled
            : theme.surfaceContentSecondary};
          border-left: 2px solid ${theme.border};
          &:hover {
            outline: none;
            color: ${isDisabledMax(internalValue, max) ? theme.selectedDisabled : theme.selected};
          }
        `}
      >
        <ButtonIcon
          label="Increment"
          disabled={isDisabledMax(internalValue, max)}
          onClick={() => updateCount('up')}
        >
          <IconPlus />
        </ButtonIcon>
      </div>
    </div>
  );
};
