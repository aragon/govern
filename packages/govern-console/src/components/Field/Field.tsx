import React from 'react';
import { styled } from '@material-ui/core/styles';
// import { isIPFShash } from 'utils/ipfs';
interface FieldProps {
  value: string;
  inline: boolean;
  width?: string;
  height?: string;
}
const InlineField = styled('div')({
  display: 'inline',
});
const BlockField = styled('div')(
  ({ width, height }: { width?: string; height?: string }) => ({
    display: 'block',
    width: width ? width : 'fit-content',
    height: height ? height : 'fit-content',
  }),
);
const StyledLink = styled('a')({
  display: 'inline',
  width: 'fit-content',
  height: 'fit-content',
});
const Field: React.FC<FieldProps> = ({ value, inline }) => {
  return (
    <>
      {/* {inline ? (
        <InlineField>
          {isIPFShash(value) ? (
            <StyledLink href={value} target="_blank" rel="noopener noreferrer">
              See link
            </StyledLink>
          ) : (
            value
          )}
        </InlineField>
      ) : (
        <BlockField>
          {isIPFShash(value) ? (
            <StyledLink href={value} target="_blank" rel="noopener noreferrer">
              See link
            </StyledLink>
          ) : (
            value
          )}
        </BlockField> */}
      )
    </>
  );
};
export default Field;
