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
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import { Close, ThumbUp } from '@mui/icons-material';
import DataTable from './components/DataTable';

export default function Content() {
  //** WITH MORE TIME I WOULD DO SOME GLOBAL STATES TO HANDLE SOME STATUS HERE **//
  //** I would use React Context or Zustand **//
  //** With Global states we could move some functions to an  **//
  //** Also would be nice to use Typescript to know what we are expecting from each returned data **//

  //Setting states to handle data
  const [toastStatus, setToastStatus] = useState(false); //False - Closed ; True - Open
  const [submissionData, setSubmissionData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // True - the table data is loading
  const [isLikedDataLoading, setIsLikedDataLoading] = useState(false); // True - the table data is loading
  const [likedData, setLikedData] = useState([]);
  const [refetchAttempts, setRefetchAttempts] = useState(0); // Quantity of refetch Attempts
  const [error, setError] = useState('');

  //If the data is returned from server it will open the toast with that information
  const handleSubmission = (submittedData) => {
    if (submittedData.data) {
      setSubmissionData(submittedData);
      setToastStatus(true);
    }
  };

  //This function will save the liked toast and update the liked data state
  const handleLikeToast = () => {
    setIsLikedDataLoading(true);
    saveLikedFormSubmission(submissionData)
      .then((res) => {
        setToastStatus(false);
        setIsLoading(true);
        getLikedToasts();
        setIsLoading(false);
        setIsLikedDataLoading(false);
        return;
      })
      .catch((err) => {
        console.log(err);
        setIsLikedDataLoading(false);
      });
  };

  //This function will get the liked toast data and update the likedData state
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
        {/* If not loading, with error - Show the error */}
        {!isLoading && error !== '' && (
          <Typography variant="p">{error}</Typography>
        )}

        {/* If is loading without error - Show the loading spin */}
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
        {/* If not loading, has data and no error - Show the table */}
        {!isLoading && likedData.length > 0 && error === '' && (
          <DataTable likedData={likedData} />
        )}
        {/* If not loading, no error and no data - Show the empty copy */}
        {!isLoading && likedData.length == 0 && error === '' && (
          <Typography
            sx={{ fontSize: '22px', color: '#1976D2', fontWeight: 'bold' }}
            variant="h6"
          >
            No data found at this time.
          </Typography>
        )}
      </Box>
      <Snackbar
        open={toastStatus}
        onClose={() => setToastStatus(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbarContent-message': {
            width: '100%',
          },
        }}
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
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {submissionData.data.firstName}{' '}
                    {submissionData.data.lastName}
                  </Typography>
                  <Typography sx={{ fontStyle: 'italic' }}>
                    {submissionData.data.email}
                  </Typography>
                </Box>
                {!isLikedDataLoading ? (
                  <IconButton
                    aria-label="like"
                    color="inherit"
                    size="small"
                    onClick={handleLikeToast}
                  >
                    <ThumbUp />
                  </IconButton>
                ) : (
                  <CircularProgress color="inherit" />
                )}

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
