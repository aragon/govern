import { ANWrappedPaper } from './ANWrapperPaper';
import { PaperProps } from '@material-ui/core/Paper';

export default {
  title: 'AN-WrappedPaper',
  component: ANWrappedPaper,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<PaperProps> = (args) => <ANWrappedPaper {...args} />;

export const an_WrappedPaper = Template.bind({});

an_WrappedPaper.args = {
  children: 'Some content...',
};
