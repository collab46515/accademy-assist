import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Gift, Heart } from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import { format } from "date-fns";

export function LibraryDonations() {
  const { donations, createDonation, isLoading } = useLibraryData();
  const [showAdd, setShowAdd] = useState(false);
  const [newDonation, setNewDonation] = useState({
    donation_number: "",
    donation_date: new Date().toISOString().split('T')[0],
    donor_name: "",
    donor_type: "individual",
    donor_address: "",
    donor_contact: "",
    donor_email: "",
    purpose: "",
    occasion: "",
    total_books: "",
    estimated_value: "",
    acknowledgement_sent: false,
    remarks: "",
  });

  const handleAdd = async () => {
    await createDonation({
      donation_number: newDonation.donation_number || `DN-${Date.now()}`,
      donation_date: newDonation.donation_date,
      donor_name: newDonation.donor_name,
      donor_type: newDonation.donor_type,
      donor_address: newDonation.donor_address || null,
      donor_contact: newDonation.donor_contact || null,
      donor_email: newDonation.donor_email || null,
      purpose: newDonation.purpose || null,
      occasion: newDonation.occasion || null,
      total_books: parseInt(newDonation.total_books) || 0,
      estimated_value: newDonation.estimated_value ? parseFloat(newDonation.estimated_value) : null,
      acknowledgement_sent: newDonation.acknowledgement_sent,
      remarks: newDonation.remarks || null,
    });
    setShowAdd(false);
    setNewDonation({
      donation_number: "",
      donation_date: new Date().toISOString().split('T')[0],
      donor_name: "",
      donor_type: "individual",
      donor_address: "",
      donor_contact: "",
      donor_email: "",
      purpose: "",
      occasion: "",
      total_books: "",
      estimated_value: "",
      acknowledgement_sent: false,
      remarks: "",
    });
  };

  const totalDonatedBooks = donations.reduce((sum, d) => sum + d.total_books, 0);
  const totalDonatedValue = donations.reduce((sum, d) => sum + (d.estimated_value || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Donation Register</h2>
          <p className="text-muted-foreground">Track book donations and acknowledgements</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Donation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New Donation</DialogTitle>
              <DialogDescription>Enter donation and donor details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dnNumber">Donation Number</Label>
                  <Input
                    id="dnNumber"
                    value={newDonation.donation_number}
                    onChange={(e) => setNewDonation({ ...newDonation, donation_number: e.target.value })}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <Label htmlFor="dnDate">Donation Date *</Label>
                  <Input
                    id="dnDate"
                    type="date"
                    value={newDonation.donation_date}
                    onChange={(e) => setNewDonation({ ...newDonation, donation_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Donor Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="donorName">Donor Name *</Label>
                    <Input
                      id="donorName"
                      value={newDonation.donor_name}
                      onChange={(e) => setNewDonation({ ...newDonation, donor_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="donorType">Donor Type</Label>
                    <Select value={newDonation.donor_type} onValueChange={(v) => setNewDonation({ ...newDonation, donor_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="publisher">Publisher</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="donorContact">Contact</Label>
                    <Input
                      id="donorContact"
                      value={newDonation.donor_contact}
                      onChange={(e) => setNewDonation({ ...newDonation, donor_contact: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="donorEmail">Email</Label>
                    <Input
                      id="donorEmail"
                      type="email"
                      value={newDonation.donor_email}
                      onChange={(e) => setNewDonation({ ...newDonation, donor_email: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="donorAddress">Address</Label>
                    <Input
                      id="donorAddress"
                      value={newDonation.donor_address}
                      onChange={(e) => setNewDonation({ ...newDonation, donor_address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Donation Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalBooks">Total Books</Label>
                    <Input
                      id="totalBooks"
                      type="number"
                      value={newDonation.total_books}
                      onChange={(e) => setNewDonation({ ...newDonation, total_books: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estValue">Estimated Value (₹)</Label>
                    <Input
                      id="estValue"
                      type="number"
                      value={newDonation.estimated_value}
                      onChange={(e) => setNewDonation({ ...newDonation, estimated_value: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="occasion">Occasion</Label>
                    <Input
                      id="occasion"
                      value={newDonation.occasion}
                      onChange={(e) => setNewDonation({ ...newDonation, occasion: e.target.value })}
                      placeholder="e.g., Annual Day, Founding Day"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      value={newDonation.purpose}
                      onChange={(e) => setNewDonation({ ...newDonation, purpose: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={newDonation.acknowledgement_sent}
                  onCheckedChange={(checked) => setNewDonation({ ...newDonation, acknowledgement_sent: checked })}
                />
                <Label>Acknowledgement Sent</Label>
              </div>

              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={newDonation.remarks}
                  onChange={(e) => setNewDonation({ ...newDonation, remarks: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newDonation.donor_name}>
                Record Donation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">donors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Books Donated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonatedBooks}</div>
            <p className="text-xs text-muted-foreground">total books</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estimated Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDonatedValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">total value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Donation Records
          </CardTitle>
          <CardDescription>All book donation transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DN Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Books</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Accession Range</TableHead>
                <TableHead>Acknowledged</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No donation records found
                  </TableCell>
                </TableRow>
              ) : (
                donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <code className="font-mono">{donation.donation_number}</code>
                    </TableCell>
                    <TableCell>{format(new Date(donation.donation_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{donation.donor_name}</p>
                        <p className="text-xs text-muted-foreground">{donation.donor_contact || donation.donor_email || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{donation.donor_type || "individual"}</Badge>
                    </TableCell>
                    <TableCell>{donation.total_books}</TableCell>
                    <TableCell>{donation.estimated_value ? `₹${donation.estimated_value.toFixed(2)}` : "-"}</TableCell>
                    <TableCell>
                      {donation.accession_start && donation.accession_end
                        ? `${donation.accession_start} - ${donation.accession_end}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={donation.acknowledgement_sent ? "default" : "secondary"}>
                        {donation.acknowledgement_sent ? "Yes" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
