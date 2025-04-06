import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../contexts/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [connectedCalls, setConnectedCalls] = useState([]);
  const [error, setError] = useState(null);
  const { axiosInstance } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, callsResponse] = await Promise.all([
          axiosInstance.get("/api/users/dashboard/stats"),
          axiosInstance.get("/api/leads"),
        ]);
        setStats(statsResponse.data);
        setConnectedCalls(callsResponse.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data. Please try again later.");
      }
    };

    fetchData();
  }, [axiosInstance]);

  const chartData = {
    labels: stats?.callTrends?.map((trend) => trend._id) || [],
    datasets: [
      {
        label: "Calls per Day",
        data: stats?.callTrends?.map((trend) => trend.count) || [],
        backgroundColor: "rgba(25, 118, 210, 0.5)",
        borderColor: "rgba(25, 118, 210, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Call Trends (Last 7 Days)",
      },
    },
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Total Telecallers
            </Typography>
            <Typography variant="h4">{stats?.totalTelecallers || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Total Leads
            </Typography>
            <Typography variant="h4">{stats?.totalLeads || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Connected Calls
            </Typography>
            <Typography variant="h4">{stats?.connectedCalls || 0}</Typography>
          </Paper>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Box sx={{ height: 400 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Call Records Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Call Records
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Call Date & Time</TableCell>
                    <TableCell>Telecaller</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Call Response</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {connectedCalls?.map((call) => (
                    <TableRow key={call._id}>
                      <TableCell>{call.name}</TableCell>
                      <TableCell>
                        {new Date(call.lastCallDate).toLocaleString()}
                      </TableCell>
                      <TableCell>{call.assignedTo?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: getStatusColor(call.status),
                            fontWeight: "bold",
                          }}
                        >
                          {formatStatus(call.status)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: getResponseColor(call.callResponse),
                            fontWeight: "bold",
                          }}
                        >
                          {formatResponse(call.callResponse)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!connectedCalls || connectedCalls.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No call records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// Helper functions for status formatting and colors
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#ff9800"; // Orange
    case "contacted":
      return "#2196f3"; // Blue
    case "interested":
      return "#4caf50"; // Green
    case "not-interested":
      return "#f44336"; // Red
    case "callback":
      return "#9c27b0"; // Purple
    default:
      return "#000000"; // Black
  }
};

const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "contacted":
      return "Contacted";
    case "interested":
      return "Interested";
    case "not-interested":
      return "Not Interested";
    case "callback":
      return "Callback";
    default:
      return status;
  }
};

const getResponseColor = (response) => {
  switch (response) {
    case "discussed":
      return "#4caf50"; // Green
    case "callback":
      return "#9c27b0"; // Purple
    case "interested":
      return "#4caf50"; // Green
    case "busy":
      return "#ff9800"; // Orange
    case "rnr":
      return "#f44336"; // Red
    case "switched_off":
      return "#607d8b"; // Grey
    default:
      return "#000000"; // Black
  }
};

const formatResponse = (response) => {
  if (!response) return "-"; // Return dash for null/undefined responses

  switch (response) {
    case "discussed":
      return "Discussed";
    case "callback":
      return "Callback";
    case "interested":
      return "Interested";
    case "busy":
      return "Busy";
    case "rnr":
      return "Ringing No Response";
    case "switched_off":
      return "Switched Off";
    default:
      return response; // Return the actual value if it's something unexpected
  }
};

export default Dashboard;
