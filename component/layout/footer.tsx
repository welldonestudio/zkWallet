import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';

export const footerHeight = '180px';

export default function Footer() {
  return (
    <footer style={{ height: footerHeight }}>
      <Container maxWidth="lg">
        <Grid container direction="row" sx={{ paddingX: 4 }}>
          <Grid
            container
            item
            direction="column"
            alignItems={{ xs: 'center', sm: 'flex-start' }}
            xs={12}
            sm={6}
          >
            <Grid item>
              <Image
                src="/images/welldone_studio_logo.svg"
                width={128}
                height={38}
                alt="WELLDONE Studio"
              />
            </Grid>
            <Grid item>
              <Stack direction="row" sx={{ paddingTop: '20px' }}>
                <a
                  target="_blank"
                  href="https://github.com/welldonestudio/CosmDiver/issues"
                  rel="noopener noreferrer"
                >
                  <Box>
                    <Image
                      src="/images/question_icon.svg"
                      width={24}
                      height={24}
                      alt="Issues"
                    />
                  </Box>
                </a>

                <a
                  target="_blank"
                  href="https://twitter.com/WelldoneStudio_"
                  rel="noopener noreferrer"
                >
                  <Box sx={{ paddingLeft: '28px' }}>
                    <Image
                      src="/images/twitter_icon.svg"
                      width={24}
                      height={24}
                      alt="Twitter"
                    />
                  </Box>
                </a>

                <a
                  target="_blank"
                  href="https://medium.com/dsrv"
                  rel="noopener noreferrer"
                >
                  <Box sx={{ paddingLeft: '28px' }}>
                    <Image
                      src="/images/medium_icon.svg"
                      width={24}
                      height={24}
                      alt="Medium"
                    />
                  </Box>
                </a>
              </Stack>
            </Grid>
          </Grid>

          <Grid
            container
            item
            direction="column"
            alignItems={{ xs: 'center', sm: 'flex-end' }}
            textAlign={{ xs: 'center', sm: 'right' }}
            xs={12}
            sm={6}
          >
            <Grid item>
              <Typography variant="subtitle2" sx={{ color: '#8F98AE' }}>
                38, Bongeunsa-ro 20-gil, Gangnam-gu,
                <br />
                Seoul, Republic of Korea
              </Typography>
            </Grid>
            <Grid item>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{ paddingTop: '20px' }}
              >
                <Typography variant="subtitle2" sx={{ color: '#8F98AE' }}>
                  © DSRV labs.
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#8F98AE' }}>
                  All Rights Reserved.
                </Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                sx={{ paddingTop: '20px' }}
                spacing="10px"
              >
                <Typography variant="subtitle2" sx={{ color: '#8F98AE' }}>
                  Built by
                </Typography>
                <a
                  target="_blank"
                  href="https://www.dsrvlabs.com/"
                  rel="noopener noreferrer"
                  style={{ paddingRight: '12px' }}
                >
                  <Box sx={{ paddingLeft: '28px' }}>
                    <Image
                      src="/images/dsrv.svg"
                      width={80}
                      height={27}
                      alt="Medium"
                    />
                  </Box>
                </a>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}
