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
import { Plus, ShoppingCart, FileText } from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import { format } from "date-fns";

export function LibraryPurchases() {
  const { purchases, createPurchase, isLoading } = useLibraryData();
  const [showAdd, setShowAdd] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    purchase_number: "",
    purchase_date: new Date().toISOString().split('T')[0],
    vendor_name: "",
    vendor_address: "",
    vendor_contact: "",
    vendor_gst: "",
    invoice_number: "",
    invoice_date: "",
    invoice_amount: "",
    total_books: "",
    total_amount: "",
    net_amount: "",
    payment_status: "pending",
    remarks: "",
  });

  const handleAdd = async () => {
    await createPurchase({
      purchase_number: newPurchase.purchase_number || `PO-${Date.now()}`,
      purchase_date: newPurchase.purchase_date,
      vendor_name: newPurchase.vendor_name,
      vendor_address: newPurchase.vendor_address || null,
      vendor_contact: newPurchase.vendor_contact || null,
      vendor_gst: newPurchase.vendor_gst || null,
      invoice_number: newPurchase.invoice_number || null,
      invoice_date: newPurchase.invoice_date || null,
      invoice_amount: newPurchase.invoice_amount ? parseFloat(newPurchase.invoice_amount) : null,
      total_books: parseInt(newPurchase.total_books) || 0,
      total_amount: parseFloat(newPurchase.total_amount) || 0,
      net_amount: parseFloat(newPurchase.net_amount) || 0,
      payment_status: newPurchase.payment_status,
      remarks: newPurchase.remarks || null,
    });
    setShowAdd(false);
    setNewPurchase({
      purchase_number: "",
      purchase_date: new Date().toISOString().split('T')[0],
      vendor_name: "",
      vendor_address: "",
      vendor_contact: "",
      vendor_gst: "",
      invoice_number: "",
      invoice_date: "",
      invoice_amount: "",
      total_books: "",
      total_amount: "",
      net_amount: "",
      payment_status: "pending",
      remarks: "",
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'paid': return <Badge variant="default">Paid</Badge>;
      case 'partial': return <Badge variant="secondary">Partial</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Purchase Register</h2>
          <p className="text-muted-foreground">Track book purchases and vendor details</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Purchase
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New Purchase</DialogTitle>
              <DialogDescription>Enter purchase order and vendor details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="poNumber">Purchase Order Number</Label>
                  <Input
                    id="poNumber"
                    value={newPurchase.purchase_number}
                    onChange={(e) => setNewPurchase({ ...newPurchase, purchase_number: e.target.value })}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <Label htmlFor="poDate">Purchase Date *</Label>
                  <Input
                    id="poDate"
                    type="date"
                    value={newPurchase.purchase_date}
                    onChange={(e) => setNewPurchase({ ...newPurchase, purchase_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Vendor Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendor">Vendor Name *</Label>
                    <Input
                      id="vendor"
                      value={newPurchase.vendor_name}
                      onChange={(e) => setNewPurchase({ ...newPurchase, vendor_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendorContact">Contact</Label>
                    <Input
                      id="vendorContact"
                      value={newPurchase.vendor_contact}
                      onChange={(e) => setNewPurchase({ ...newPurchase, vendor_contact: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="vendorAddress">Address</Label>
                    <Input
                      id="vendorAddress"
                      value={newPurchase.vendor_address}
                      onChange={(e) => setNewPurchase({ ...newPurchase, vendor_address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gst">GST Number</Label>
                    <Input
                      id="gst"
                      value={newPurchase.vendor_gst}
                      onChange={(e) => setNewPurchase({ ...newPurchase, vendor_gst: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Invoice Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoice">Invoice Number</Label>
                    <Input
                      id="invoice"
                      value={newPurchase.invoice_number}
                      onChange={(e) => setNewPurchase({ ...newPurchase, invoice_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={newPurchase.invoice_date}
                      onChange={(e) => setNewPurchase({ ...newPurchase, invoice_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalBooks">Total Books</Label>
                    <Input
                      id="totalBooks"
                      type="number"
                      value={newPurchase.total_books}
                      onChange={(e) => setNewPurchase({ ...newPurchase, total_books: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoiceAmount">Invoice Amount (₹)</Label>
                    <Input
                      id="invoiceAmount"
                      type="number"
                      value={newPurchase.invoice_amount}
                      onChange={(e) => setNewPurchase({ ...newPurchase, invoice_amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalAmount">Total Amount (₹)</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={newPurchase.total_amount}
                      onChange={(e) => setNewPurchase({ ...newPurchase, total_amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="netAmount">Net Amount (₹)</Label>
                    <Input
                      id="netAmount"
                      type="number"
                      value={newPurchase.net_amount}
                      onChange={(e) => setNewPurchase({ ...newPurchase, net_amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="payStatus">Payment Status</Label>
                    <Select value={newPurchase.payment_status} onValueChange={(v) => setNewPurchase({ ...newPurchase, payment_status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={newPurchase.remarks}
                  onChange={(e) => setNewPurchase({ ...newPurchase, remarks: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newPurchase.vendor_name}>
                Record Purchase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase Records
          </CardTitle>
          <CardDescription>All book purchase transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Books</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Accession Range</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No purchase records found
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <code className="font-mono">{purchase.purchase_number}</code>
                    </TableCell>
                    <TableCell>{format(new Date(purchase.purchase_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{purchase.vendor_name}</p>
                        <p className="text-xs text-muted-foreground">{purchase.vendor_contact || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell>{purchase.invoice_number || "-"}</TableCell>
                    <TableCell>{purchase.total_books}</TableCell>
                    <TableCell>₹{purchase.net_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {purchase.accession_start && purchase.accession_end
                        ? `${purchase.accession_start} - ${purchase.accession_end}`
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(purchase.payment_status)}</TableCell>
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
