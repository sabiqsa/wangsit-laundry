'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import IronIcon from '@mui/icons-material/Iron';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HistoryIcon from '@mui/icons-material/History';
import NextLink from 'next/link';

export default function HomePage() {
  return (
    <Box>
      {/* Hero — full viewport, dark */}
      <Box
        sx={{
          bgcolor: '#000000',
          color: '#f5f5f7',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '48px', md: '80px' },
            fontWeight: 700,
            letterSpacing: '-0.005em',
            color: '#f5f5f7',
            mb: 2,
            lineHeight: 1.1,
          }}
        >
          Wangsit Laundry
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '19px', md: '28px' },
            fontWeight: 400,
            color: '#6e6e73',
            mb: 6,
            maxWidth: 580,
          }}
        >
          Layanan laundry profesional. Cuci, setrika, dan lebih banyak lagi.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            component="a"
            href="/order"
            variant="contained"
            color="primary"
            size="large"
          >
            Buat Order
          </Button>
          <Button
            component={NextLink}
            href="/track"
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#0071e3',
              color: '#0071e3',
              '&:hover': { borderColor: '#0077ed', bgcolor: 'transparent' },
            }}
          >
            Lacak Order
          </Button>
        </Box>
      </Box>

      {/* Services — light gray */}
      <Box sx={{ bgcolor: '#f5f5f7', py: '120px', px: 2 }}>
        <Container maxWidth="md">
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '32px', md: '48px' },
              fontWeight: 700,
              letterSpacing: '-0.005em',
              textAlign: 'center',
              color: '#1d1d1f',
              mb: 1,
            }}
          >
            Layanan Kami
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: '#6e6e73',
              fontSize: { xs: '17px', md: '21px' },
              mb: 8,
            }}
          >
            Semua yang Anda butuhkan, dalam satu tempat.
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: (
                  <LocalLaundryServiceIcon
                    sx={{ fontSize: 48, color: '#0071e3' }}
                  />
                ),
                title: 'Cuci Lipat',
                desc: 'Cucian bersih, wangi, dan dilipat rapi untuk Anda.',
              },
              {
                icon: <IronIcon sx={{ fontSize: 48, color: '#0071e3' }} />,
                title: 'Setrika',
                desc: 'Pakaian rapi bebas kusut, siap dipakai.',
              },
              {
                icon: (
                  <LocalLaundryServiceIcon
                    sx={{ fontSize: 48, color: '#0071e3' }}
                  />
                ),
                title: 'Cuci + Setrika',
                desc: 'Paket lengkap cuci, setrika, dan lipat.',
              },
            ].map((item) => (
              <Grid item xs={12} sm={4} key={item.title}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    height: '100%',
                    bgcolor: '#ffffff',
                  }}
                >
                  <CardContent>
                    {item.icon}
                    <Typography
                      sx={{
                        fontWeight: 700,
                        mt: 2,
                        color: '#1d1d1f',
                        fontSize: '19px',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#6e6e73',
                        mt: 1,
                        fontSize: '15px',
                        lineHeight: 1.5,
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Quick access — white */}
      <Box sx={{ bgcolor: '#ffffff', py: '120px', px: 2 }}>
        <Container maxWidth="md">
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '32px', md: '48px' },
              fontWeight: 700,
              letterSpacing: '-0.005em',
              textAlign: 'center',
              color: '#1d1d1f',
              mb: 1,
            }}
          >
            Fitur Lainnya
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: '#6e6e73',
              fontSize: { xs: '17px', md: '21px' },
              mb: 8,
            }}
          >
            Pantau dan kelola order Anda dengan mudah.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <NextLink href="/track" style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    p: 2,
                    bgcolor: '#f5f5f7',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'scale(1.02)' },
                  }}
                >
                  <CardContent>
                    <TrackChangesIcon
                      sx={{ fontSize: 40, color: '#0071e3', mb: 1 }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '19px',
                        color: '#1d1d1f',
                      }}
                    >
                      Lacak Order
                    </Typography>
                    <Typography
                      sx={{ color: '#6e6e73', mt: 0.5, fontSize: '15px' }}
                    >
                      Cek status cucian tanpa login
                    </Typography>
                  </CardContent>
                </Card>
              </NextLink>
            </Grid>
            <Grid item xs={12} sm={6}>
              <NextLink href="/history" style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    p: 2,
                    bgcolor: '#f5f5f7',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'scale(1.02)' },
                  }}
                >
                  <CardContent>
                    <HistoryIcon
                      sx={{ fontSize: 40, color: '#0071e3', mb: 1 }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '19px',
                        color: '#1d1d1f',
                      }}
                    >
                      Riwayat Order
                    </Typography>
                    <Typography
                      sx={{ color: '#6e6e73', mt: 0.5, fontSize: '15px' }}
                    >
                      Lihat semua order Anda
                    </Typography>
                  </CardContent>
                </Card>
              </NextLink>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#f5f5f7',
          borderTop: '1px solid #d2d2d7',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: '#6e6e73', fontSize: '13px' }}>
          © {new Date().getFullYear()} Wangsit Laundry - Semua hak dilindungi.
        </Typography>
      </Box>
    </Box>
  );
}
