
import { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    {
      id: "ST001",
      name: "Alice Johnson",
      email: "alice.j@example.com",
      class: "Biology 101",
      rollNumber: "B101",
      attendance: 95,
    },
    {
      id: "ST002",
      name: "Bob Smith",
      email: "bob.s@example.com",
      class: "Mathematics 202",
      rollNumber: "M202",
      attendance: 88,
    },
    {
      id: "ST003",
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      class: "Physics 101",
      rollNumber: "P101",
      attendance: 75,
    },
    {
      id: "ST004",
      name: "Diana Miller",
      email: "diana.m@example.com",
      class: "Chemistry 201",
      rollNumber: "C201",
      attendance: 92,
    },
    {
      id: "ST005",
      name: "Eddie Wilson",
      email: "eddie.w@example.com",
      class: "Biology 101",
      rollNumber: "B102",
      attendance: 84,
    },
  ]);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    class: "",
    rollNumber: "",
  });

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

  const handleAddStudent = () => {
    // Validation
    if (!newStudent.name || !newStudent.email || !newStudent.class || !newStudent.rollNumber) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    // Generate a new ID
    const newId = `ST${String(students.length + 1).padStart(3, "0")}`;

    // Create the new student object
    const student: Student = {
      id: newId,
      name: newStudent.name,
      email: newStudent.email,
      class: newStudent.class,
      rollNumber: newStudent.rollNumber,
      attendance: 100, // Default for new students
    };

    // Log the query that would be executed
    console.log(`SQL Query: INSERT INTO students (id, name, email, class, roll_number) 
      VALUES ('${newId}', '${newStudent.name}', '${newStudent.email}', '${newStudent.class}', '${newStudent.rollNumber}')`);

    // Add the student to the array
    setStudents([...students, student]);

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
                    <SelectItem value="Biology 101">Biology 101</SelectItem>
                    <SelectItem value="Mathematics 202">Mathematics 202</SelectItem>
                    <SelectItem value="Physics 101">Physics 101</SelectItem>
                    <SelectItem value="Chemistry 201">Chemistry 201</SelectItem>
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
                  <TableCell>{student.id}</TableCell>
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
        </CardContent>
      </Card>
    </>
  );
};

export default Students;
