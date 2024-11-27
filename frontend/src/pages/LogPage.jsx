import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
  Card,
  CardContent,
  Divider, // For adding separator
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation to the dashboard

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // To track the current page
  const [totalLogs, setTotalLogs] = useState(0); // To track the total number of logs
  const logsPerPage = 25; // Number of logs per page
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate(); // For navigating to the Dashboard

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/logs", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: page, // Send current page
            limit: logsPerPage, // Send number of records per page
          },
          withCredentials: true, // Send cookies with the request
        });

        // Log the response to verify the data
        console.log("Fetched Logs:", response.data);

        setLogs(response.data.logs || []); // Assuming the response contains logs array
        setTotalLogs(response.data.total || 0); // Assuming the response includes total logs
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLogs([]); // Set logs to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page, token]);

  const totalPages = Math.ceil(totalLogs / logsPerPage); // Calculate total pages

  const getRecordIndex = (index) => {
    return (page - 1) * logsPerPage + index + 1; // Index based on current page and logs per page
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      {/* Go to Dashboard button at top-right corner */}
      <Box position="absolute" top={20} left={20}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")} // Navigate to the dashboard page
        >
          Go to Dashboard
        </Button>
      </Box>

      {/* Embossed Card for the Topic */}
      <Card
        sx={{
          marginBottom: 4,
          padding: 2,
          backgroundColor: "black", // Dark background color
          boxShadow: 10, // Embossed shadow effect
          borderRadius: 2, // Rounded corners
          "&:hover": {
            boxShadow: 20, // Increase shadow on hover for emphasis
          },
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            color="primary"
            sx={{
              fontWeight: "bold",
              color: "white", // Light text color
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)", // Light shadow for stylish effect
            }}
          >
            User Activity Logging Page
          </Typography>
        </CardContent>
      </Card>

      {/* Card for page information */}
      <Card sx={{ marginBottom: 4, padding: 2, boxShadow: 5 }}>
        <CardContent>
          <Typography
            variant="h6"
            color="textSecondary"
            text
            sx={{
              fontWeight: "bold", // Make the text bold
            }}
          >
            Viewing Logs{" "}
            {`(${(page - 1) * logsPerPage + 1} - ${Math.min(
              page * logsPerPage,
              totalLogs
            )})`}{" "}
            of {totalLogs}
          </Typography>
        </CardContent>
      </Card>

      <TableContainer component={Paper} elevation={3} sx={{ boxShadow: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                No
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Method
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                URL
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Response Time
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                User
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Role
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <>
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { backgroundColor: "#f4f6f9" },
                    boxShadow: 2,
                  }}
                >
                  <TableCell align="center">{getRecordIndex(index)}</TableCell>
                  <TableCell align="center">{log.method}</TableCell>
                  <TableCell align="center">{log.url}</TableCell>
                  <TableCell align="center">{`${log.responseTime} ms`}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color:
                        log.status >= 200 && log.status < 300
                          ? "green" // Success status codes (e.g., 200, 201, 304)
                          : log.status >= 400 && log.status < 500
                          ? "orange" // Client errors (e.g., 404, 400)
                          : log.status >= 500
                          ? "red" // Server errors (e.g., 500)
                          : "grey", // Default color for unknown status codes
                    }}
                  >
                    {log.status}
                  </TableCell>

                  <TableCell align="center">{log.createdAt}</TableCell>
                  <TableCell align="center">{log.user}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color:
                        log.role.trim().toLowerCase() === "admin"
                          ? "green"
                          : log.role.trim().toLowerCase() === "user"
                          ? "yellow"
                          : "red",
                    }}
                  >
                    {log.role}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7}>
                    <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" marginTop={3}>
        <Button
          variant="outlined"
          onClick={() => {
            const newPage = Math.max(page - 1, 1);
            setPage(newPage);
          }}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const newPage = Math.min(page + 1, totalPages);
            setPage(newPage);
          }}
          disabled={page === totalPages}
          sx={{ marginLeft: 2 }}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default LogPage;
