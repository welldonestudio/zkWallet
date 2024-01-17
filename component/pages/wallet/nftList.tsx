import { useEffect, useState } from 'react';

import LinkIcon from '@mui/icons-material/Link';
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import Image from 'next/image';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import type { NftData } from '@/component/api/types';

export const NftList = ({ count }: { count: number }) => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [nfts, setNfts] = useState<NftData[]>([]);
  const [init, setInit] = useState<boolean>(false);

  const update = async () => {
    if (authState) {
      const res = await wallet.getNftList({
        auth: authState,
        address: walletState.selected,
      });
      setNfts(res.list);
    }
    setInit(true);
  };

  useEffect(() => {
    update();
  }, [walletState.wallets, count]);

  return (
    <Grid item xs={12}>
      {nfts.length === 0 && (
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
          {init ? <>NFT</> : <CircularProgress />}
        </Box>
      )}
      {nfts.length > 0 && (
        <ImageList cols={4}>
          {nfts.map((item, key) => (
            <ImageListItem key={key}>
              <Image
                style={{ width: '100% ' }}
                src={`${location.origin}/images/no-image-avaliable.png`}
                alt=""
              />
              {(item.title || item.desc || item.desc) && (
                <ImageListItemBar
                  title={item.title}
                  subtitle={item.desc || item.desc}
                  actionIcon={
                    <>
                      {item.link && (
                        <IconButton size="small" href={item.link}>
                          <LinkIcon fontSize="small" />
                        </IconButton>
                      )}
                    </>
                  }
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Grid>
  );
};
