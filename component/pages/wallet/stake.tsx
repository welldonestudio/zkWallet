import { useEffect, useState } from 'react';

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Stack,
  styled,
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
import { utils } from '@/component/api/utils';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import type { ResponseStake } from '@/component/api/types';
import type { AccordionSummaryProps } from '@mui/material';

const MyAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

export const Stake = () => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [stakes, setStakes] = useState<ResponseStake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUnStake = async (stakeId: string) => {
    try {
      setLoading(true);
      authState &&
        (await wallet.unStake({
          auth: authState,
          wallet: walletState.wallets[0],
          unStake: {
            stakedSuiId: stakeId,
          },
        }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
      _stakes && console.log('stakes', _stakes);
    };
    walletState.wallets[0] && update();
  }, [walletState.wallets]);

  return (
    <>
      <Box>
        {stakes.map(({ validator, stakes }, key) => (
          <Accordion key={key} disableGutters elevation={0}>
            <MyAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignContent: 'center',
                }}
              >
                <Box>{validator.name || utils.shortenString( validator.address)}</Box>
                <Stack marginLeft={2}>
                  <Box>
                    <Typography variant="caption">APY</Typography>
                  </Box>
                  <Box>{`${validator.apy} %`}</Box>
                </Stack>
                <Stack marginLeft={2}>
                  <Box>
                    <Typography variant="caption">
                      Total Stacked Amount
                    </Typography>
                  </Box>
                  <Box>{validator.totalAmount}</Box>
                </Stack>
                <Stack marginLeft={2}>
                  <Box>
                    <Typography variant="caption">Estimate Reward</Typography>
                  </Box>
                  <Box>{validator.estimatedReward}</Box>
                </Stack>
              </Box>
            </MyAccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Deligated Stake</TableCell>
                      <TableCell align="left">Status</TableCell>
                      <TableCell align="left">Active Epoch</TableCell>
                      <TableCell align="right">Reward</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stakes.map((stake, key2) => (
                      <TableRow key={key2}>
                        <TableCell align="left">{stake.amount}</TableCell>
                        <TableCell align="left">
                          <>
                            {stake.status === 'active' && (
                              <Chip
                                label={stake.status}
                                color="success"
                                size="small"
                              />
                            )}
                            {stake.status === 'pending' && (
                              <Chip
                                label={stake.status}
                                color="info"
                                size="small"
                              />
                            )}
                            {stake.status === 'unstaked' && (
                              <Chip
                                label={stake.status}
                                color="warning"
                                size="small"
                              />
                            )}
                          </>
                        </TableCell>
                        <TableCell align="left">{`Epoch ${stake.activeEpoch}`}</TableCell>
                        <TableCell align="right">{stake.reward}</TableCell>
                        <TableCell align="right">
                          <Button
                            disabled={loading}
                            onClick={() => {
                              handleUnStake(stake.id);
                            }}
                          >
                            Unstake
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
};
