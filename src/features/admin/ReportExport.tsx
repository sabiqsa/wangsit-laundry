"use client";

import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Papa from "papaparse";
import jsPDF from "jspdf";

interface ReportExportProps {
  period: "daily" | "weekly" | "monthly";
}

export function ReportExport({ period }: ReportExportProps) {
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const res = await fetch(`/api/admin/reports?period=${period}`);
    const result = await res.json();
    return result.data?.chart ?? [];
  };

  const exportCSV = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      const csv = Papa.unparse(
        data.map((item: { _id: string; total: number; count: number }) => ({
          Periode: item._id,
          Pendapatan: item.total,
          "Jumlah Order": item.count,
        }))
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `laporan-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Laporan Pendapatan Wangsit Laundry", 20, 20);
      doc.setFontSize(11);
      doc.text(`Periode: ${period === "daily" ? "Harian" : period === "weekly" ? "Mingguan" : "Bulanan"}`, 20, 30);
      doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, 20, 38);

      let y = 52;
      doc.setFontSize(10);
      doc.text("Periode", 20, y);
      doc.text("Pendapatan (Rp)", 80, y);
      doc.text("Jumlah Order", 150, y);
      y += 8;
      doc.line(20, y, 190, y);
      y += 6;

      for (const item of data) {
        doc.text(item._id, 20, y);
        doc.text(item.total.toLocaleString("id-ID"), 80, y);
        doc.text(String(item.count), 150, y);
        y += 7;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      }

      doc.save(`laporan-${period}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Button
        variant="outlined"
        size="small"
        startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
        onClick={exportCSV}
        disabled={loading}
      >
        Export CSV
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
        onClick={exportPDF}
        disabled={loading}
      >
        Export PDF
      </Button>
    </Box>
  );
}
