import { useEffect, useState } from 'react';

import SavingsIcon from '@mui/icons-material/Savings';
import SendIcon from '@mui/icons-material/Send';
import {
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
    <>
      <Grid container item spacing={2} paddingX={0}>
        <Grid item height="360px" xs={12} sm={6} md={6}>
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
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{item.fValue}</TableCell>
                        <TableCell align="right">
                          {item.type === '0x2::sui::SUI' && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => openStake(true)}
                              >
                                <SavingsIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => openSend(true)}
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
                    {balances
                      .filter((item) => item.type !== '0x2::sui::SUI')
                      .map((item, key) => (
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
