import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField } from '@mui/material';

const OtpInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1); // Take only the last digit
    setOtp(newOtp);

    // Pass the complete OTP string to the parent form
    onChange(newOtp.join(''));

    // Move focus to the next input
    if (element.value !== '' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move focus to the previous input on backspace if the current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const value = e.clipboardData.getData('text');
    if (isNaN(value) || value.length !== length) {
      return;
    }
    const newOtp = value.split('');
    setOtp(newOtp);
    onChange(value);
    inputRefs.current[length - 1].focus();
  };

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
      onPaste={handlePaste}
    >
      {otp.map((data, index) => (
        <TextField
          key={index}
          type="text"
          name="otp"
          inputRef={(el) => (inputRefs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          inputProps={{
            maxLength: 1,
            style: { textAlign: 'center', fontSize: '1.5rem' },
          }}
          sx={{ width: '50px' }}
        />
      ))}
    </Box>
  );
};

export default OtpInput;