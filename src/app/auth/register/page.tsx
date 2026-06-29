import { Box, Card, CardContent, Typography } from "@mui/material";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import { RegisterForm } from "@/features/auth/RegisterForm";
import NextLink from "next/link";

export default function RegisterPage() {
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
              Daftar Akun Baru
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Wangsit Laundry
            </Typography>
          </Box>

          <RegisterForm />

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Sudah punya akun?{" "}
              <NextLink href="/auth/login" style={{ color: "inherit" }}>
                Masuk
              </NextLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
