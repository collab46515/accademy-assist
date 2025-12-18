import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Book, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp,
  ArrowRight,
  BookPlus,
  UserPlus,
  RotateCcw,
  DollarSign
} from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export function LibraryDashboardNew() {
  const navigate = useNavigate();
  const { 
    isLoading, 
    bookTitles, 
    bookCopies, 
    members, 
    circulations, 
    fines,
    getDashboardStats 
  } = useLibraryData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = getDashboardStats();
  const currentlyIssued = circulations.filter(c => c.status === 'issued');
  const overdueItems = currentlyIssued.filter(c => new Date(c.due_date) < new Date());
  const pendingFines = fines.filter(f => f.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col gap-2"
          onClick={() => navigate('/library/circulation')}
        >
          <BookOpen className="h-6 w-6" />
          <span>Issue / Return</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col gap-2"
          onClick={() => navigate('/library/catalog')}
        >
          <BookPlus className="h-6 w-6" />
          <span>Add Books</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col gap-2"
          onClick={() => navigate('/library/members')}
        >
          <UserPlus className="h-6 w-6" />
          <span>Add Member</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col gap-2"
          onClick={() => navigate('/library/fines')}
        >
          <DollarSign className="h-6 w-6" />
          <span>Collect Fine</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              {bookTitles.length} titles, {stats.availableBooks} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Currently Issued</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.issuedBooks}</div>
            <p className="text-xs text-muted-foreground">
              {overdueItems.length} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Library Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMembers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalFinesAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingFines} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Books Alert */}
        {overdueItems.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Overdue Books ({overdueItems.length})
              </CardTitle>
              <CardDescription>Books that need immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueItems.slice(0, 5).map((item) => {
                  const daysOverdue = Math.floor(
                    (new Date().getTime() - new Date(item.due_date).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          {item.book_copy?.book_title?.title || 'Unknown Book'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.member?.full_name} • Acc #{item.book_copy?.accession_number}
                        </p>
                      </div>
                      <Badge variant="destructive">{daysOverdue} days overdue</Badge>
                    </div>
                  );
                })}
                {overdueItems.length > 5 && (
                  <Button variant="link" className="w-full" onClick={() => navigate('/library/circulation')}>
                    View all {overdueItems.length} overdue items <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest issue and return transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {circulations.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">
                      {item.book_copy?.book_title?.title || 'Unknown Book'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.member?.full_name} • {format(new Date(item.issue_date), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <Badge variant={item.status === 'issued' ? 'default' : 'secondary'}>
                    {item.status === 'issued' ? 'Issued' : 'Returned'}
                  </Badge>
                </div>
              ))}
              {circulations.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Fines */}
        {pendingFines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pending Fines
              </CardTitle>
              <CardDescription>Fines awaiting collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingFines.slice(0, 5).map((fine) => (
                  <div key={fine.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{fine.member?.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {fine.fine_type} • {format(new Date(fine.fine_date), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <Badge variant="outline">₹{fine.balance.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Library Summary</CardTitle>
            <CardDescription>Current collection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Titles</span>
                <span className="font-medium">{bookTitles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Copies</span>
                <span className="font-medium">{bookCopies.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Reference Books</span>
                <span className="font-medium">{bookCopies.filter(c => c.is_reference).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Student Members</span>
                <span className="font-medium">{members.filter(m => m.member_type === 'student').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Staff Members</span>
                <span className="font-medium">{members.filter(m => m.member_type === 'staff').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
