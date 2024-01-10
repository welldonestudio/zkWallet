import { useEffect, useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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

import type { ResponseStake } from '@/component/api/types';

export const Stake = () => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [stakes, setStakes] = useState<ResponseStake[]>([]);

  useEffect(() => {
    const update = async () => {
      const _stakes =
        authState &&
        (await wallet.getStakes({
          auth: authState,
          address: walletState.selected,
        }));
      _stakes && setStakes(_stakes);
      _stakes && console.log(2, _stakes);
    };
    walletState.wallets[0] && update();
  }, [walletState.wallets]);

  return (
    <>
      {stakes.map(({ validator, stakes }, key) => (
        <Accordion key={key}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {validator.name} / {validator.totalAmount} /{' '}
            {validator.estimatedReward}
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Deligated Stake</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Active Epoch</TableCell>
                    <TableCell align="right">Reward</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stakes.map((item, key2) => (
                    <TableRow key={key2}>
                      <TableCell align="left">{item.amount}</TableCell>
                      <TableCell align="left">{item.status}</TableCell>
                      <TableCell align="left">{item.activeEpoch}</TableCell>
                      <TableCell align="right">{item.reward}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};
