import React from 'react';
import styled from 'styled-components';

export interface ContentSwitcherProps {
  /**
   * Optional click handler
   */
  selected?: string;
  /**
   * On change handler
   */
  onChange: (value: string) => void;
  /**
   * width
   */
  width?: string;
  /**
   * height
   */
  height?: string;
  /**
   * style
   */
  style?: any;
  /**
   * List of items
   */
  items?: string[];
}

export const ContentSwitcher: React.FC<ContentSwitcherProps> = ({ items, onChange, selected }) => {
  return (
    <SelectorContainer>
      {items?.map((value) => {
        return (
          <Option
            key={value}
            className={value === selected ? 'active' : ''}
            onClick={() => onChange(value)}
          >
            {value}
          </Option>
        );
      })}
    </SelectorContainer>
  );
};

const SelectorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  background: #ffffff;
  border-radius: 12px;
  padding: 4px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  background: #ffffff;
  border-radius: 12px;
  font-weight: 600;
  color: #7483ab;
  cursor: pointer;
  &.active {
    background: #f0fbff;
    color: #00c2ff;
    cursor: auto;
  }
`;
