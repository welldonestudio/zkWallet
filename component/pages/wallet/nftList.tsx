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
    console.log(authState);
    const res = await wallet.getNftList({
      auth: { network: 'sui:mainnet' } as any,
      address:
        '0x02a212de6a9dfa3a69e22387acfbafbb1a9e591bd9d636e7895dcfc8de05f331',
    });
    setNfts(res.list);
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
              <img src={item.img} />
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
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Grid>
  );
};
