/* eslint-disable */
import { ANCircularProgressWithCaption, ANProgressCationPropos } from './ANCircularProgressWithCaption';
import { CircularProgressProps } from '@material-ui/core/CircularProgress';

export default {
  title: 'AN-CircularProgressWithCaption',
  component: ANCircularProgressWithCaption,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ANProgressCationPropos> = (args) => (
  <ANCircularProgressWithCaption {...args} />
);

export const an_Circularprogress_active = Template.bind({});
an_Circularprogress_active.args = {
  caption: 'In progress...',
  state: 1
};

export const an_Circularprogress_disabled = Template.bind({});
an_Circularprogress_disabled.args = {
  caption: 'Disabled...',
  state: 0
};

export const an_Circularprogress_done = Template.bind({});
an_Circularprogress_done.args = {
  caption: 'Done...',
  state: 2
};