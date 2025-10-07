import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  AccordionProps
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { handleKeyboardNavigation } from '../../utils/accessibilityUtils';

interface AccessibleAccordionProps extends Omit<AccordionProps, 'children'> {
  title: string;
  children: React.ReactNode;
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  ariaControls: string;
}

const AccessibleAccordion: React.FC<AccessibleAccordionProps> = ({
  title,
  children,
  titleVariant = 'h6',
  ariaControls,
  ...props
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    handleKeyboardNavigation(
      event,
      () => setExpanded(!expanded), // Enter
      () => setExpanded(!expanded)  // Space
    );
  };

  return (
    <Accordion
      {...props}
      expanded={expanded}
      onChange={handleChange}
      aria-controls={ariaControls}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} ${title}`}
        id={`${ariaControls}-header`}
        onKeyDown={handleKeyDown}
      >
        <Typography variant={titleVariant} component="div">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails id={ariaControls}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default AccessibleAccordion;