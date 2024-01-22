import { useEffect, useState } from 'react';

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Hidden,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
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

import type { ResponseStake, StakeData } from '@/component/api/types';
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

export const StakeList = ({
  count,
  openStake,
  unstake,
}: {
  count: number;
  openStake: (open: boolean) => void;
  unstake: (stakeId: string) => void;
}) => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [stakes, setStakes] = useState<ResponseStake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);

  const handleUnStake = async (stakeId: string) => {
    try {
      setLoading(true);
      authState && unstake(stakeId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const update = async () => {
    const _stakes =
      authState &&
      (await wallet.getStakeList({
        auth: authState,
        address: walletState.selected,
      }));
    _stakes && setStakes(_stakes);
    _stakes && console.log('stakes', _stakes);
    setInit(true);
  };

  const StakeTable = ({ list }: { list: StakeData[] }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const ShowPage = () => {
      const showList = list.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );

      return (
        <>
          {showList.map((stake, key) => (
            <TableRow key={key}>
              <TableCell align="left">{`${stake.amount} ${CURRENCY_UNIT}`}</TableCell>
              <TableCell align="left">
                <>
                  {stake.status === 'active' && (
                    <Chip
                      label={stake.status}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {stake.status === 'pending' && (
                    <Chip
                      label={stake.status}
                      color="info"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {stake.status === 'unstaked' && (
                    <Chip
                      label={stake.status}
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </>
              </TableCell>
              <TableCell align="left">{`Epoch ${stake.activeEpoch}`}</TableCell>
              <TableCell align="right">{`${stake.reward} ${CURRENCY_UNIT}`}</TableCell>
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
          {Array.from({ length: rowsPerPage - showList.length }).map(
            (_, key) => (
              <TableRow key={key}>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>
                  <Button disabled style={{ visibility: 'hidden' }}>
                    Unstake
                  </Button>
                </TableCell>
              </TableRow>
            ),
          )}
        </>
      );
    };

    return (
      <>
        <TableContainer>
          <Table size="small">
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
              <ShowPage />
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          size="small"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={list.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      </>
    );
  };

  useEffect(() => {
    walletState.wallets[0] && update();
  }, [walletState.wallets, count]);

  return (
    <Grid item xs={12}>
      {stakes.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            backgroundColor: '#00000000',
            width: '100%',
            height: '180px',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            borderStyle: 'dashed',
            borderColor: 'divider',
          }}
        >
          {init ? (
            <Box>
              <Button onClick={() => openStake(true)}>Stake</Button>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </Box>
      )}
      {stakes.map(({ validator, list }, key) => (
        <Accordion key={key} disableGutters elevation={0}>
          <MyAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                width: '100%',
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Stack marginLeft={2}>
                  <Box>
                    <Typography variant="caption" style={{ opacity: 0.5 }}>
                      Validator
                    </Typography>
                  </Box>
                  <Box>
                    <Hidden smDown>
                      {validator.name ||
                        utils.shortenString(validator.address, 8, 8)}
                    </Hidden>
                    <Hidden smUp>
                      {validator.name || utils.shortenString(validator.address)}
                    </Hidden>
                  </Box>
                </Stack>
              </Box>
              <Box marginLeft={2}>
                <Stack>
                  <Box>
                    <Typography
                      variant="caption"
                      style={{ opacity: 0.5 }}
                      textAlign="end"
                    >
                      Total Stacked Amount
                    </Typography>
                  </Box>
                  <Box
                    sx={{ textAlign: 'end' }}
                  >{`${validator.totalAmount} ${CURRENCY_UNIT}`}</Box>
                </Stack>
              </Box>
              <Box marginLeft={2}>
                <Stack>
                  <Box>
                    <Typography
                      variant="caption"
                      style={{ opacity: 0.5 }}
                      textAlign="end"
                    >
                      Estimate Reward
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'end' }}>
                    {`${validator.estimatedReward} ${CURRENCY_UNIT}`}
                  </Box>
                </Stack>
              </Box>
              <Box marginLeft={2}>
                <Stack>
                  <Box>
                    <Typography variant="caption" style={{ opacity: 0.5 }}>
                      APY
                    </Typography>
                  </Box>
                  <Box>
                    {`${validator.apy} %`}{' '}
                    <Tooltip title={`Epoch ${validator.apyEpoch}`}>
                      <InfoIcon fontSize="small" sx={{ marginLeft: 1 }} />
                    </Tooltip>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </MyAccordionSummary>
          <AccordionDetails>
            <StakeTable list={list} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Grid>
  );
};
