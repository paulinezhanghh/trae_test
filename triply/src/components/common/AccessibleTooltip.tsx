import React from 'react';
import { Tooltip, TooltipProps } from '@mui/material';

interface AccessibleTooltipProps extends Omit<TooltipProps, 'children'> {
  children: React.ReactElement;
  id?: string;
}

const AccessibleTooltip: React.FC<AccessibleTooltipProps> = ({ children, ...props }) => {
  // Clone the child element to add accessibility attributes
  const childWithAccessibility = React.cloneElement(children, {
    'aria-describedby': props.open ? props.id : undefined,
    tabIndex: children.props.tabIndex || 0,
  });

  return (
    <Tooltip
      {...props}
      enterTouchDelay={0}
      leaveTouchDelay={1500}
      arrow
    >
      {childWithAccessibility}
    </Tooltip>
  );
};

export default AccessibleTooltip;