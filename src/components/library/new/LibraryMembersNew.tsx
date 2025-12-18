import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Users, GraduationCap, Briefcase, Ban, CheckCircle } from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import type { LibraryMember, LibraryMemberType } from "@/types/library";

export function LibraryMembersNew() {
  const { members, settings, createMember, updateMember, isLoading } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [memberTypeFilter, setMemberTypeFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Form state
  const [newMember, setNewMember] = useState({
    member_type: "student" as LibraryMemberType,
    full_name: "",
    admission_number: "",
    class_name: "",
    section: "",
    roll_number: "",
    staff_id: "",
    department: "",
    email: "",
    phone: "",
    parent_contact: "",
    library_card_number: ""
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.admission_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staff_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.library_card_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = memberTypeFilter === "all" || member.member_type === memberTypeFilter;
    
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "active" && member.is_active && !member.is_blocked) ||
      (activeTab === "blocked" && member.is_blocked);
    
    return matchesSearch && matchesType && matchesTab;
  });

  const studentMembers = members.filter(m => m.member_type === 'student');
  const staffMembers = members.filter(m => m.member_type === 'staff');
  const blockedMembers = members.filter(m => m.is_blocked);

  const handleAddMember = async () => {
    const memberData: Partial<LibraryMember> = {
      member_type: newMember.member_type,
      full_name: newMember.full_name,
      email: newMember.email || null,
      phone: newMember.phone || null,
      library_card_number: newMember.library_card_number || null,
    };

    if (newMember.member_type === 'student') {
      memberData.admission_number = newMember.admission_number || null;
      memberData.class_name = newMember.class_name || null;
      memberData.section = newMember.section || null;
      memberData.roll_number = newMember.roll_number || null;
      memberData.parent_contact = newMember.parent_contact || null;
    } else {
      memberData.staff_id = newMember.staff_id || null;
      memberData.department = newMember.department || null;
    }

    const result = await createMember(memberData);
    
    if (result) {
      setShowAddDialog(false);
      setNewMember({
        member_type: "student",
        full_name: "",
        admission_number: "",
        class_name: "",
        section: "",
        roll_number: "",
        staff_id: "",
        department: "",
        email: "",
        phone: "",
        parent_contact: "",
        library_card_number: ""
      });
    }
  };

  const toggleBlock = async (member: LibraryMember) => {
    await updateMember(member.id, {
      is_blocked: !member.is_blocked,
      blocked_reason: member.is_blocked ? null : "Manually blocked"
    });
  };

  const toggleActive = async (member: LibraryMember) => {
    await updateMember(member.id, {
      is_active: !member.is_active
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{members.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{studentMembers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4" />
              Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{staffMembers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Ban className="h-4 w-4" />
              Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{blockedMembers.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or card number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={memberTypeFilter} onValueChange={setMemberTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Library Member</DialogTitle>
              <DialogDescription>Register a new library member</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Member Type</Label>
                <Select 
                  value={newMember.member_type} 
                  onValueChange={(v) => setNewMember({ ...newMember, member_type: v as LibraryMemberType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Full Name *</Label>
                <Input
                  value={newMember.full_name}
                  onChange={(e) => setNewMember({ ...newMember, full_name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              {newMember.member_type === 'student' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Admission Number</Label>
                      <Input
                        value={newMember.admission_number}
                        onChange={(e) => setNewMember({ ...newMember, admission_number: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Roll Number</Label>
                      <Input
                        value={newMember.roll_number}
                        onChange={(e) => setNewMember({ ...newMember, roll_number: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Input
                        value={newMember.class_name}
                        onChange={(e) => setNewMember({ ...newMember, class_name: e.target.value })}
                        placeholder="e.g., Year 10"
                      />
                    </div>
                    <div>
                      <Label>Section</Label>
                      <Input
                        value={newMember.section}
                        onChange={(e) => setNewMember({ ...newMember, section: e.target.value })}
                        placeholder="e.g., A"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Parent Contact</Label>
                    <Input
                      value={newMember.parent_contact}
                      onChange={(e) => setNewMember({ ...newMember, parent_contact: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Staff ID</Label>
                    <Input
                      value={newMember.staff_id}
                      onChange={(e) => setNewMember({ ...newMember, staff_id: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={newMember.department}
                      onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Library Card Number</Label>
                <Input
                  value={newMember.library_card_number}
                  onChange={(e) => setNewMember({ ...newMember, library_card_number: e.target.value })}
                  placeholder="Optional - for barcode scanning"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddMember} disabled={!newMember.full_name}>
                Add Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Members</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="blocked">Blocked ({blockedMembers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>Library Members</CardTitle>
              <CardDescription>
                {filteredMembers.length} members found
                {settings && (
                  <span className="ml-2 text-xs">
                    • Students: max {settings.student_max_books} books, {settings.student_loan_days} days
                    • Staff: max {settings.staff_max_books} books, {settings.staff_loan_days} days
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Fines</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {members.length === 0 ? "No members registered yet" : "No members match your search"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id} className={member.is_blocked ? "bg-destructive/5" : ""}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{member.full_name}</p>
                            {member.library_card_number && (
                              <p className="text-xs text-muted-foreground">Card: {member.library_card_number}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {member.member_type === 'student' ? (
                              <><GraduationCap className="h-3 w-3 mr-1" /> Student</>
                            ) : (
                              <><Briefcase className="h-3 w-3 mr-1" /> Staff</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.member_type === 'student' ? (
                            <div>
                              <p className="text-sm">{member.admission_number || "-"}</p>
                              <p className="text-xs text-muted-foreground">{member.class_name} {member.section}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm">{member.staff_id || "-"}</p>
                              <p className="text-xs text-muted-foreground">{member.department}</p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {member.phone || member.email || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.current_borrowed > 0 ? "secondary" : "outline"}>
                            {member.current_borrowed} / {member.member_type === 'student' 
                              ? (settings?.student_max_books || 2) 
                              : (settings?.staff_max_books || 5)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.total_fines_pending > 0 ? (
                            <Badge variant="destructive">₹{member.total_fines_pending}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {member.is_blocked ? (
                            <Badge variant="destructive">Blocked</Badge>
                          ) : member.is_active ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBlock(member)}
                            >
                              {member.is_blocked ? (
                                <><CheckCircle className="h-4 w-4 mr-1" /> Unblock</>
                              ) : (
                                <><Ban className="h-4 w-4 mr-1" /> Block</>
                              )}
                            </Button>
                          </div>
                        </TableCell>
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
