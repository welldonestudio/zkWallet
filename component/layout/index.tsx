import LoopIcon from '@mui/icons-material/Loop';
import { Alert, AlertTitle, Box, Container, Fade, Stack } from '@mui/material';

import { DEFAULT_NETWORK } from '@/store/slice/config';

import Footer from './footer';
import NavBar from './navbar';

export default function Layout({
  initialized,
  children,
}: {
  initialized?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />

      <main>
        <Container maxWidth="lg" sx={{ padding: 2 }}>
          <Stack spacing={2} marginY={2}>
            <Box width="100%">
              {DEFAULT_NETWORK !== 'sui:mainnet' && (
                <Alert variant="outlined" severity="warning">
                  <AlertTitle>
                    {DEFAULT_NETWORK === 'sui:devnet'
                      ? 'Devnet Alert'
                      : 'Testnet Alert'}
                  </AlertTitle>
                  Please set your network to{' '}
                  {DEFAULT_NETWORK === 'sui:devnet' ? 'DevNet' : 'TestNet'}
                  . Otherwise, it will be difficult to use.
                </Alert>
              )}
            </Box>
            {initialized ? (
              <Box minHeight={'100vh'}>{children}</Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100vh',
                }}
              >
                <Box sx={{ marginTop: -20 }}>
                  <Fade in={!initialized}>
                    <LoopIcon
                      fontSize="large"
                      sx={{
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': {
                            transform: 'rotate(360deg)',
                          },
                          '100%': {
                            transform: 'rotate(0deg)',
                          },
                        },
                      }}
                    />
                  </Fade>
                </Box>
              </Box>
            )}
          </Stack>
        </Container>
      </main>

      <Footer />
    </>
  );
}
