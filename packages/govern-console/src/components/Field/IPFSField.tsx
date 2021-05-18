import React from 'react';
import { getIpfsUrl } from 'utils/ipfs';
import { toUTF8String } from 'utils/lib';

interface FieldProps {
  value: string;
}

export const IPFSField: React.FC<FieldProps> = ({ value, ...props }) => {
  return (
    <div {...props}>
      {(() => {
        if (value == '0x') {
          return <div>Empty</div>;
        }
        const url = getIpfsUrl(value);
        if (url) {
          return (
            <a href={url} target="_blank" rel="noreferrer noopener">
              Read more
            </a>
          );
        }
        return <div>{toUTF8String(value) || `can't be decoded: ${value}`}</div>;
      })()}
    </div>
  );
};
