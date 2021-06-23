import React, { ReactNode } from 'react';
import { useLayout, SPACING } from '@aragon/ui';

type ActionBuilderContentProps = {
  children: ReactNode;
};
export const ActionBuilderContent: React.FC<ActionBuilderContentProps> = ({ children }) => {
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  return (
    <div
      css={`
        display: grid;
        row-gap: ${spacing}px;
      `}
    >
      {children}
    </div>
  );
};
