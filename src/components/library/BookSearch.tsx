import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, BookOpen, Star, MapPin, QrCode, Scan } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function BookSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const searchResults = [
    {
      id: "1",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      genre: "Classic Literature",
      year: 1960,
      rating: 4.8,
      copies: 5,
      available: 3,
      location: "Fiction Section A-12",
      status: "Available",
      description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice."
    },
    {
      id: "2",
      title: "The Hunger Games",
      author: "Suzanne Collins",
      isbn: "978-0-439-02348-1",
      genre: "Young Adult Fiction",
      year: 2008,
      rating: 4.6,
      copies: 8,
      available: 2,
      location: "YA Fiction B-5",
      status: "Limited",
      description: "In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts."
    },
    {
      id: "3",
      title: "Wonder",
      author: "R.J. Palacio",
      isbn: "978-0-375-86902-0",
      genre: "Children's Fiction",
      year: 2012,
      rating: 4.9,
      copies: 6,
      available: 0,
      location: "Children's C-8",
      status: "All Borrowed",
      description: "August Pullman was born with a facial difference that, up until now, has prevented him from going to a mainstream school."
    },
    {
      id: "4",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      genre: "Classic Literature",
      year: 1925,
      rating: 4.4,
      copies: 4,
      available: 4,
      location: "Classics A-18",
      status: "Available",
      description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan."
    }
  ];

  const genres = ["All", "Classic Literature", "Young Adult Fiction", "Children's Fiction", "Science Fiction", "Mystery", "Biography", "Science", "History"];
  const statuses = ["All", "Available", "Limited", "All Borrowed", "Reserved"];

  const filteredResults = searchResults.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.isbn.includes(searchQuery);
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    const matchesStatus = selectedStatus === "all" || book.status === selectedStatus;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const getStatusBadge = (status: string, available: number) => {
    if (status === "Available") {
      return <Badge variant="default" className="bg-green-600">Available ({available})</Badge>;
    } else if (status === "Limited") {
      return <Badge variant="secondary">Limited ({available})</Badge>;
    } else if (status === "All Borrowed") {
      return <Badge variant="destructive">All Borrowed</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle>Library Search</CardTitle>
          <CardDescription>Search and discover books in our library collection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Button className="absolute right-2 top-1 h-8" size="sm">
              <Scan className="h-4 w-4 mr-1" />
              Scan
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.slice(1).map((genre) => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.slice(1).map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Popular searches:</span>
            {["Harry Potter", "Shakespeare", "Science", "Biography"].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(term)}
                className="h-7 text-xs"
              >
                {term}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Search Results ({filteredResults.length} books found)
          </h2>
          <div className="flex gap-2">
            <Select defaultValue="relevance">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Sort by Relevance</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="author">Sort by Author</SelectItem>
                <SelectItem value="year">Sort by Year</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredResults.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Book Cover Placeholder */}
                  <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{book.title}</h3>
                        <p className="text-lg text-muted-foreground">by {book.author}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{book.genre}</Badge>
                          <span className="text-sm text-muted-foreground">Published {book.year}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{book.rating}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(book.status, book.available)}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>ISBN: {book.isbn}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {book.location}
                        </span>
                        <span>{book.copies} total copies</span>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View Details</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{book.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <p><strong>Author:</strong> {book.author}</p>
                                  <p><strong>ISBN:</strong> {book.isbn}</p>
                                  <p><strong>Genre:</strong> {book.genre}</p>
                                  <p><strong>Published:</strong> {book.year}</p>
                                  <p><strong>Location:</strong> {book.location}</p>
                                </div>
                                <div className="space-y-2">
                                  <p><strong>Rating:</strong> ⭐ {book.rating}/5</p>
                                  <p><strong>Total Copies:</strong> {book.copies}</p>
                                  <p><strong>Available:</strong> {book.available}</p>
                                  <p><strong>Status:</strong> {book.status}</p>
                                </div>
                              </div>
                              <div>
                                <p><strong>Description:</strong></p>
                                <p className="text-sm text-muted-foreground mt-1">{book.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button className="flex-1" disabled={book.available === 0}>
                                  {book.available > 0 ? "Borrow Book" : "Reserve Book"}
                                </Button>
                                <Button variant="outline">
                                  <QrCode className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {book.available > 0 ? (
                          <Button size="sm">Borrow</Button>
                        ) : (
                          <Button variant="outline" size="sm">Reserve</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}