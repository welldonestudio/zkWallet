import { useEffect, useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import type { ResponseBalnce } from '@/component/api/types';

export const Assets = ({
  openSend,
  openStake,
}: {
  openSend: (open: boolean) => void;
  openStake: (open: boolean) => void;
}) => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [balances, setBalances] = useState<ResponseBalnce[]>([]);
  const [currency, setCurrency] = useState<string>('');

  useEffect(() => {
    const update = async () => {
      const _balances =
        authState &&
        (await wallet.getBalance({
          auth: authState,
          address: walletState.selected,
        }));
      _balances &&
        setBalances(_balances.filter((item) => item.type !== '0x2::sui::SUI'));
      _balances &&
        _balances.forEach(
          (item) => item.type === '0x2::sui::SUI' && setCurrency(item.fValue),
        );
      console.log('balance', _balances);
    };
    walletState.wallets[0] && update();
  }, [walletState.wallets]);

  return (
    <>
      <Grid container item spacing={2} paddingX={0}>
        <Grid item height="360px" xs={12} sm={6} md={6}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ height: '100%' }}>
              <Box height="100%">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Box>
                    <Typography variant="h6">Sui Balance</Typography>
                    <Typography variant="h2">
                      <Typography variant="body1">
                        {walletState.selected}
                      </Typography>
                    </Typography>
                  </Box>
                  <Box marginTop={4}>
                    {!currency && (
                      <Skeleton variant="text" width={210} height={118} />
                    )}
                    {currency && (
                      <Typography variant="h2">{currency}</Typography>
                    )}
                  </Box>
                  <Stack marginTop={2} spacing={2} direction="row" width="100%">
                    <Button
                      fullWidth
                      sx={{ marginX: 1 }}
                      variant="outlined"
                      onClick={() => openSend(true)}
                    >
                      Send
                    </Button>
                    <Button
                      fullWidth
                      sx={{ marginX: 1 }}
                      variant="contained"
                      onClick={() => openStake(true)}
                    >
                      Stake
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item height="360px" xs={12} sm={6} md={6}>
          <Card
            variant="outlined"
            style={{ height: '100%', backgroundColor: 'transparent' }}
          >
            <CardHeader title="Tokens" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Token</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {balances.map((item, key) => (
                      <TableRow key={key}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{item.fValue}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => openSend(true)}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
