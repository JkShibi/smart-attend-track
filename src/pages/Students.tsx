
import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  UserCog, 
  UserMinus, 
  UserPlus 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  rollNumber: string;
  attendance: number;
}

const Students = () => {
  const { toast } = useToast();
  const { user, isTeacher } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<string[]>([]);

  const [newStudent, setNewStudent] = useState({
    email: "",
    name: "",
    class: "",
    rollNumber: "",
  });

  // Fetch classes for the dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data, error } = await supabase
          .from("classes")
          .select("name")
          .eq("teacher_id", user?.id);
          
        if (error) throw error;
        
        setClasses(data.map(c => c.name));
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast({
          title: "Error",
          description: "Failed to load classes",
          variant: "destructive",
        });
      }
    };

    if (user && isTeacher) {
      fetchClasses();
    }
  }, [user, isTeacher, toast]);

  useEffect(() => {
    // Check if user is a teacher
    if (!isTeacher) {
      navigate("/");
      return;
    }

    // Fetch students data
    const fetchStudents = async () => {
      try {
        setLoading(true);
        
        // Get profiles with student role
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name, email, role")
          .eq("role", "student");
          
        if (profilesError) throw profilesError;
        
        // Get student details
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select("profile_id, roll_number, class, attendance_percentage");
          
        if (studentsError) throw studentsError;
        
        // Combine the data
        const combinedData = profilesData.map(profile => {
          const studentDetails = studentsData.find(s => s.profile_id === profile.id);
          
          return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            class: studentDetails?.class || "Not assigned",
            rollNumber: studentDetails?.roll_number || "Not assigned",
            attendance: studentDetails?.attendance_percentage || 0,
          };
        });
        
        setStudents(combinedData);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user, isTeacher, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setNewStudent({
      ...newStudent,
      class: value,
    });
  };

  const handleAddStudent = async () => {
    // Validation
    if (!newStudent.name || !newStudent.email || !newStudent.class || !newStudent.rollNumber) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, create a user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newStudent.email,
        password: "temppassword123", // Temporary password, should be changed by the student
        email_confirm: true,
        user_metadata: {
          name: newStudent.name,
          role: "student",
        },
      });
      
      if (authError) throw authError;
      
      // The profile will be created by the trigger we set up
      // Now add entry to students table
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .insert({
          profile_id: authData.user.id,
          roll_number: newStudent.rollNumber,
          class: newStudent.class,
        })
        .select();
        
      if (studentError) throw studentError;
      
      // Add the student to the list
      setStudents([...students, {
        id: authData.user.id,
        name: newStudent.name,
        email: newStudent.email,
        class: newStudent.class,
        rollNumber: newStudent.rollNumber,
        attendance: 100,
      }]);

      // Reset the form
      setNewStudent({
        name: "",
        email: "",
        class: "",
        rollNumber: "",
      });

      // Close the dialog
      setOpen(false);

      // Show success message
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return "text-green-600 bg-green-100";
    if (attendance >= 75) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the details of the new student below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter student name"
                  value={newStudent.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter student email"
                  value={newStudent.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  placeholder="Enter roll number"
                  value={newStudent.rollNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent}>Add Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Manage and view all registered students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="hidden sm:table-cell">Roll #</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id.substring(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell className="hidden sm:table-cell">{student.rollNumber}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${getAttendanceColor(student.attendance)}`}>
                        {student.attendance}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <UserCog className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserMinus className="mr-2 h-4 w-4" />
                            Delete Student
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            View Attendance
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Students;
