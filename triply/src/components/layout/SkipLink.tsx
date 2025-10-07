import React from 'react';
import { Box, Button } from '@mui/material';
import { skipToContent } from '../../utils/accessibilityUtils';

interface SkipLinkProps {
  contentId: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ contentId }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        zIndex: 1500,
        '&:focus-within': {
          top: 0,
        },
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => skipToContent(contentId)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            skipToContent(contentId);
          }
        }}
        sx={{
          m: 1,
          borderRadius: 0,
          boxShadow: 3,
        }}
      >
        Skip to main content
      </Button>
    </Box>
  );
};

export default SkipLink;