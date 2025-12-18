import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { LibraryBookType } from "@/types/library";

interface ParsedBook {
  title: string;
  authors: string;
  publisher: string;
  publication_year: string;
  isbn: string;
  language: string;
  ddc_number: string;
  call_number_base: string;
  category: string;
  book_type: string;
  pages: string;
  binding: string;
  description: string;
  copies: string;
  isValid: boolean;
  errors: string[];
}

interface BulkBookUploadProps {
  onUpload: (books: Array<{
    title: string;
    authors: string[];
    publisher: string | null;
    publication_year: number | null;
    isbn: string | null;
    language: string;
    ddc_number: string | null;
    call_number_base: string | null;
    category: string | null;
    book_type: LibraryBookType;
    pages: number | null;
    binding: string | null;
    description: string | null;
  }>) => Promise<number>;
}

const TEMPLATE_HEADERS = [
  "title", "authors", "publisher", "publication_year", "isbn", 
  "language", "ddc_number", "call_number_base", "category", 
  "book_type", "pages", "binding", "description", "copies"
];

const SAMPLE_DATA = [
  ["To Kill a Mockingbird", "Harper Lee", "J.B. Lippincott & Co.", "1960", "978-0-06-112008-4", "English", "813", "813 LEE", "Fiction", "circulation", "281", "Paperback", "A classic novel about racial injustice", "2"],
  ["1984", "George Orwell", "Secker & Warburg", "1949", "978-0-452-28423-4", "English", "823", "823 ORW", "Fiction", "circulation", "328", "Hardcover", "Dystopian social science fiction", "1"],
  ["The Oxford Dictionary", "Oxford University Press", "Oxford University Press", "2020", "978-0-19-861024-2", "English", "423", "423 OXF", "Reference", "reference", "1456", "Hardcover", "Comprehensive English dictionary", "3"]
];

const VALID_CATEGORIES = [
  "Fiction", "Non-Fiction", "Science", "Mathematics", "History", 
  "Geography", "Literature", "Reference", "Biography", "Arts",
  "Technology", "Languages", "Philosophy", "Religion", "Sports"
];

const VALID_BOOK_TYPES = ["circulation", "reference"];
const VALID_BINDINGS = ["Hardcover", "Paperback", "Spiral"];

export function BulkBookUpload({ onUpload }: BulkBookUploadProps) {
  const [open, setOpen] = useState(false);
  const [parsedBooks, setParsedBooks] = useState<ParsedBook[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const csvContent = [
      TEMPLATE_HEADERS.join(","),
      ...SAMPLE_DATA.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "book_upload_template.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Template downloaded successfully");
  };

  const parseCSV = (text: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = "";
        if (char === '\r') i++;
      } else {
        currentCell += char;
      }
    }

    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell !== "")) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  const validateBook = (row: string[], headers: string[]): ParsedBook => {
    const book: ParsedBook = {
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
      description: "",
      copies: "1",
      isValid: true,
      errors: []
    };

    headers.forEach((header, index) => {
      const value = row[index] || "";
      if (header in book) {
        (book as any)[header] = value;
      }
    });

    // Validate required fields
    if (!book.title.trim()) {
      book.errors.push("Title is required");
      book.isValid = false;
    }

    if (!book.authors.trim()) {
      book.errors.push("Authors is required");
      book.isValid = false;
    }

    // Validate optional fields
    if (book.publication_year && !/^\d{4}$/.test(book.publication_year)) {
      book.errors.push("Invalid publication year");
      book.isValid = false;
    }

    if (book.pages && !/^\d+$/.test(book.pages)) {
      book.errors.push("Pages must be a number");
      book.isValid = false;
    }

    if (book.category && !VALID_CATEGORIES.includes(book.category)) {
      book.errors.push(`Invalid category. Use: ${VALID_CATEGORIES.join(", ")}`);
      book.isValid = false;
    }

    if (book.book_type && !VALID_BOOK_TYPES.includes(book.book_type.toLowerCase())) {
      book.errors.push("Book type must be 'circulation' or 'reference'");
      book.isValid = false;
    }

    if (book.binding && !VALID_BINDINGS.includes(book.binding)) {
      book.errors.push(`Invalid binding. Use: ${VALID_BINDINGS.join(", ")}`);
      book.isValid = false;
    }

    if (book.copies && !/^\d+$/.test(book.copies)) {
      book.errors.push("Copies must be a number");
      book.isValid = false;
    }

    return book;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        toast.error("File is empty or has no data rows");
        return;
      }

      const headers = rows[0].map(h => h.toLowerCase().trim().replace(/\s+/g, '_'));
      const dataRows = rows.slice(1);

      const parsed = dataRows.map(row => validateBook(row, headers));
      setParsedBooks(parsed);
      setUploadResult(null);
    };

    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    const validBooks = parsedBooks.filter(b => b.isValid);
    if (validBooks.length === 0) {
      toast.error("No valid books to upload");
      return;
    }

    setIsUploading(true);

    try {
      const booksToUpload = validBooks.map(book => ({
        title: book.title,
        authors: book.authors.split(",").map(a => a.trim()),
        publisher: book.publisher || null,
        publication_year: book.publication_year ? parseInt(book.publication_year) : null,
        isbn: book.isbn || null,
        language: book.language || "English",
        ddc_number: book.ddc_number || null,
        call_number_base: book.call_number_base || null,
        category: book.category || null,
        book_type: (book.book_type.toLowerCase() || "circulation") as LibraryBookType,
        pages: book.pages ? parseInt(book.pages) : null,
        binding: book.binding || null,
        description: book.description || null
      }));

      const successCount = await onUpload(booksToUpload);
      
      setUploadResult({
        success: successCount,
        failed: validBooks.length - successCount
      });

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} book(s)`);
      }
    } catch (error) {
      toast.error("Failed to upload books");
    } finally {
      setIsUploading(false);
    }
  };

  const validCount = parsedBooks.filter(b => b.isValid).length;
  const invalidCount = parsedBooks.filter(b => !b.isValid).length;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setParsedBooks([]);
        setUploadResult(null);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Books</DialogTitle>
          <DialogDescription>
            Upload multiple books at once using a CSV file. Download the template to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Download Template</p>
                <p className="text-sm text-muted-foreground">
                  CSV template with sample data and all required columns
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">Click to upload CSV file</p>
              <p className="text-sm text-muted-foreground">or drag and drop</p>
            </label>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <Alert className={uploadResult.failed === 0 ? "border-green-500" : "border-yellow-500"}>
              <AlertDescription className="flex items-center gap-2">
                {uploadResult.failed === 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                Uploaded {uploadResult.success} book(s) successfully.
                {uploadResult.failed > 0 && ` ${uploadResult.failed} failed.`}
              </AlertDescription>
            </Alert>
          )}

          {/* Parsed Preview */}
          {parsedBooks.length > 0 && (
            <>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {validCount} Valid
                </Badge>
                {invalidCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {invalidCount} Invalid
                  </Badge>
                )}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Authors</TableHead>
                      <TableHead>ISBN</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedBooks.slice(0, 10).map((book, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {book.isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{book.title || "-"}</TableCell>
                        <TableCell>{book.authors || "-"}</TableCell>
                        <TableCell>{book.isbn || "-"}</TableCell>
                        <TableCell>{book.category || "-"}</TableCell>
                        <TableCell className="text-destructive text-sm">
                          {book.errors.join("; ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {parsedBooks.length > 10 && (
                  <div className="p-2 text-center text-sm text-muted-foreground border-t">
                    Showing 10 of {parsedBooks.length} rows
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={validCount === 0 || isUploading}
          >
            {isUploading ? "Uploading..." : `Upload ${validCount} Book(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
