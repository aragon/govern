import React, { useState, useCallback, useEffect } from 'react';
import {
  Grid,
  GridItem,
  SearchInput,
  StyledText,
  Button,
  useTheme,
  Box,
  SPACING,
  useLayout,
} from '@aragon/ui';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import { getTruncatedAccountAddress } from 'utils/account';
import { Stepper } from 'components/Stepper/Stepper';
import { Hint } from 'components/Hint/Hint';
import AbiHandler from 'utils/AbiHandler';
import { ActionBuilderCloseHandler } from 'utils/types';
import { utils } from 'ethers';

type FunctionSelectorProps = {
  onClick: ActionBuilderCloseHandler;
};

type FunctionItem = {
  signature: string;
  name: string;
  show: boolean;
  count: number;
};

const formatSignature = (signature: string, functionName: string): string => {
  const regex = new RegExp(`^.*${functionName}`, 'i');
  return signature.replace(regex, '');
};

export const FunctionSelector: React.FC<FunctionSelectorProps> = ({ onClick }) => {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  const { contractAddress, abi } = useActionBuilderState();
  const [error, setError] = useState(false);
  const [functions, setFunctions] = useState<FunctionItem[]>([]);

  useEffect(() => {
    if (abi) {
      const iface = new utils.Interface(abi);
      const functions = Object.entries(iface.functions)
        .filter(([_, fragment]) => !fragment.constant)
        .map(([_key, fragment]) => ({
          name: fragment.name,
          signature: fragment.format(utils.FormatTypes.full),
          count: 0,
          show: true,
        }));
      setFunctions(functions);
    }
  }, [abi, setFunctions]);

  const doSearch = useCallback(
    (searchTerm: string) => {
      setFunctions((existing) => {
        return existing.map((item) => {
          let show = true;
          if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            show = regex.test(item.name);
          }
          const newItem = { ...item, show };
          return newItem;
        });
      });
    },
    [setFunctions],
  );

  const handleChange = useCallback(
    (index: number, val: number) => {
      setFunctions((existing) => {
        return existing.map((item, itemIndex) => {
          const newItem = { ...item };
          if (itemIndex === index) {
            newItem.count = val;
          }

          return newItem;
        });
      });

      if (val > 0) setError(false);
    },
    [setFunctions, setError],
  );

  const submitActions = useCallback(() => {
    if (contractAddress) {
      const actions = functions
        .filter(({ count }) => count > 0)
        .reduce((result, field) => {
          const { signature, count } = field;
          const action = AbiHandler.mapToAction(signature, contractAddress, null);
          return result.concat(Array(count).fill(action));
        }, [] as FunctionItem[]);

      if (actions.length === 0) {
        setError(true);
      } else {
        onClick(actions);
      }
    }
  }, [contractAddress, onClick, functions]);

  return (
    <Grid>
      <GridItem>
        <StyledText name="title1">
          Contract: {getTruncatedAccountAddress(contractAddress)}
        </StyledText>
      </GridItem>
      <GridItem>
        <SearchInput wide placeholder="Search function" onChange={doSearch}></SearchInput>
        <Box
          style={{
            border: `1px solid ${theme.border}`,
            maxHeight: '380px',
            overflow: 'scroll',
            marginTop: `${spacing}px`,
          }}
        >
          {functions.map((item, index) => {
            if (!item.show) return null;
            return (
              <div
                key={index}
                css={`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <div style={{ maxWidth: '350px', wordBreak: 'break-all' }}>
                  <StyledText name="title3">{item.name}</StyledText>
                  <Hint>{formatSignature(item.signature, item.name)}</Hint>
                </div>
                <Stepper
                  min={0}
                  max={100}
                  value={item.count}
                  onChange={(val) => handleChange(index, val)}
                />
              </div>
            );
          })}
          <div style={{ color: `${theme.red}`, opacity: `${error ? 1 : 0}` }}>
            Please select at least one function.
          </div>
        </Box>
      </GridItem>
      <GridItem>
        <Button wide mode={'primary'} label="Select" onClick={submitActions}></Button>
      </GridItem>
    </Grid>
  );
};
