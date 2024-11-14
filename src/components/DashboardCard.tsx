import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  link: string;
}

export default function DashboardCard({ title, icon, description, link }: DashboardCardProps) {
  return (
    <Link href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ textAlign: 'center' }}>
        {icon}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Link>
  );
} 