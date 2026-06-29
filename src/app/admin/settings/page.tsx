import { Box, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { SettingsForm } from "@/features/admin/SettingsForm";

export default function AdminSettingsPage() {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <SettingsIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Pengaturan
        </Typography>
      </Box>
      <SettingsForm />
    </Box>
  );
}
