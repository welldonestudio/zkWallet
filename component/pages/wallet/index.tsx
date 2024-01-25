import { useEffect, useState } from 'react';

import { Box, Grid, Tab, Tabs } from '@mui/material';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { SendTokenModal } from '@/component/dialog/sendToken';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import { Assets } from './assets';
import { NftList } from './nftList';
import { StakeList } from './stakeList';

import type { ResponseValidator } from '@/component/api/types';

export const Wallet = () => {
  const account = useCurrentAccount();
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet: api } = useContextApi();

  const [openSend, setOpenSend] = useState<boolean>(false);
  const [openStake, setOpenStake] = useState<boolean>(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [validators, setVelidators] = useState<ResponseValidator[]>([]);
  const [count, setCount] = useState<number>(0);

  const getWallet = () => {
    const wallet =
      authState &&
      walletState.wallets.find((item) => item.address === walletState.selected);
    return wallet;
  };

  const handleSendConfirm = async (to: string, amount: string) => {
    try {
      const wallet = getWallet();
      authState &&
        wallet &&
        (await api.sendToken({
          auth: authState,
          wallet,
          token: {
            to,
            type: '0x2::sui::SUI',
            amount,
          },
        }));
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStakeConfirm = async (to: string, amount: string) => {
    try {
      const wallet = getWallet();
      authState &&
        wallet &&
        (await api.stake({
          auth: authState,
          wallet,
          stake: {
            amount,
            validator: to,
          },
        }));
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnStakeConfirm = async (stakeId: string) => {
    try {
      const wallet = getWallet();
      authState &&
        wallet &&
        (await api.unStake({
          auth: authState,
          wallet,
          unStake: {
            stakedSuiId: stakeId,
          },
        }));
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const vali = authState && (await api.getValidators({ auth: authState }));
      setVelidators(vali || []);
    };
    init();
  }, [authState]);

  return (
    <>
      {!!account && (
        <Grid container spacing={2} paddingY={4}>
          <Grid container item xs={12}>
            <Assets
              count={count}
              openSend={setOpenSend}
              openStake={setOpenStake}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 1 }}
            >
              <Tabs
                value={tabIndex}
                onChange={(_, value) => {
                  setTabIndex(value);
                }}
              >
                <Tab label="Stake" />
                <Tab label="NFT" />
              </Tabs>
            </Box>
            {tabIndex === 0 && (
              <Box width="100%">
                <StakeList
                  count={count}
                  openStake={setOpenStake}
                  unstake={handleUnStakeConfirm}
                />
              </Box>
            )}
            {tabIndex === 1 && <NftList count={count} />}
          </Grid>
        </Grid>
      )}
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
        validators={validators}
      />
    </>
  );
};
