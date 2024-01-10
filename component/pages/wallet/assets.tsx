import { useEffect, useState } from 'react';

import SavingsIcon from '@mui/icons-material/Savings';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import SendTokenModal from '@/component/dialog/sendToken';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import type { ResponseBalnce } from '@/component/api/types';

export const Assets = () => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [balances, setBalances] = useState<ResponseBalnce[]>([]);

  const [openSend, setOpenSend] = useState<boolean>(false);
  const [openStake, setOpenStake] = useState<boolean>(false);

  const handleSendConfirm = async (
    password: string,
    to: string,
    amount: string,
  ) => {
    authState &&
      (await wallet.sendToken({
        auth: authState,
        wallet: walletState.wallets[0],
        password,
        token: {
          to,
          type: '0x2::sui::SUI',
          amount,
        },
      }));
  };

  const handleStakeConfirm = async (
    password: string,
    to: string,
    amount: string,
  ) => {
    authState &&
      (await wallet.stake({
        auth: authState,
        wallet: walletState.wallets[0],
        password,
        stake: {
          amount,
          validator: to,
        },
      }));
  };

  useEffect(() => {
    const update = async () => {
      const _balances =
        authState &&
        (await wallet.getBalance({
          auth: authState,
          address: walletState.selected,
        }));
      _balances && setBalances(_balances);
      console.log('balance', _balances);
    };
    walletState.wallets[0] && update();
  }, [walletState.wallets]);

  return (
    <Box>
      <Grid container height="360px" width="100%" spacing={2} paddingX={0}>
        <Grid item xs={12} sm={6} md={6}>
          <Card style={{ height: '100%' }}>
            <CardHeader title="Balance" />
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
                        <TableCell>
                          {item.name === '0x2::sui::SUI' ? ' SUI' : item.name}
                        </TableCell>
                        <TableCell align="right">{item.value}</TableCell>
                        <TableCell align="right">
                          {item.type === '0x2::sui::SUI' && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => setOpenStake(true)}
                              >
                                <SavingsIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => setOpenSend(true)}
                              >
                                <SendIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
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
                    {balances
                      .filter((item) => item.type !== '0x2::sui::SUI')
                      .map((item, key) => (
                        <TableRow key={key}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">{item.value}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => setOpenSend(true)}
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
      <SendTokenModal
        title="Transfer Token"
        open={openSend}
        onClose={() => setOpenSend(false)}
        confirm={handleSendConfirm}
      />
      <SendTokenModal
        title="Stake"
        open={openStake}
        onClose={() => setOpenStake(false)}
        confirm={handleStakeConfirm}
      />
    </Box>
  );
};
