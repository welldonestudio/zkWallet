import {
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { selectAuthState } from '@/store/slice/authSlice';

import { WalletSelecter } from './walletSelecter';
import packageInfo from '../../package.json';

export default function NavBar() {
  const authState = useSelector(selectAuthState);

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
          <WalletSelecter />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
