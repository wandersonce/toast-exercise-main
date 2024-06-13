import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export default function DataTable({ likedData }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: '650px', marginTop: '30px' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {likedData.map((item) => (
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
  );
}
