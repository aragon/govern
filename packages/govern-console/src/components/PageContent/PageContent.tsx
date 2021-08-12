import React, { memo, ReactNode } from 'react';
import { Grid, GridItem, useLayout, Accordion } from '@aragon/ui';
import { HelpText, PageName } from 'utils/HelpText';
import HelpComponent from 'components/HelpComponent/HelpComponent';

type PageContentProps = {
  children: ReactNode;
  pageName?: PageName;
  card?: ReactNode;
};

const PageContent: React.FC<PageContentProps> = ({ pageName, children, card }) => {
  const { layoutName } = useLayout();

  const sideTopComponent = card || (pageName && <Accordion items={HelpText[pageName]}></Accordion>);

  return (
    <Grid layout={true}>
      <GridItem gridColumn={layoutName === 'large' ? '1/12' : '1/-1'} gridRow={'1/4'}>
        {children}
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '1' : undefined}
        gridColumn={layoutName === 'large' ? '12/17' : '1 / -1'}
      >
        {sideTopComponent}
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '2' : undefined}
        gridColumn={layoutName === 'large' ? '12/17' : '1 / -1'}
      >
        <HelpComponent />
      </GridItem>
    </Grid>
  );
};

export default memo(PageContent);
