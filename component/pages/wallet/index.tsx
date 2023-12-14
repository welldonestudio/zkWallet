import { useEffect, useState } from 'react';

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
import SendTokenModal from '@/component/dialog/sendToken';
import Layout from '@/component/layout';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import type { ResponseBalnce } from '@/component/api/types';

export const WalletPage = () => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [open, setOpen] = useState<boolean>(false);
  const [balances, setBalances] = useState<ResponseBalnce[]>([]);

  const handleConfirm = async (
    password: string,
    to: string,
    amount: string,
  ) => {
    const hash = await wallet.transferToken({
      auth: authState,
      wallet: walletState.wallets[0],
      password,
      token: {
        to,
        address: '0x2::sui::SUI',
        amount,
      },
    });
    console.log(hash);
  };

  useEffect(() => {
    const update = async () => {
      const temp = await wallet.getBalance({
        wallet: walletState.wallets[0],
      });
      setBalances(temp);
    };
    walletState.wallets[0] && update();
  }, [walletState.wallets]);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      <Grid container>
        <Grid item xs={12} sm={8} md={8}>
          <Card>
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
                        <TableCell align="right">{item.value}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => setOpen(true)}
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
        open={open}
        onClose={() => setOpen(false)}
        confirm={handleConfirm}
      />
    </Layout>
  );
};
