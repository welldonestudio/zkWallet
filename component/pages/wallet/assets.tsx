import { useEffect, useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Button,
  Card,
  CardActions,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { utils } from '@/component/api/utils';
import { selectAuthState } from '@/store/slice/authSlice';
import { CURRENCY_UNIT } from '@/store/slice/config';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import { Sui } from './icons/sui';

import type { ResponseBalnce } from '@/component/api/types';

export const Assets = ({
  count,
  openSend,
  openStake,
}: {
  count: number;
  openSend: (open: boolean) => void;
  openStake: (open: boolean) => void;
}) => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [loading, isLoading] = useState<boolean>(false);
  const [balances, setBalances] = useState<ResponseBalnce[]>([]);
  const [currency, setCurrency] = useState<string>('');

  const update = async () => {
    isLoading(true);
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
    _balances && _balances.length === 0 && setCurrency('0.0');
    console.log('balance', _balances);
    isLoading(false);
  };

  useEffect(() => {
    walletState.selected && update();
  }, [walletState.wallets, count]);

  return (
    <>
      <Grid container item spacing={2} paddingX={0}>
        <Grid item height="360px" xs={12} sm={6} md={6}>
          <Card style={{ height: '100%' }}>
            <CardContent sx={{ height: 'calc(100% - 58px)' }}>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                height="100%"
                spacing={4}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Stack spacing={1}>
                    <Typography variant="h5">Address</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>
                        {utils.shortenString(walletState.selected, 8, 8)}
                      </Typography>
                      <Tooltip title="Copy Address">
                        <IconButton
                          size="small"
                          sx={{ marginRight: 1 }}
                          onClick={() => {
                            navigator.clipboard.writeText(walletState.selected);
                          }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Stack>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="h5">Balance</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {(authState?.network === 'sui:mainnet' ||
                        authState?.network === 'sui:devnet' ||
                        authState?.network === 'sui:testnet') && <Sui />}
                      <Typography variant="h3" marginLeft={2}>
                        {!currency || loading ? (
                          <Skeleton width="258px" />
                        ) : (
                          `${currency} ${CURRENCY_UNIT}`
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
            <CardActions>
              <Stack spacing={2} direction="row" width="100%">
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
            </CardActions>
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
