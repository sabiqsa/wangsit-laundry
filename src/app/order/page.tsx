import { Container, Typography, Box } from "@mui/material";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import { OrderForm } from "@/features/order/OrderForm";

export default function OrderPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocalLaundryServiceIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Buat Order Laundry
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Isi formulir di bawah untuk membuat order laundry baru
        </Typography>
      </Box>
      <OrderForm />
    </Container>
  );
}
