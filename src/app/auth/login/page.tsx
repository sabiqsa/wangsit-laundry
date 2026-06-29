import { Box, Card, CardContent, Typography } from "@mui/material";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import { LoginForm } from "@/features/auth/LoginForm";
import NextLink from "next/link";

export default function LoginPage() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      p={2}
    >
      <Card sx={{ width: "100%", maxWidth: 440 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <LocalLaundryServiceIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Wangsit Laundry
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Masuk ke akun Anda
            </Typography>
          </Box>

          <LoginForm />

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Belum punya akun?{" "}
              <NextLink href="/auth/register" style={{ color: "inherit" }}>
                Daftar sekarang
              </NextLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
