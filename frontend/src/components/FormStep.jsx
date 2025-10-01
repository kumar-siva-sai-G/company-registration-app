import React from 'react';
import { Box, Button } from '@mui/material';

const FormStep = ({ stepIndex, totalSteps, onNext, onBack, children }) => {
  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <Box>
      <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', minHeight: '300px' }}>
        {children}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={stepIndex === 0}
          onClick={onBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button
          variant="contained"
          onClick={onNext}
        >
          {isLastStep ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormStep;