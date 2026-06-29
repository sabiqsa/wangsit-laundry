"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import { ReportChart } from "@/features/admin/ReportChart";
import { ReportExport } from "@/features/admin/ReportExport";

export default function AdminReportsPage() {
  const [period] = useState<"daily" | "weekly" | "monthly">("daily");

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <BarChartIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Laporan Pendapatan
          </Typography>
        </Box>
        <ReportExport period={period} />
      </Box>
      <ReportChart />
    </Box>
  );
}
