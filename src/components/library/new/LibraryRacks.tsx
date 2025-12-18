import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Archive, Edit, Trash2 } from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";

export function LibraryRacks() {
  const { racks, bookCopies, createRack, isLoading } = useLibraryData();
  const [showAdd, setShowAdd] = useState(false);
  const [newRack, setNewRack] = useState({
    rack_code: "",
    rack_name: "",
    section: "",
    room: "",
    floor: "",
    capacity: "",
    description: "",
  });

  const handleAdd = async () => {
    await createRack({
      rack_code: newRack.rack_code,
      rack_name: newRack.rack_name,
      section: newRack.section || null,
      room: newRack.room || null,
      floor: newRack.floor || null,
      capacity: newRack.capacity ? parseInt(newRack.capacity) : null,
      description: newRack.description || null,
    });
    setShowAdd(false);
    setNewRack({ rack_code: "", rack_name: "", section: "", room: "", floor: "", capacity: "", description: "" });
  };

  const getBooksInRack = (rackId: string) => {
    return bookCopies.filter(c => c.rack_id === rackId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rack Management</h2>
          <p className="text-muted-foreground">Manage library shelving and locations</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Rack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Rack</DialogTitle>
              <DialogDescription>Create a new shelf/rack location</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Rack Code *</Label>
                  <Input
                    id="code"
                    value={newRack.rack_code}
                    onChange={(e) => setNewRack({ ...newRack, rack_code: e.target.value })}
                    placeholder="e.g., A1, REF-01"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Rack Name *</Label>
                  <Input
                    id="name"
                    value={newRack.rack_name}
                    onChange={(e) => setNewRack({ ...newRack, rack_name: e.target.value })}
                    placeholder="e.g., Fiction Section A"
                  />
                </div>
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    value={newRack.section}
                    onChange={(e) => setNewRack({ ...newRack, section: e.target.value })}
                    placeholder="e.g., Reference, Circulation"
                  />
                </div>
                <div>
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={newRack.room}
                    onChange={(e) => setNewRack({ ...newRack, room: e.target.value })}
                    placeholder="e.g., Main Hall"
                  />
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    value={newRack.floor}
                    onChange={(e) => setNewRack({ ...newRack, floor: e.target.value })}
                    placeholder="e.g., Ground Floor"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newRack.capacity}
                    onChange={(e) => setNewRack({ ...newRack, capacity: e.target.value })}
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={newRack.description}
                  onChange={(e) => setNewRack({ ...newRack, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newRack.rack_code || !newRack.rack_name}>
                Add Rack
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {racks.map((rack) => {
          const bookCount = getBooksInRack(rack.id);
          const utilizationPercent = rack.capacity ? Math.round((bookCount / rack.capacity) * 100) : 0;
          
          return (
            <Card key={rack.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      {rack.rack_name}
                    </CardTitle>
                    <CardDescription>{rack.rack_code}</CardDescription>
                  </div>
                  <Badge variant={rack.is_active ? "default" : "secondary"}>
                    {rack.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {rack.section && <p><span className="text-muted-foreground">Section:</span> {rack.section}</p>}
                  {rack.room && <p><span className="text-muted-foreground">Room:</span> {rack.room}</p>}
                  {rack.floor && <p><span className="text-muted-foreground">Floor:</span> {rack.floor}</p>}
                  <p><span className="text-muted-foreground">Books:</span> {bookCount} {rack.capacity && `/ ${rack.capacity}`}</p>
                  {rack.capacity && (
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all" 
                        style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {racks.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No racks configured. Add your first rack to start organizing books.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
