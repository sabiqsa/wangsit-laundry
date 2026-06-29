import { Box, Typography } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { PromoManager } from "@/features/admin/PromoManager";

export default function AdminPromosPage() {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <LocalOfferIcon color="primary" />
        <Typography variant="h5" fontWeight="bold">Kelola Promo</Typography>
      </Box>
      <PromoManager />
    </Box>
  );
}
