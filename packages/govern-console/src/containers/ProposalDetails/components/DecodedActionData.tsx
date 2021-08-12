import React, { useState, useEffect } from 'react';
import style from 'styled-components';
import { IPFSField } from 'components/Field/IPFSField';
import { JSONField } from 'components/Field/JSONField';
import { fetchIPFS } from 'utils/ipfs';

const LoadingIPFSField = style(IPFSField)({
  display: 'inline-block !important',
  '& div': {
    display: 'inline-block !important',
  },
});

const InlineIPFSField = style(LoadingIPFSField)({
  '& div::before': {
    content: "'\"'",
  },
  '& div::after': {
    content: "'\"'",
  },
  '& span::before': {
    content: "'\"'",
  },
  '& span::after': {
    content: "'\"'",
  },
});

interface DecodedActionDataProps {
  to: string;
  functionName: string;
  data: any;
  queueAddress: string;
}

const isConfigureAction = ({
  to,
  queueAddress,
  functionName,
}: {
  to: string;
  queueAddress: string;
  functionName: string;
}) => {
  return to === queueAddress && functionName === 'configure';
};

export const DecodedActionData: React.FC<DecodedActionDataProps> = ({
  to,
  functionName,
  data,
  queueAddress,
}) => {
  const key = 'rules(bytes)';
  const [replacement, updateReplacement] = useState<Record<string, any> | undefined>(() => {
    const initialState = isConfigureAction({ to, functionName, queueAddress })
      ? {
          [key]: <LoadingIPFSField value={undefined} loading={true} />,
        }
      : undefined;

    return initialState;
  });

  useEffect(() => {
    async function fetch() {
      if (isConfigureAction({ to, functionName, queueAddress })) {
        const rule = data['Argument #1 (tuple)'][key];
        const ipfs = await fetchIPFS(rule);
        updateReplacement({
          [key]: <InlineIPFSField value={ipfs || rule} loading={false} />,
        });
      }
    }

    fetch();
  }, [data, functionName, queueAddress, to]);

  return <JSONField json={data} replacement={replacement} />;
};
