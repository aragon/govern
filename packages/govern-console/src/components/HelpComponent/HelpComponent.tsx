import React from 'react';
import { Box, Button, StyledText, useLayout, useTheme, Grid, GridItem, GU } from '@aragon/ui';
import helpFaceImage from 'images/pngs/help_face_@2x.png';
import { ARAGON_HELP_URL } from '../../utils/constants';

function HelpComponent() {
  const theme = useTheme();
  const { layoutName } = useLayout();
  return (
    <Box style={{ border: 'none', backgroundColor: '#8991FF1A' }}>
      <Grid columns={'4'} columnWidth={'1fr'} gap={14}>
        <GridItem
          gridColumn={'1/2'}
          alignHorizontal={layoutName !== 'large' ? 'center' : undefined}
        >
          <img
            src={helpFaceImage}
            style={{ width: 76, height: 48, marginTop: layoutName === 'large' ? 3 * GU : GU }}
          />
        </GridItem>
        <GridItem gridColumn={'2/5'}>
          <StyledText name="title3">Need help?</StyledText>
          <StyledText name="body2" style={{ color: theme.disabledContent }}>
            Ask us anything, or share your feedback
          </StyledText>
        </GridItem>
      </Grid>

      <Button
        wide
        type="primary"
        size={layoutName}
        style={{ background: theme.purple, marginTop: 2 * GU }}
        onClick={() => window.open(ARAGON_HELP_URL)}
      >
        Visit our help center
      </Button>
    </Box>
  );
}

export default HelpComponent;
