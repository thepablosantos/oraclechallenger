import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

interface User {
  address: string;
  stars: number;
}

interface UserRankingProps {
  users: User[];
}

export const UserRanking: React.FC<UserRankingProps> = ({ users }) => {
  const getAvatarColor = (index: number) => {
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    return index < 3 ? colors[index] : '#A0A0A0';
  };

  const formatAddress = (address: string) => {
    if (address.length > 12) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  return (
    <Paper elevation={3}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Ranking de Usuários
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Posição</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell align="right">Estrelas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.address}
                  sx={{
                    backgroundColor: index < 3 ? `${getAvatarColor(index)}10` : 'inherit',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(index),
                          width: 30,
                          height: 30,
                          mr: 1,
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>
                        {formatAddress(user.address)}
                      </Typography>
                      {index < 3 && (
                        <Chip
                          size="small"
                          label={['Ouro', 'Prata', 'Bronze'][index]}
                          sx={{
                            ml: 1,
                            bgcolor: getAvatarColor(index),
                            color: 'white',
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <StarIcon sx={{ color: 'gold', mr: 1 }} />
                      <Typography>{user.stars}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
}; 