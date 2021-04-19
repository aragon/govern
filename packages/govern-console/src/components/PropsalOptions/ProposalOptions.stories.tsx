import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';

import ProposalOptions, { ProposalOptionsProps } from './ProposalOptions';

export default {
  title: 'ProposalOptions',
  component: ProposalOptions,
} as Meta;

const Template: Story<ProposalOptionsProps> = (args) => {
  const [options, updateOptions] = useState([{ value: '' }]);
  const onAddOption = () => {
    updateOptions([...options, { value: '' }]);
  };
  const onDeleteOption = (index: number) => {
    
    const tempOptions = [...options];
    tempOptions.splice(index, 1);
    updateOptions(tempOptions);
  };
  const onUpdateOption = (value: string, index: number) => {
    updateOptions(
      options.map((option, iterationIndex) => {
        if (index === iterationIndex) {
          option.value = value;
        }
        return option;
      }),
    );
  };
  args.options = options;
  args.onAddOption = onAddOption;
  args.onDeleteOption = onDeleteOption;
  args.onUpdateOption = onUpdateOption;
  return <ProposalOptions {...args} />;
};

export const Options = Template.bind({});
Options.args = {};
