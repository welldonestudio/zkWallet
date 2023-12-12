import { useEffect, useState } from 'react';
import Image from 'next/image';

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { selectAuthState } from '@/store/slice/authSlice';

import packageInfo from '../../package.json';
import { useContextApi } from '../api';

export default function NavBar() {
  const theme = useTheme();
  const authState = useSelector(selectAuthState);

  const handleSignOut = async (message: string = '접속을 종료합니다') => {
    // await auth.tokenDelete(message);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'black',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Stack width="100%" marginTop={authState ? '14px' : 0}>
            <Box display="flex" flexGrow={1}>
              <Box display="flex" flexGrow={1}>
                <Stack>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Box>
                      <Link href="/">
                        <Image
                          src="/images/logo.svg"
                          width={128}
                          height={38}
                          alt="zkWallet"
                        />
                      </Link>
                    </Box>
                    <Box marginLeft={1}>
                      <Stack>
                        <Typography variant="caption">{`ver ${packageInfo.version}`}</Typography>
                      </Stack>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
