import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  fetchLikedFormSubmissions,
  onMessage,
  saveLikedFormSubmission,
} from './service/mockServer';
import {
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

export default function Content() {
  //Setting states to handle data
  const [toastStatus, setToastStatus] = useState(false); //False - Closed ; True - Open
  const [submissionData, setSubmissionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [likedData, setLikedData] = useState([]);

  const handleSubmission = (submittedData) => {
    setSubmissionData(submittedData);
    if (submittedData.data) {
      setToastStatus(true);
    }
  };

  const handleLikeToast = () => {
    saveLikedFormSubmission(submissionData)
      .then((res) => {
        console.log(res);
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
    setIsLoading(true);
    fetchLikedFormSubmissions()
      .then((res) => {
        setLikedData(res.formSubmissions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onMessage(handleSubmission);
  useEffect(() => {
    setIsLoading(true);
    getLikedToasts();
    setIsLoading(false);
  }, []);
  return (
    <>
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h4">Liked Form Submissions</Typography>
        <TableContainer component={Paper} sx={{ maxWidth: '650px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {likedData.length > 0 &&
                likedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.data.firstName} {item.data.lastName}
                    </TableCell>
                    <TableCell>{item.data.email}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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
