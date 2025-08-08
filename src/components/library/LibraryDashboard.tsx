import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, AlertTriangle, TrendingUp, QrCode, Scan } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function LibraryDashboard() {
  const navigate = useNavigate();
  const stats = [
    { title: "Total Books", value: "12,450", icon: BookOpen, change: "+245 this month" },
    { title: "Active Borrowers", value: "856", icon: Users, change: "+45 today" },
    { title: "Books Borrowed", value: "2,134", icon: Calendar, change: "89% return rate" },
    { title: "Overdue Items", value: "23", icon: AlertTriangle, change: "Down 45%" }
  ];

  const recentActivity = [
    { action: "Book returned", item: "To Kill a Mockingbird", student: "Emma Watson", time: "2 min ago" },
    { action: "New reservation", item: "Harry Potter Series", student: "John Smith", time: "5 min ago" },
    { action: "Book borrowed", item: "The Great Gatsby", student: "Sarah Johnson", time: "12 min ago" },
    { action: "Fine paid", item: "Late return penalty", student: "Mike Brown", time: "1 hour ago" }
  ];

  const popularBooks = [
    { title: "The Hunger Games", borrowCount: 45, genre: "Fiction" },
    { title: "Wonder", borrowCount: 38, genre: "Drama" },
    { title: "Diary of a Wimpy Kid", borrowCount: 35, genre: "Comedy" },
    { title: "Charlotte's Web", borrowCount: 32, genre: "Classic" }
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button className="gap-2" onClick={() => navigate('/library/borrowing')}>
          <QrCode className="h-4 w-4" />
          QR Check-out
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => navigate('/library/borrowing')}>
          <Scan className="h-4 w-4" />
          Barcode Scan
        </Button>
        <Button variant="outline" onClick={() => navigate('/library/borrowing')}>Quick Return</Button>
        <Button variant="outline" onClick={() => navigate('/library/catalog')}>Add New Book</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest library transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.item}</p>
                  <p className="text-xs text-muted-foreground">by {activity.student}</p>
                </div>
                <Badge variant="outline" className="text-xs">{activity.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Most Popular Books</CardTitle>
            <CardDescription>Books with highest circulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularBooks.map((book, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.genre}</p>
                  </div>
                  <Badge variant="secondary">{book.borrowCount} borrows</Badge>
                </div>
                <Progress value={(book.borrowCount / 50) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Digital Resources Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Digital Library Access</CardTitle>
          <CardDescription>Quick access to online resources and e-books</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/library/digital')}>
              <BookOpen className="h-6 w-6" />
              E-Books Portal
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/library/digital')}>
              <Users className="h-6 w-6" />
              Audio Books
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/library/reports')}>
              <Calendar className="h-6 w-6" />
              Reading Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}