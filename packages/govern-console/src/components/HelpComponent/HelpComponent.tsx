import React from 'react';
import { Box, Button, StyledText, Split } from '@aragon/ui';

function HelpComponent() {
  return (
    <Box style={{ border: 'none', backgroundColor: '#8991FF09' }}>
      <Split
        primary={<img />}
        secondary={
          <div>
            <StyledText name="title3">Need help?</StyledText>
            <StyledText name="body2">Ask us anything, or share your feedback</StyledText>
          </div>
        }
      />
      <Button type="primary">Chat with the Aragon Experts</Button>
    </Box>
  );
}

export default HelpComponent;
