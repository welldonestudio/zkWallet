import { useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import {
  Card,
  CardContent,
  CardHeader,
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

export const Assets = ({ balances }: { balances: ResponseBalnce[] }) => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [openSend, setOpenSend] = useState<boolean>(false);

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

  return (
    <>
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
      <SendTokenModal
        title="Transfer Token"
        open={openSend}
        onClose={() => setOpenSend(false)}
        confirm={handleSendConfirm}
      />
    </>
  );
};
