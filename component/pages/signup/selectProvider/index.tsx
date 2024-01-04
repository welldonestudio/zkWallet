import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fade,
} from '@mui/material';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { hash } from 'argon2-browser';
import { JWE, JWK, util } from 'node-jose';
import { useDispatch, useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import NewPasswordModal from '@/component/dialog/newPassword';
import Layout from '@/component/layout';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { DEFAULT_NETWORK, REDIRECT_AUTH_URL } from '@/store/slice/config';

import type { PROVIDER } from '@/store/slice/config';

export const SelectProviderPage = () => {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const { jwt } = useContextApi();

  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [provider, setProvider] = useState<PROVIDER | undefined>(undefined);

  const account = useCurrentAccount();

  const handleClick = async (select: PROVIDER) => {
    if (!authState) {
      setProvider(select);
      if (account) {
        handleConfirm('');
      } else {
        setOpen(true);
      }
    }
  };

  const handleConfirm = async (password: string) => {
    if (!authState) {
      setLoading(true);
      const { hashHex } = await hash({ pass: password, salt: 'zkWallet' });
      const key = await JWK.asKey({
        kty: 'oct',
        k: util.base64url.encode(hashHex),
      });

      switch (provider) {
        case 'google':
          {
            const { url, randomness, maxEpoch, crypto, privateKey, publicKey } =
              await jwt.sui.getOAuthURL({
                provider,
                redirectUrl: REDIRECT_AUTH_URL,
                network: DEFAULT_NETWORK,
              });

            if (privateKey) {
              const encrypt = await JWE.createEncrypt(
                { format: 'compact', contentAlg: 'A256GCM' },
                key,
              )
                .update(privateKey)
                .final();

              dispatch(
                setAuthState({
                  provider,
                  network: DEFAULT_NETWORK,
                  maxEpoch,
                  randomness,
                  key: {
                    type: 'local',
                    crypto,
                    publicKey,
                    encrypt,
                  },
                }),
              );
              window.location.replace(url);
            }
          }
          break;
        default:
          {
            if (account) {
              const { url, randomness, maxEpoch, crypto, publicKey } =
                await jwt.sui.getOAuthURL({
                  provider: 'google',
                  redirectUrl: REDIRECT_AUTH_URL,
                  network: DEFAULT_NETWORK,
                  publicKey: `0x${Buffer.from(account.publicKey).toString(
                    'hex',
                  )}`,
                });

              dispatch(
                setAuthState({
                  provider: 'google',
                  network: DEFAULT_NETWORK,
                  maxEpoch,
                  randomness,
                  key: {
                    type: 'extension',
                    crypto,
                    publicKey,
                  },
                }),
              );

              window.location.replace(url);
            }
          }
          break;
      }
    }
  };

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
  });

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        {account && (
          <Box width="400px" marginTop={-20}>
            <Fade in={account && show}>
              <Card sx={{ minWidth: 275 }}>
                <CardHeader title="Sign Up" />
                <CardContent>
                  <Button
                    fullWidth
                    onClick={() => handleClick('google')}
                    disabled={loading}
                  >
                    Google
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleClick('facebook')}
                    disabled
                  >
                    Facebook
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleClick('twitch')}
                    disabled
                  >
                    Twitch
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleClick('slack')}
                    disabled
                  >
                    Slack
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleClick('kakao')}
                    disabled
                  >
                    Kakao
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleClick('apple')}
                    disabled
                  >
                    Apple
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          </Box>
        )}
      </Box>
      <NewPasswordModal
        open={open}
        onClose={() => setOpen(false)}
        confirm={handleConfirm}
      />
    </Layout>
  );
};
