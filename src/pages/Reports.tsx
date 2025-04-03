
import { useState } from "react";
import { Calendar as CalendarIcon, Download, FileBarChart } from "lucide-react";
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
import { format, subDays } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const Reports = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("daily");
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Mock classes
  const classes = [
    { id: "BIO101", name: "Biology 101" },
    { id: "MATH202", name: "Mathematics 202" },
    { id: "PHY101", name: "Physics 101" },
    { id: "CHEM201", name: "Chemistry 201" },
    { id: "ALL", name: "All Classes" },
  ];

  // Mock data for daily attendance
  const dailyAttendanceData = [
    { id: 1, name: "Alice Johnson", rollNumber: "BIO001", status: "present" },
    { id: 2, name: "Bob Smith", rollNumber: "BIO002", status: "absent" },
    { id: 3, name: "Charlie Davis", rollNumber: "BIO003", status: "present" },
    { id: 4, name: "Diana Miller", rollNumber: "BIO004", status: "late" },
    { id: 5, name: "Edward Wilson", rollNumber: "BIO005", status: "present" },
    { id: 6, name: "Fiona Taylor", rollNumber: "BIO006", status: "present" },
    { id: 7, name: "George Brown", rollNumber: "BIO007", status: "absent" },
    { id: 8, name: "Hannah Lewis", rollNumber: "BIO008", status: "present" },
  ];

  // Mock data for weekly chart
  const weeklyChartData = [
    { day: "Mon", present: 42, absent: 3, late: 5 },
    { day: "Tue", present: 38, absent: 8, late: 4 },
    { day: "Wed", present: 45, absent: 2, late: 3 },
    { day: "Thu", present: 40, absent: 5, late: 5 },
    { day: "Fri", present: 37, absent: 10, late: 3 },
  ];

  // Mock data for monthly chart
  const monthlyChartData = [
    { week: "Week 1", attendance: 92 },
    { week: "Week 2", attendance: 88 },
    { week: "Week 3", attendance: 95 },
    { week: "Week 4", attendance: 90 },
  ];

  // Mock data for student summary
  const studentSummaryData = [
    { id: 1, name: "Alice Johnson", present: 18, absent: 1, late: 1, percentage: 95 },
    { id: 2, name: "Bob Smith", present: 15, absent: 3, late: 2, percentage: 85 },
    { id: 3, name: "Charlie Davis", present: 19, absent: 0, late: 1, percentage: 97 },
    { id: 4, name: "Diana Miller", present: 16, absent: 2, late: 2, percentage: 88 },
    { id: 5, name: "Edward Wilson", present: 17, absent: 2, late: 1, percentage: 90 },
  ];

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: `${reportType} report for ${selectedClass === "ALL" ? "all classes" : classes.find(c => c.id === selectedClass)?.name}`,
    });

    console.log(`SQL Query: SELECT * FROM attendance 
      WHERE ${selectedClass !== "ALL" ? `class_id = '${selectedClass}' AND ` : ''}
      date = '${format(date, "yyyy-MM-dd")}'`);
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "The report has been exported to CSV",
    });
  };

  const getStatusColor = (status: string) => {
    if (status === "present") return "bg-green-100 text-green-800";
    if (status === "late") return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const getAttendancePercentageColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Attendance Reports</h1>
      </div>

      <Tabs defaultValue="daily" className="mb-6" onValueChange={setReportType}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Class</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedClass} value={selectedClass}>
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

          <TabsContent value="daily" className="mt-0">
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
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Date Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-left font-normal"
                      >
                        {startDate ? format(startDate, "PPP") : "Start date"}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-left font-normal"
                      >
                        {endDate ? format(endDate, "PPP") : "End date"}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Month</CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue="11">
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-2">
              <Button
                className="flex-1"
                onClick={handleGenerateReport}
                disabled={!selectedClass}
              >
                <FileBarChart className="mr-2 h-4 w-4" />
                Generate
              </Button>
              <Button
                variant="outline"
                onClick={handleExportReport}
                disabled={!selectedClass}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardContent>
          </Card>
        </div>

        {selectedClass && (
          <>
            <TabsContent value="daily" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Attendance Report</CardTitle>
                  <CardDescription>
                    {selectedClass === "ALL"
                      ? "All Classes"
                      : classes.find((c) => c.id === selectedClass)?.name}{" "}
                    on {format(date, "MMMM dd, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll #</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyAttendanceData.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.rollNumber}
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs",
                                getStatusColor(student.status)
                              )}
                            >
                              {student.status.charAt(0).toUpperCase() +
                                student.status.slice(1)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Attendance Report</CardTitle>
                  <CardDescription>
                    {selectedClass === "ALL"
                      ? "All Classes"
                      : classes.find((c) => c.id === selectedClass)?.name}{" "}
                    from {format(startDate, "MMM dd")} to{" "}
                    {format(endDate, "MMM dd, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" fill="#10b981" name="Present" />
                        <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                        <Bar dataKey="late" fill="#f59e0b" name="Late" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Student Summary</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead className="text-center">Present</TableHead>
                          <TableHead className="text-center">Absent</TableHead>
                          <TableHead className="text-center">Late</TableHead>
                          <TableHead className="text-center">Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentSummaryData.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              {student.name}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.present}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.absent}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.late}
                            </TableCell>
                            <TableCell 
                              className={cn(
                                "text-center font-medium",
                                getAttendancePercentageColor(student.percentage)
                              )}
                            >
                              {student.percentage}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monthly" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Attendance Report</CardTitle>
                  <CardDescription>
                    {selectedClass === "ALL"
                      ? "All Classes"
                      : classes.find((c) => c.id === selectedClass)?.name}{" "}
                    for November 2023
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[70, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="attendance"
                          stroke="#3b82f6"
                          activeDot={{ r: 8 }}
                          name="Attendance %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Card className="bg-green-50">
                      <CardContent className="p-4">
                        <div className="text-xs text-muted-foreground">Average Attendance</div>
                        <div className="text-2xl font-bold text-green-600">91%</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <div className="text-xs text-muted-foreground">Best Day</div>
                        <div className="text-2xl font-bold text-blue-600">98%</div>
                        <div className="text-xs text-muted-foreground">Nov 15</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-50">
                      <CardContent className="p-4">
                        <div className="text-xs text-muted-foreground">Lowest Day</div>
                        <div className="text-2xl font-bold text-amber-600">82%</div>
                        <div className="text-xs text-muted-foreground">Nov 27</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-50">
                      <CardContent className="p-4">
                        <div className="text-xs text-muted-foreground">Total Classes</div>
                        <div className="text-2xl font-bold text-slate-600">22</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        {!selectedClass && (
          <Card className="mt-6">
            <CardContent className="flex flex-col items-center justify-center h-64">
              <div className="text-muted-foreground mb-2">
                Select a class to generate attendance reports
              </div>
            </CardContent>
          </Card>
        )}
      </Tabs>
    </>
  );
};

export default Reports;
