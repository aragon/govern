import React from 'react';
import { toUTF8String } from 'utils/lib';
import { ipfsMetadata } from 'utils/types';
import { ANCircularProgressWithCaption } from 'components/CircularProgress/ANCircularProgressWithCaption';
import { CiruclarProgressStatus } from 'utils/types';

interface FieldProps {
  value: (ipfsMetadata & string) | undefined;
  loading?: boolean;
}

export const IPFSField: React.FC<FieldProps> = ({ value, loading, ...props }) => {
  return (
    <div {...props} style={{ display: 'flex' }}>
      {(() => {
        if (loading) {
          return <ANCircularProgressWithCaption state={CiruclarProgressStatus.InProgress} />;
        }

        if (typeof value === 'undefined') {
          return <></>;
        }

        if (value == '0x') {
          return <div>Empty</div>;
        }

        if (typeof value === 'string') {
          return <div>{toUTF8String(value) || `can't be decoded: ${value}`}</div>;
        }

        return value?.text ? (
          <React.Fragment>
            <span>{value.text}</span>
          </React.Fragment>
        ) : (
          value?.endpoint && (
            <a href={value.endpoint} target="_blank" rel="noreferrer noopener">
              View
            </a>
          )
        );
      })()}
    </div>
  );
};
