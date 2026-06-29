import { Typography, Box } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { OrderTable } from "@/features/admin/OrderTable";

export default function AdminOrdersPage() {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <ListAltIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Kelola Order
        </Typography>
      </Box>
      <OrderTable />
    </Box>
  );
}
