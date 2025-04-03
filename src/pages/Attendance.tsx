
import { useState } from "react";
import { CalendarIcon, Check, FileDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: "present" | "absent" | "late" | null;
}

const Attendance = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock classes
  const classes = [
    { id: "BIO101", name: "Biology 101" },
    { id: "MATH202", name: "Mathematics 202" },
    { id: "PHY101", name: "Physics 101" },
    { id: "CHEM201", name: "Chemistry 201" },
  ];

  // Fetch students for selected class (mock data)
  const fetchStudents = (classId: string) => {
    // This would be an API call in a real application
    console.log(`SQL Query: SELECT * FROM students WHERE class_id = '${classId}'`);

    // Mock data
    const mockStudents: Student[] = [
      { id: "S1", name: "Alice Johnson", rollNumber: "R001", status: null },
      { id: "S2", name: "Bob Smith", rollNumber: "R002", status: null },
      { id: "S3", name: "Charlie Davis", rollNumber: "R003", status: null },
      { id: "S4", name: "Diana Miller", rollNumber: "R004", status: null },
      { id: "S5", name: "Edward Wilson", rollNumber: "R005", status: null },
      { id: "S6", name: "Fiona Taylor", rollNumber: "R006", status: null },
      { id: "S7", name: "George Brown", rollNumber: "R007", status: null },
      { id: "S8", name: "Hannah Lewis", rollNumber: "R008", status: null },
    ];

    setStudents(mockStudents);
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    fetchStudents(classId);
  };

  const markAttendance = (studentId: string, status: "present" | "absent" | "late") => {
    // Update the status for the student
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );

    // This would be an API call in a real application
    console.log(`SQL Query: INSERT INTO attendance (student_id, class_id, date, status) 
      VALUES ('${studentId}', '${selectedClass}', '${format(date, "yyyy-MM-dd")}', '${status}')
      ON CONFLICT (student_id, class_id, date) 
      DO UPDATE SET status = '${status}'`);
  };

  const saveAttendance = () => {
    // Check if all students have attendance marked
    const allMarked = students.every((student) => student.status !== null);

    if (!allMarked) {
      toast({
        title: "Warning",
        description: "Not all students have attendance marked",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send all attendance data to backend
    toast({
      title: "Success",
      description: "Attendance records saved successfully",
    });

    // Log the batch operation that would happen
    console.log(`SQL Query: BATCH SAVE ATTENDANCE for class ${selectedClass} on ${format(date, "yyyy-MM-dd")}`);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const attendanceSummary = {
    total: students.length,
    present: students.filter((s) => s.status === "present").length,
    absent: students.filter((s) => s.status === "absent").length,
    late: students.filter((s) => s.status === "late").length,
    unmarked: students.filter((s) => s.status === null).length,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal"
                >
                  {date ? format(date, "PPP") : "Select date"}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Class</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleClassChange} value={selectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <Button 
              className="flex-1" 
              onClick={saveAttendance}
              disabled={!selectedClass || students.length === 0}
            >
              Save
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center" 
              disabled={!selectedClass || students.length === 0}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardContent>
        </Card>
      </div>

      {selectedClass && students.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Present</div>
                <div className="text-2xl font-bold text-green-600">
                  {attendanceSummary.present} 
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    / {attendanceSummary.total}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Absent</div>
                <div className="text-2xl font-bold text-red-600">
                  {attendanceSummary.absent}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    / {attendanceSummary.total}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Late</div>
                <div className="text-2xl font-bold text-amber-600">
                  {attendanceSummary.late}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    / {attendanceSummary.total}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Unmarked</div>
                <div className="text-2xl font-bold text-slate-600">
                  {attendanceSummary.unmarked}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    / {attendanceSummary.total}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {classes.find((c) => c.id === selectedClass)?.name} Attendance
              </CardTitle>
              <CardDescription>
                {format(date, "MMMM dd, yyyy")}
              </CardDescription>
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Mark Attendance</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            variant={student.status === "present" ? "default" : "outline"}
                            className={cn(
                              "w-24",
                              student.status === "present" && "bg-green-600 hover:bg-green-700"
                            )}
                            onClick={() => markAttendance(student.id, "present")}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === "late" ? "default" : "outline"}
                            className={cn(
                              "w-20",
                              student.status === "late" && "bg-amber-600 hover:bg-amber-700"
                            )}
                            onClick={() => markAttendance(student.id, "late")}
                          >
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === "absent" ? "default" : "outline"}
                            className={cn(
                              "w-24",
                              student.status === "absent" && "bg-red-600 hover:bg-red-700"
                            )}
                            onClick={() => markAttendance(student.id, "absent")}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Absent
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {student.status ? (
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs",
                              student.status === "present" && "bg-green-100 text-green-800",
                              student.status === "absent" && "bg-red-100 text-red-800",
                              student.status === "late" && "bg-amber-100 text-amber-800"
                            )}
                          >
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">Not marked</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {selectedClass && students.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <div className="text-muted-foreground mb-2">No students found for this class</div>
            <Button variant="outline" onClick={() => fetchStudents(selectedClass)}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      {!selectedClass && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <div className="text-muted-foreground mb-2">Select a class to manage attendance</div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Attendance;
