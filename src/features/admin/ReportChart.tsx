"use client";

import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useReports } from "@/hooks/useReports";

export function ReportChart() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const { data, isLoading } = useReports(period);

  const chartData = data?.chart.map((item) => ({
    name: item._id,
    total: item.total,
    count: item.count,
  })) ?? [];

  const formatCurrency = (value: number) =>
    `Rp ${(value / 1000).toFixed(0)}rb`;

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: "Total Pendapatan",
            value: isLoading ? null : `Rp ${(data?.summary.totalRevenue || 0).toLocaleString("id-ID")}`,
            color: "primary.main",
          },
          {
            label: "Total Order",
            value: isLoading ? null : String(data?.summary.totalOrders || 0),
            color: "success.main",
          },
          {
            label: "Order Pending",
            value: isLoading ? null : String(data?.summary.pendingOrders || 0),
            color: "warning.main",
          },
        ].map((item) => (
          <Grid item xs={12} sm={4} key={item.label}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                {isLoading ? (
                  <Skeleton variant="text" width="60%" height={36} />
                ) : (
                  <Typography variant="h5" sx={{ fontWeight: "bold" }} color={item.color}>
                    {item.value}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Period Toggle */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <ButtonGroup size="small">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "contained" : "outlined"}
              onClick={() => setPeriod(p)}
            >
              {p === "daily" ? "Harian" : p === "weekly" ? "Mingguan" : "Bulanan"}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Pendapatan {period === "daily" ? "30 Hari" : period === "weekly" ? "3 Bulan" : "12 Bulan"} Terakhir
          </Typography>
          {isLoading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : chartData.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography color="text.secondary">Belum ada data pendapatan</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: unknown) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Pendapatan"]}
                />
                <Bar dataKey="total" fill="#1976d2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
