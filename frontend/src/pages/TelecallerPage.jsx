import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import * as leadService from "../services/leadService";

const TelecallerPage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "pending",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getLeads();
      setLeads(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async () => {
    try {
      await leadService.addLead(formData);
      setOpenAddDialog(false);
      clearFormData();
      fetchLeads();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add lead");
    }
  };

  const handleUpdateLead = async () => {
    try {
      await leadService.updateLead(selectedLead._id, formData);
      setOpenEditDialog(false);
      clearFormData();
      fetchLeads();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to update lead");
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await leadService.deleteLead(id);
        fetchLeads();
        setError("");
      } catch (err) {
        setError(err.message || "Failed to delete lead");
      }
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await leadService.updateLeadStatus(selectedLead._id, formData.status);
      setOpenStatusDialog(false);
      fetchLeads();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const clearFormData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "pending",
    });
    setSelectedLead(null);
  };

  const openEdit = (lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      status: lead.status,
    });
    setOpenEditDialog(true);
  };

  const openStatus = (lead) => {
    setSelectedLead(lead);
    setFormData({ ...formData, status: lead.status });
    setOpenStatusDialog(true);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Lead Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
          sx={{ mb: 3 }}
        >
          Add New Lead
        </Button>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => openEdit(lead)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openStatus(lead)}
                      color="secondary"
                    >
                      <PhoneIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteLead(lead._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Lead Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="phone"
            label="Phone"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            name="address"
            label="Address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLead} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Lead</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="phone"
            label="Phone"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            name="address"
            label="Address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateLead} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
      >
        <DialogTitle>Update Call Status</DialogTitle>
        <DialogContent>
          <TextField
            name="status"
            select
            label="Status"
            fullWidth
            margin="normal"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="interested">Interested</MenuItem>
            <MenuItem value="not-interested">Not Interested</MenuItem>
            <MenuItem value="callback">Callback</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TelecallerPage;
