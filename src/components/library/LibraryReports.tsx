import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, TrendingUp, BookOpen, Users, Clock } from "lucide-react";

export function LibraryReports() {
  const borrowingData = [
    { month: "Sep", borrows: 245, returns: 240, overdue: 5 },
    { month: "Oct", borrows: 298, returns: 285, overdue: 13 },
    { month: "Nov", borrows: 356, returns: 342, overdue: 14 },
    { month: "Dec", borrows: 189, returns: 195, overdue: 8 },
    { month: "Jan", borrows: 423, returns: 401, overdue: 22 }
  ];

  const genreData = [
    { name: "Fiction", value: 35, color: "#3B82F6" },
    { name: "Science", value: 25, color: "#10B981" },
    { name: "History", value: 20, color: "#F59E0B" },
    { name: "Biography", value: 12, color: "#EF4444" },
    { name: "Other", value: 8, color: "#8B5CF6" }
  ];

  const topBooks = [
    { title: "The Hunger Games", borrows: 45, author: "Suzanne Collins" },
    { title: "Wonder", borrows: 38, author: "R.J. Palacio" },
    { title: "Diary of a Wimpy Kid", borrows: 35, author: "Jeff Kinney" },
    { title: "Charlotte's Web", borrows: 32, author: "E.B. White" },
    { title: "Harry Potter Series", borrows: 29, author: "J.K. Rowling" }
  ];

  const classUsage = [
    { class: "Year 7", books: 156, students: 120, avgPerStudent: 1.3 },
    { class: "Year 8", books: 189, students: 115, avgPerStudent: 1.6 },
    { class: "Year 9", books: 234, students: 108, avgPerStudent: 2.2 },
    { class: "Year 10", books: 178, students: 95, avgPerStudent: 1.9 },
    { class: "Year 11", books: 89, students: 87, avgPerStudent: 1.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select defaultValue="academic-year">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic-year">Academic Year 2023-24</SelectItem>
              <SelectItem value="term">Current Term</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all-classes">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-classes">All Classes</SelectItem>
              <SelectItem value="year-7">Year 7</SelectItem>
              <SelectItem value="year-8">Year 8</SelectItem>
              <SelectItem value="year-9">Year 9</SelectItem>
              <SelectItem value="year-10">Year 10</SelectItem>
              <SelectItem value="year-11">Year 11</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">1,511</p>
              <p className="text-sm text-muted-foreground">Total Borrowings</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last term
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">485</p>
              <p className="text-sm text-muted-foreground">Active Readers</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                89% of students
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">14.2</p>
              <p className="text-sm text-muted-foreground">Avg Days/Book</p>
              <p className="text-xs text-muted-foreground">Lending duration</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">96.2%</p>
              <p className="text-sm text-muted-foreground">Return Rate</p>
              <p className="text-xs text-green-600">Excellent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Borrowing Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Borrowing Trends</CardTitle>
            <CardDescription>Monthly borrowing and return statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={borrowingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="borrows" fill="#3B82F6" name="Borrowed" />
                <Bar dataKey="returns" fill="#10B981" name="Returned" />
                <Bar dataKey="overdue" fill="#EF4444" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Genres</CardTitle>
            <CardDescription>Distribution of borrowed books by genre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Books */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Books</CardTitle>
            <CardDescription>Books with highest circulation this term</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topBooks.map((book, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                </div>
                <Badge variant="outline">{book.borrows} borrows</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Class Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Usage by Year Group</CardTitle>
            <CardDescription>Reading statistics across different year groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classUsage.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.class}</span>
                    <div className="text-right text-sm">
                      <span className="font-medium">{item.books} books</span>
                      <p className="text-muted-foreground">{item.avgPerStudent} avg/student</p>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(item.books / 250) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Reading Insights & Recommendations</CardTitle>
          <CardDescription>Data-driven insights to improve library services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-semibold text-green-600">High Engagement</h3>
              <p className="text-sm">Year 9 shows highest reading activity with 2.2 books per student</p>
              <p className="text-xs text-muted-foreground">Consider expanding fiction collection for this group</p>
            </div>
            
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-semibold text-orange-600">Need Attention</h3>
              <p className="text-sm">Year 11 reading activity is low (1.0 books per student)</p>
              <p className="text-xs text-muted-foreground">Exam pressure likely cause - consider study guides</p>
            </div>
            
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-semibold text-blue-600">Collection Gap</h3>
              <p className="text-sm">Science books are popular but limited in quantity</p>
              <p className="text-xs text-muted-foreground">Consider acquiring more STEM-focused titles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}