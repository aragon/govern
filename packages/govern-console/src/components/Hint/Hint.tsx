import React, { ReactNode } from 'react';
import { textStyle, useTheme } from '@aragon/ui';

type HintProps = {
  children: ReactNode;
};

export const Hint: React.FC<HintProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      css={`
        color: ${theme.hint};
        ${textStyle('body2')};
      `}
    >
      {children}
    </div>
  );
};
