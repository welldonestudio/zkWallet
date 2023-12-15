import { useEffect, useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import SendTokenModal from '@/component/dialog/sendToken';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import type { ResponseBalnce, ResponseStake } from '@/component/api/types';

export const Assets = ({ balances }: { balances: ResponseBalnce[] }) => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [openSend, setOpenSend] = useState<boolean>(false);
  const [stakes, setStakes] = useState<ResponseStake[]>([]);
  const [tab, setTab] = useState(0);

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

  useEffect(() => {
    const update = async () => {
      const _stakes =
        authState &&
        (await wallet.getStakes({
          auth: authState,
          address: walletState.selected,
        }));
      _stakes && setStakes(_stakes);
    };
    walletState.wallets[0] && update();
  }, [walletState.wallets]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, value) => {
            setTab(value);
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Tokens" />
          <Tab label="Stakes" />
        </Tabs>
      </Box>
      {tab === 0 && (
        <Box height="100%">
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
        </Box>
      )}
      <SendTokenModal
        title="Transfer Token"
        open={openSend}
        onClose={() => setOpenSend(false)}
        confirm={handleSendConfirm}
      />
    </>
  );
};
