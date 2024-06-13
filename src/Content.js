import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { onMessage } from './service/mockServer';

export default function Content() {
  //Setting states to handle data
  const [submissionData, setSubmissionData] = useState({});

  const handleSubmission = (submittedData) => {
    setSubmissionData(submittedData.data);
    console.log(submissionData);
  };

  useEffect(() => {
    onMessage(handleSubmission);
  }, []);
  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h4">Liked Form Submissions</Typography>

      <Typography
        variant="body1"
        sx={{ fontStyle: 'italic', marginTop: 1 }}
      ></Typography>
    </Box>
  );
}
