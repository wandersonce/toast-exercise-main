import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  fetchLikedFormSubmissions,
  onMessage,
  saveLikedFormSubmission,
} from './service/mockServer';
import {
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  SnackbarContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Close, ThumbUp } from '@mui/icons-material';
import DataTable from './components/DataTable';

export default function Content() {
  //** WITH MORE TIME I WOULD DO SOME GLOBAL STATES TO HANDLE SOME STATUS HERE **//
  //** I would use React Context or Zustand **//
  //** Also would be nice to use Typescript to know what we are expecting from each returned data **//

  //Setting states to handle data
  const [toastStatus, setToastStatus] = useState(false); //False - Closed ; True - Open
  const [submissionData, setSubmissionData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [likedData, setLikedData] = useState([]);
  const [refetchAttempts, setRefetchAttempts] = useState(0);
  const [error, setError] = useState('');

  const handleSubmission = (submittedData) => {
    setSubmissionData(submittedData);
    if (submittedData.data) {
      setToastStatus(true);
    }
  };

  const handleLikeToast = () => {
    saveLikedFormSubmission(submissionData)
      .then((res) => {
        setToastStatus(false);
        setIsLoading(true);
        getLikedToasts();
        setIsLoading(false);
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLikedToasts = () => {
    fetchLikedFormSubmissions()
      .then((res) => {
        setLikedData(res.formSubmissions);
      })
      .catch((err) => {
        console.log(err);

        //Retrying to get data from server every 3s ; It will try 5x
        setTimeout(() => {
          setRefetchAttempts(refetchAttempts + 1);
          if (refetchAttempts < 6) {
            getLikedToasts();
          } else {
            setError(
              'Sorry we were not able to get the data at this time. Please try again later'
            );
            setRefetchAttempts(0);
          }
        }, 3000);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefetchAttempts(0);
      });
  };

  onMessage(handleSubmission);
  //This will get the liked users just after render
  useEffect(() => {
    getLikedToasts();
  }, []);

  return (
    <>
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h4">Liked Form Submissions</Typography>
        {!isLoading && error !== '' && (
          <Typography variant="p">{error}</Typography>
        )}
        {isLoading && error === '' && (
          <Box
            sx={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {!isLoading && likedData.length > 0 && error === '' && (
          <DataTable likedData={likedData} />
        )}
      </Box>
      <Snackbar
        open={toastStatus}
        onClose={() => setToastStatus(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <SnackbarContent
          sx={{ background: '#1976D2', width: '100%' }}
          message={
            submissionData.data && (
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
                    {submissionData.data.firstName}{' '}
                    {submissionData.data.lastName}
                  </Typography>
                  <Typography sx={{ fontStyle: 'italic' }}>
                    {submissionData.data.email}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="like"
                  color="inherit"
                  size="small"
                  onClick={handleLikeToast}
                >
                  <ThumbUp />
                </IconButton>
                <IconButton
                  aria-label="like"
                  color="inherit"
                  size="small"
                  onClick={() => setToastStatus(false)}
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
