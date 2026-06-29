"use client";

import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Tidak ada data",
  description = "Belum ada data untuk ditampilkan",
  icon,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      gap={2}
    >
      {icon || <InboxIcon sx={{ fontSize: 64, color: "text.secondary" }} />}
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" textAlign="center">
        {description}
      </Typography>
    </Box>
  );
}
