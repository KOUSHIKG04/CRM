import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../contexts/AuthContext";
import * as leadService from "../services/leadService";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Textarea } from "@/components/ui/textarea";

const CALL_RESPONSES = [
  { value: "discussed", label: "DISCUSSED" },
  { value: "callback", label: "CALL BACK" },
  { value: "interested", label: "INTERESTED" },
  { value: "busy", label: "BUSY" },
  { value: "rnr", label: "RNR" },
  { value: "switched_off", label: "SWITCHED OFF" },
];

const TelecallerPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ type: null, open: false });
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "pending",
    callResponse: null,
    callNotes: "",
    nextCallDate: null,
  });
  const [callDialog, setCallDialog] = useState(false);
  const [callResponse, setCallResponse] = useState("");
  const [callNotes, setCallNotes] = useState("");
  const [nextCallDate, setNextCallDate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getLeads();
      // Filter leads to only show those assigned to the current telecaller
      const filteredLeads = data.filter(
        (lead) => lead.assignedTo?._id === user.id
      );
      setLeads(filteredLeads);
    } catch (err) {
      toast.error(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (type, lead = null) => {
    // Only allow editing leads assigned to the current telecaller
    if (lead && lead.assignedTo?._id !== user.id) {
      toast.error("You can only edit leads assigned to you");
      return;
    }

    setSelectedLead(lead);
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
        status: lead.status,
        callResponse: lead.callResponse || null,
        callNotes: lead.callNotes || "",
        nextCallDate: lead.nextCallDate ? new Date(lead.nextCallDate) : null,
      });
    } else {
      clearFormData();
    }
    setDialog({ type, open: true });
  };

  const closeDialog = () => {
    setDialog({ type: null, open: false });
    clearFormData();
    setSelectedLead(null);
  };

  const clearFormData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "pending",
      callResponse: null,
      callNotes: "",
      nextCallDate: null,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...formData,
        assignedTo: user.id, // Ensure the lead is assigned to the current telecaller
      };

      let updatedLead;
      if (dialog.type === "add") {
        updatedLead = await leadService.addLead(dataToSend);
        setLeads((prevLeads) => [updatedLead, ...prevLeads]);
        toast.success("Lead added successfully");
      } else if (dialog.type === "edit") {
        if (selectedLead.assignedTo?._id !== user.id) {
          toast.error("You can only edit leads assigned to you");
          return;
        }
        updatedLead = await leadService.updateLead(
          selectedLead._id,
          dataToSend
        );
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === updatedLead._id ? updatedLead : lead
          )
        );
        toast.success("Lead updated successfully");
      }
      closeDialog();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save lead");
    }
  };

  const handleDelete = async (id) => {
    const lead = leads.find((l) => l._id === id);
    if (lead.assignedTo?._id !== user.id) {
      toast.error("You can only delete leads assigned to you");
      return;
    }

    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        await leadService.deleteLead(id);
        setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
        toast.success("Lead deleted successfully");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete lead");
      }
    }
  };

  const handleCallClick = (lead) => {
    if (lead.assignedTo?._id !== user.id) {
      toast.error("You can only update calls for leads assigned to you");
      return;
    }

    setSelectedLead(lead);
    setCallResponse("");
    setCallNotes("");
    setNextCallDate(null);
    setCallDialog(true);
  };

  const handleCallSubmit = async () => {
    try {
      if (selectedLead.assignedTo?._id !== user.id) {
        toast.error("You can only update calls for leads assigned to you");
        return;
      }

      const updatedLead = await leadService.updateCallResponse(
        selectedLead._id,
        {
          callResponse,
          callNotes,
          nextCallDate,
          isConnected,
        }
      );

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === updatedLead._id ? updatedLead : lead
        )
      );

      toast.success("Call response updated successfully");
      setCallDialog(false);
      clearCallForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update call response"
      );
    }
  };

  const clearCallForm = () => {
    setCallResponse("");
    setCallNotes("");
    setNextCallDate(null);
    setSelectedLead(null);
    setIsConnected(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 animate-spin border-t-blue-400 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">MY LEADS</h1>
        <Button onClick={() => openDialog("add")} className="cursor-pointer">
          ADD LEAD
        </Button>
      </div>

      <Card className={"p-4 overflow-auto"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>PHONE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>LAST CALL</TableHead>
              <TableHead>NEXT CALL</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{lead.name.toUpperCase()}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone.toUpperCase()}</TableCell>
                <TableCell>{lead.status.toUpperCase()}</TableCell>
                <TableCell>
                  {lead.lastCallDate
                    ? format(new Date(lead.lastCallDate), "PPp")
                    : "-"}
                </TableCell>
                <TableCell>
                  {lead.nextCallDate
                    ? format(new Date(lead.nextCallDate), "PPp")
                    : "-"}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleCallClick(lead)}
                    className={"text-xs cursor-pointer"}
                    disabled={lead.assignedTo?._id !== user.id}
                  >
                    UPDATE CALL
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog("edit", lead)}
                    className={"text-xs cursor-pointer"}
                    disabled={lead.assignedTo?._id !== user.id}
                  >
                    EDIT
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(lead._id)}
                    className={"text-xs cursor-pointer"}
                    disabled={lead.assignedTo?._id !== user.id}
                  >
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialog.open} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"p-3 text-center"}>
              {dialog.type === "add"
                ? "ADD LEAD"
                : dialog.type === "edit"
                ? "EDIT LEAD"
                : "Update Status"}
            </DialogTitle>
          </DialogHeader>
          {dialog.type === "status" ? (
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">PENDING</SelectItem>
                <SelectItem value="contacted">CONTACTED</SelectItem>
                <SelectItem value="interested">INTERESTED</SelectItem>
                <SelectItem value="not-interested">NOT INTERESTED</SelectItem>
                <SelectItem value="callback">CALL BACK</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="grid gap-4 py-4 px-4">
              <div>
                <Label className={"mb-2"}>NAME</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className={"mb-2"}>EMAIL</Label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className={"mb-2"}>PHONE</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className={"mb-2"}>ADDRESS</Label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              className="cursor-pointer"
            >
              CANCEL
            </Button>
            <Button onClick={handleSave} className="cursor-pointer">
              SAVE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={callDialog} onOpenChange={setCallDialog}>
        <DialogContent>
          <DialogHeader className={"text-center text-sm"}>
            <DialogTitle>UPDATE CALL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-3">
            <div className="flex gap-4">
              <Button
                variant={isConnected ? "default" : "outline"}
                onClick={() => setIsConnected(true)}
                className="flex-1"
              >
                CONNECTED
              </Button>
              <Button
                variant={!isConnected ? "default" : "outline"}
                onClick={() => setIsConnected(false)}
                className="flex-1"
              >
                NOT CONNECTED
              </Button>
            </div>

            <Label>CALL RESPONSE</Label>
            <Select value={callResponse} onValueChange={setCallResponse}>
              <SelectTrigger>
                <SelectValue placeholder="Select Response" />
              </SelectTrigger>
              <SelectContent>
                {isConnected ? (
                  <>
                    <SelectItem value="discussed">DISCUSSED</SelectItem>
                    <SelectItem value="callback">CALL BACK</SelectItem>
                    <SelectItem value="interested">INTERESTED</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="busy">BUSY</SelectItem>
                    <SelectItem value="rnr">RINGING NO RESPONSE</SelectItem>
                    <SelectItem value="switched_off">SWITCHED OFF</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            <div>
              <Label className={"mb-2"}>CALL NOTES</Label>
              <Textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="ENTER CALL NOTES..."
                className="h-8"
              />
            </div>
            <div>
              <Label className={"mb-2"}>NEXT CALL DATE</Label>
              <div className="relative">
                <DatePicker
                  selected={nextCallDate}
                  onChange={(date) => setNextCallDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="SELECT DATE & TIME"
                  className="w-full bg-white rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  minDate={new Date()}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCallDialog(false)}
              className="cursor-pointer"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleCallSubmit}
              disabled={!callResponse}
              className="cursor-pointer"
            >
              SUBMIT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TelecallerPage;
