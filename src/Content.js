import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { onMessage, saveLikedFormSubmission } from './service/mockServer';
import { IconButton, Snackbar, SnackbarContent } from '@mui/material';
import { Close, ThumbUp } from '@mui/icons-material';

export default function Content() {
  //Setting states to handle data
  const [toastStatus, setToastStatus] = useState(false); //False - Closed ; True - Open
  const [submissionData, setSubmissionData] = useState({});

  const handleSubmission = (submittedData) => {
    setSubmissionData(submittedData.data);
    if (submittedData.data) {
      setToastStatus(true);
    }
  };

  const handleLikeToast = () => {
    saveLikedFormSubmission(submissionData)
      .then((res) => {
        console.log(res);
        setToastStatus(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onMessage(handleSubmission);
  useEffect(() => {}, []);
  return (
    <>
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h4">Liked Form Submissions</Typography>

        <Typography
          variant="body1"
          sx={{ fontStyle: 'italic', marginTop: 1 }}
        ></Typography>
      </Box>
      <Snackbar
        open={toastStatus}
        onClose={() => setToastStatus(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <SnackbarContent
          sx={{ background: '#1976D2', width: '100%' }}
          message={
            submissionData && (
              <Box
                sx={{
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: '10px',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {submissionData.firstName} {submissionData.lastName}
                  </Typography>
                  <Typography sx={{ fontStyle: 'italic' }}>
                    {submissionData.email}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="like"
                  color="inherit"
                  size="small"
                  onClick={handleLikeToast}
                  sx={{ marginLeft: 'auto' }}
                >
                  <ThumbUp />
                </IconButton>
                <IconButton
                  aria-label="like"
                  color="inherit"
                  size="small"
                  onClick={() => setToastStatus(false)}
                  sx={{ marginLeft: 'auto' }}
                >
                  <Close />
                </IconButton>
              </Box>
            )
          }
        ></SnackbarContent>
      </Snackbar>
    </>
  );
}
