import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, BookOpen, Edit, Trash2, QrCode, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function BookCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");

  const books = [
    {
      id: "1",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      genre: "Classic Literature",
      copies: 5,
      available: 3,
      rating: 4.8,
      year: 1960,
      status: "Available"
    },
    {
      id: "2",
      title: "The Hunger Games",
      author: "Suzanne Collins",
      isbn: "978-0-439-02348-1",
      genre: "Young Adult Fiction",
      copies: 8,
      available: 2,
      rating: 4.6,
      year: 2008,
      status: "Popular"
    },
    {
      id: "3",
      title: "Wonder",
      author: "R.J. Palacio",
      isbn: "978-0-375-86902-0",
      genre: "Children's Fiction",
      copies: 6,
      available: 0,
      rating: 4.9,
      year: 2012,
      status: "All Borrowed"
    }
  ];

  const genres = ["All", "Classic Literature", "Young Adult Fiction", "Children's Fiction", "Science Fiction", "Mystery", "Biography"];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.slice(1).map((genre) => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Add a new book to the library catalog</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Book title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" placeholder="Author name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" placeholder="978-0-000-00000-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.slice(1).map((genre) => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Publication Year</Label>
                  <Input id="year" type="number" placeholder="2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copies">Total Copies</Label>
                  <Input id="copies" type="number" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Shelf Location</Label>
                  <Input id="location" placeholder="A-12-3" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Book description..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Generate QR Code</Button>
                <Button>Add Book</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>Library Catalog ({filteredBooks.length} books)</CardTitle>
          <CardDescription>Manage your library's book collection</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Details</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                      <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.genre}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{book.available} of {book.copies} available</p>
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(book.available / book.copies) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={book.available > 0 ? "default" : "destructive"}>
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}