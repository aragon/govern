/* eslint-disable */
import {
  ANCircularProgress,
  ANCircularProgressProps,
} from './ANCircularProgress';

export default {
  title: 'AN-Circularprogress',
  component: ANCircularProgress,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ANCircularProgressProps> = (args) => (
  <ANCircularProgress {...args} />
);

export const an_Circularprogress = Template.bind({});

an_Circularprogress.args = {
  status: 1, // or import CiruclarProgressStatus enum
};
