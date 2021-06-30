import React from 'react';
import { Box, Button, StyledText, Split } from '@aragon/ui';
import helpFaceImage from 'images/pngs/help_face_@2x.png';

function HelpComponent() {
  return (
    <Box style={{ border: 'none', backgroundColor: '#8991FF1A' }}>
      <Split
        primary={<img src={helpFaceImage} style={{ width: 71, height: 39 }} />}
        secondary={
          <div>
            <StyledText name="title3">Need help?</StyledText>
            <StyledText name="body2">Ask us anything, or share your feedback</StyledText>
          </div>
        }
      />
      <Button wide type="primary">
        Chat with the Aragon Experts
      </Button>
    </Box>
  );
}

export default HelpComponent;
