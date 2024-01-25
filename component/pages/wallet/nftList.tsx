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
  Typography,
} from '@mui/material';
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

  const [loading, setLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NftData[]>([]);
  const [hasNextPage, setHasNextPage] = useState<string | undefined>('');

  const update = async () => {
    setLoading(true);
    setNfts([]);
    const _nfts =
      authState &&
      (await wallet.getNftList({
        auth: authState,
        address: walletState.selected,
      }));
    _nfts && setNfts(_nfts.list);
    _nfts && setHasNextPage(_nfts.nextPage);
    setLoading(false);
  };

  useEffect(() => {
    walletState.selected && update();
  }, [walletState.wallets, walletState.selected, count]);

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
          {!loading ? <Typography>NFT</Typography> : <CircularProgress />}
        </Box>
      )}
      {nfts.length > 0 && !loading && (
        <ImageList cols={4}>
          {nfts.map((item, key) => (
            <ImageListItem key={key}>
              {!!item.img ? (
                <LazyLoadImage
                  src={item.img}
                  width="100%"
                  onError={({ currentTarget }) =>
                    (currentTarget.src = `${location.origin}/images/no-image-avaliable.png`)
                  }
                />
              ) : (
                <img
                  loading="lazy"
                  width="100%"
                  src={`${location.origin}/images/no-image-avaliable.png`}
                />
              )}
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
