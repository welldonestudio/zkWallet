import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import HomeIcon from '@mui/icons-material/Home';
import LoopIcon from '@mui/icons-material/Loop';
import {
  Box,
  Breadcrumbs,
  Container,
  Fade,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';

import Footer from './footer';
import NavBar from './navbar';

import { selectAuthState } from '@/store/slice/authSlice';

interface LayoutProps {
  breadcrumbs: {
    name: string;
    path?: string;
  }[];
  initialized?: boolean;
  actions: JSX.Element;
  children: React.ReactNode;
}

export default function Layout({
  breadcrumbs,
  initialized,
  actions,
  children,
}: LayoutProps) {
  const authState = useSelector(selectAuthState);

  return (
    <>
      <NavBar />

      <main>
        <Container maxWidth="lg" sx={{ padding: 2 }}>
          <Stack spacing={2} marginY={2}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexGrow: 1,
                }}
              >
                {initialized && authState && (
                  <Breadcrumbs>
                    {breadcrumbs.length ? (
                      <Link href="/" style={{ textDecoration: 'none' }}>
                        <Typography variant="h4" color="white">
                          <Box marginTop={0.5}>
                            <HomeIcon />
                          </Box>
                        </Typography>
                      </Link>
                    ) : (
                      <Typography variant="h4" color="white">
                        <Box marginTop={0.5}>
                          <HomeIcon />
                        </Box>
                      </Typography>
                    )}
                    {breadcrumbs.map((item, key) => {
                      return item.path ? (
                        <Link
                          href={item.path}
                          style={{ textDecoration: 'none' }}
                          key={key}
                        >
                          <Typography variant="h4" color="white">
                            {item.name}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography
                          variant="h4"
                          key={key}
                        >{`${item.name}`}</Typography>
                      );
                    })}
                  </Breadcrumbs>
                )}
              </Box>
              {initialized && actions}
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
