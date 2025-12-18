import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Book, Edit, Eye, Copy } from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import type { LibraryBookTitle, LibraryBookType } from "@/types/library";

const CATEGORIES = [
  "Fiction", "Non-Fiction", "Science", "Mathematics", "History", 
  "Geography", "Literature", "Reference", "Biography", "Arts",
  "Technology", "Languages", "Philosophy", "Religion", "Sports"
];

const DDC_RANGES = [
  { range: "000-099", name: "Computer Science, Information & General Works" },
  { range: "100-199", name: "Philosophy & Psychology" },
  { range: "200-299", name: "Religion" },
  { range: "300-399", name: "Social Sciences" },
  { range: "400-499", name: "Language" },
  { range: "500-599", name: "Science" },
  { range: "600-699", name: "Technology" },
  { range: "700-799", name: "Arts & Recreation" },
  { range: "800-899", name: "Literature" },
  { range: "900-999", name: "History & Geography" },
];

export function BookCatalogNew() {
  const { bookTitles, bookCopies, racks, createBookTitle, updateBookTitle, createBookCopy, isLoading } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddTitle, setShowAddTitle] = useState(false);
  const [showAddCopy, setShowAddCopy] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<LibraryBookTitle | null>(null);
  const [activeTab, setActiveTab] = useState("titles");

  // Form states for new title
  const [newTitle, setNewTitle] = useState({
    title: "",
    authors: "",
    publisher: "",
    publication_year: "",
    isbn: "",
    language: "English",
    ddc_number: "",
    call_number_base: "",
    category: "",
    book_type: "circulation" as LibraryBookType,
    pages: "",
    binding: "Paperback",
    description: ""
  });

  // Form states for new copy
  const [newCopy, setNewCopy] = useState({
    title_id: "",
    call_number: "",
    source: "purchase" as "purchase" | "donation",
    price: "",
    rack_id: "",
    shelf_number: "",
    condition: "Good",
    is_reference: false,
    barcode: "",
    remarks: ""
  });

  const filteredTitles = bookTitles.filter(title => {
    const matchesSearch = 
      title.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      title.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (title.isbn && title.isbn.includes(searchTerm));
    
    const matchesCategory = selectedCategory === "all" || title.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddTitle = async () => {
    const result = await createBookTitle({
      title: newTitle.title,
      authors: newTitle.authors.split(",").map(a => a.trim()),
      publisher: newTitle.publisher || null,
      publication_year: newTitle.publication_year ? parseInt(newTitle.publication_year) : null,
      isbn: newTitle.isbn || null,
      language: newTitle.language,
      ddc_number: newTitle.ddc_number || null,
      call_number_base: newTitle.call_number_base || null,
      category: newTitle.category || null,
      book_type: newTitle.book_type,
      pages: newTitle.pages ? parseInt(newTitle.pages) : null,
      binding: newTitle.binding || null,
      description: newTitle.description || null
    });

    if (result) {
      setShowAddTitle(false);
      setNewTitle({
        title: "",
        authors: "",
        publisher: "",
        publication_year: "",
        isbn: "",
        language: "English",
        ddc_number: "",
        call_number_base: "",
        category: "",
        book_type: "circulation",
        pages: "",
        binding: "Paperback",
        description: ""
      });
    }
  };

  const handleAddCopy = async () => {
    if (!newCopy.title_id || !newCopy.call_number) return;

    const result = await createBookCopy({
      title_id: newCopy.title_id,
      call_number: newCopy.call_number,
      source: newCopy.source,
      price: newCopy.price ? parseFloat(newCopy.price) : null,
      rack_id: newCopy.rack_id || null,
      shelf_number: newCopy.shelf_number || null,
      condition: newCopy.condition,
      is_reference: newCopy.is_reference,
      barcode: newCopy.barcode || null,
      remarks: newCopy.remarks || null
    });

    if (result) {
      setShowAddCopy(false);
      setNewCopy({
        title_id: "",
        call_number: "",
        source: "purchase",
        price: "",
        rack_id: "",
        shelf_number: "",
        condition: "Good",
        is_reference: false,
        barcode: "",
        remarks: ""
      });
    }
  };

  const getStatusBadge = (available: number, total: number) => {
    if (total === 0) return <Badge variant="outline">No copies</Badge>;
    if (available === 0) return <Badge variant="destructive">All Issued</Badge>;
    if (available < total) return <Badge variant="secondary">{available}/{total} Available</Badge>;
    return <Badge variant="default">{available} Available</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddTitle} onOpenChange={setShowAddTitle}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Book Title
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Book Title</DialogTitle>
                <DialogDescription>Enter the book details. You can add copies after creating the title.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newTitle.title}
                      onChange={(e) => setNewTitle({ ...newTitle, title: e.target.value })}
                      placeholder="Enter book title"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="authors">Authors (comma-separated) *</Label>
                    <Input
                      id="authors"
                      value={newTitle.authors}
                      onChange={(e) => setNewTitle({ ...newTitle, authors: e.target.value })}
                      placeholder="e.g., John Smith, Jane Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      value={newTitle.publisher}
                      onChange={(e) => setNewTitle({ ...newTitle, publisher: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Publication Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newTitle.publication_year}
                      onChange={(e) => setNewTitle({ ...newTitle, publication_year: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={newTitle.isbn}
                      onChange={(e) => setNewTitle({ ...newTitle, isbn: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      value={newTitle.language}
                      onChange={(e) => setNewTitle({ ...newTitle, language: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ddc">DDC Number</Label>
                    <Input
                      id="ddc"
                      value={newTitle.ddc_number}
                      onChange={(e) => setNewTitle({ ...newTitle, ddc_number: e.target.value })}
                      placeholder="e.g., 823"
                    />
                  </div>
                  <div>
                    <Label htmlFor="callNumber">Call Number Base</Label>
                    <Input
                      id="callNumber"
                      value={newTitle.call_number_base}
                      onChange={(e) => setNewTitle({ ...newTitle, call_number_base: e.target.value })}
                      placeholder="e.g., 823 DAH"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newTitle.category} onValueChange={(v) => setNewTitle({ ...newTitle, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bookType">Book Type</Label>
                    <Select value={newTitle.book_type} onValueChange={(v) => setNewTitle({ ...newTitle, book_type: v as LibraryBookType })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circulation">Circulation</SelectItem>
                        <SelectItem value="reference">Reference (Non-Issue)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pages">Pages</Label>
                    <Input
                      id="pages"
                      type="number"
                      value={newTitle.pages}
                      onChange={(e) => setNewTitle({ ...newTitle, pages: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="binding">Binding</Label>
                    <Select value={newTitle.binding} onValueChange={(v) => setNewTitle({ ...newTitle, binding: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hardcover">Hardcover</SelectItem>
                        <SelectItem value="Paperback">Paperback</SelectItem>
                        <SelectItem value="Spiral">Spiral Bound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTitle.description}
                      onChange={(e) => setNewTitle({ ...newTitle, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddTitle(false)}>Cancel</Button>
                <Button onClick={handleAddTitle} disabled={!newTitle.title || !newTitle.authors}>
                  Add Book Title
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddCopy} onOpenChange={setShowAddCopy}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Add Copy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Book Copy (Accession)</DialogTitle>
                <DialogDescription>Add a physical copy with auto-generated accession number.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="copyTitle">Select Book Title *</Label>
                  <Select value={newCopy.title_id} onValueChange={(v) => {
                    const title = bookTitles.find(t => t.id === v);
                    setNewCopy({ 
                      ...newCopy, 
                      title_id: v,
                      call_number: title?.call_number_base || "",
                      is_reference: title?.book_type === 'reference'
                    });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a book title" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookTitles.map(title => (
                        <SelectItem key={title.id} value={title.id}>
                          {title.title} by {title.authors.join(", ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="copyCallNumber">Call Number *</Label>
                    <Input
                      id="copyCallNumber"
                      value={newCopy.call_number}
                      onChange={(e) => setNewCopy({ ...newCopy, call_number: e.target.value })}
                      placeholder="e.g., 823 DAH"
                    />
                  </div>
                  <div>
                    <Label htmlFor="copySource">Source</Label>
                    <Select value={newCopy.source} onValueChange={(v) => setNewCopy({ ...newCopy, source: v as "purchase" | "donation" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="donation">Donation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="copyPrice">Price (₹)</Label>
                    <Input
                      id="copyPrice"
                      type="number"
                      value={newCopy.price}
                      onChange={(e) => setNewCopy({ ...newCopy, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="copyRack">Rack Location</Label>
                    <Select value={newCopy.rack_id} onValueChange={(v) => setNewCopy({ ...newCopy, rack_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rack" />
                      </SelectTrigger>
                      <SelectContent>
                        {racks.map(rack => (
                          <SelectItem key={rack.id} value={rack.id}>
                            {rack.rack_name} ({rack.rack_code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="copyShelf">Shelf Number</Label>
                    <Input
                      id="copyShelf"
                      value={newCopy.shelf_number}
                      onChange={(e) => setNewCopy({ ...newCopy, shelf_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="copyCondition">Condition</Label>
                    <Select value={newCopy.condition} onValueChange={(v) => setNewCopy({ ...newCopy, condition: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="copyBarcode">Barcode</Label>
                    <Input
                      id="copyBarcode"
                      value={newCopy.barcode}
                      onChange={(e) => setNewCopy({ ...newCopy, barcode: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="copyReference"
                      checked={newCopy.is_reference}
                      onCheckedChange={(checked) => setNewCopy({ ...newCopy, is_reference: checked })}
                    />
                    <Label htmlFor="copyReference">Reference Book (Non-Issue)</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="copyRemarks">Remarks</Label>
                  <Textarea
                    id="copyRemarks"
                    value={newCopy.remarks}
                    onChange={(e) => setNewCopy({ ...newCopy, remarks: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddCopy(false)}>Cancel</Button>
                <Button onClick={handleAddCopy} disabled={!newCopy.title_id || !newCopy.call_number}>
                  Add Copy (Auto Accession)
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs for Titles vs Copies */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="titles">Book Titles ({bookTitles.length})</TabsTrigger>
          <TabsTrigger value="copies">Book Copies ({bookCopies.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="titles">
          <Card>
            <CardHeader>
              <CardTitle>Book Catalogue</CardTitle>
              <CardDescription>Manage book titles in the library</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author(s)</TableHead>
                    <TableHead>Call Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTitles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {bookTitles.length === 0 ? "No books in catalogue. Add your first book!" : "No books match your search."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTitles.map((title) => (
                      <TableRow key={title.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{title.title}</p>
                            {title.isbn && <p className="text-xs text-muted-foreground">ISBN: {title.isbn}</p>}
                          </div>
                        </TableCell>
                        <TableCell>{title.authors.join(", ")}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{title.call_number_base || title.ddc_number || "-"}</code>
                        </TableCell>
                        <TableCell>{title.category || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={title.book_type === 'reference' ? 'secondary' : 'outline'}>
                            {title.book_type === 'reference' ? 'Reference' : 'Circulation'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(title.available_copies, title.total_copies)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setNewCopy({
                              ...newCopy,
                              title_id: title.id,
                              call_number: title.call_number_base || "",
                              is_reference: title.book_type === 'reference'
                            });
                            setShowAddCopy(true);
                          }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="copies">
          <Card>
            <CardHeader>
              <CardTitle>Book Copies (Accession Register)</CardTitle>
              <CardDescription>All physical book copies with accession numbers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Acc. No.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Call Number</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookCopies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No book copies yet. Add copies to existing titles.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookCopies.map((copy) => (
                      <TableRow key={copy.id}>
                        <TableCell>
                          <code className="font-mono font-bold">{copy.accession_number}</code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{copy.book_title?.title || "Unknown"}</p>
                            {copy.barcode && <p className="text-xs text-muted-foreground">Barcode: {copy.barcode}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{copy.call_number}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{copy.source}</Badge>
                        </TableCell>
                        <TableCell>
                          {copy.rack?.rack_name || "-"}
                          {copy.shelf_number && ` / ${copy.shelf_number}`}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              copy.status === 'available' ? 'default' :
                              copy.status === 'issued' ? 'secondary' :
                              copy.status === 'withdrawn' ? 'destructive' :
                              'outline'
                            }
                            className="capitalize"
                          >
                            {copy.is_reference ? 'Reference' : copy.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{copy.condition}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
