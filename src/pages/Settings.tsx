import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Download, FileDown, Mail, Shield, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { toast } = useToast();
  const { user, isTeacher } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [attendanceThreshold, setAttendanceThreshold] = useState([75]);
  const [exportLoading, setExportLoading] = useState(false);

  const handleSaveGeneral = () => {
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated",
    });
  };

  const handleSaveSystem = () => {
    toast({
      title: "System Settings Saved",
      description: "Your system settings have been updated",
    });
  };

  const exportStudentData = async () => {
    if (!isTeacher) {
      toast({
        title: "Permission Denied",
        description: "Only teachers can export student data",
        variant: "destructive",
      });
      return;
    }
    
    setExportLoading(true);
    
    try {
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
      
      // Convert to CSV
      const headers = ["ID", "Name", "Email", "Class", "Roll Number", "Attendance %"];
      const csvRows = [
        headers.join(","),
        ...combinedData.map(row => [
          row.id,
          `"${row.name}"`,
          `"${row.email}"`,
          `"${row.class}"`,
          `"${row.rollNumber}"`,
          row.attendance
        ].join(","))
      ];
      
      const csvContent = csvRows.join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "students_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Student data has been exported successfully",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "An error occurred during export",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const exportAttendanceData = async () => {
    if (!isTeacher) {
      toast({
        title: "Permission Denied",
        description: "Only teachers can export attendance data",
        variant: "destructive",
      });
      return;
    }
    
    setExportLoading(true);
    
    try {
      // Get attendance data with joined student and class info
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          id, 
          date, 
          status,
          students!inner(id, roll_number, profile_id),
          classes!inner(id, name)
        `);
      
      if (error) throw error;
      
      // Get student names from profiles
      const profileIds = [...new Set(data.map(item => item.students.profile_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", profileIds);
      
      if (profilesError) throw profilesError;
      
      // Format data for CSV
      const formattedData = data.map(item => {
        const profile = profilesData.find(p => p.id === item.students.profile_id);
        return {
          date: new Date(item.date).toLocaleDateString(),
          studentName: profile?.name || "Unknown",
          rollNumber: item.students.roll_number,
          class: item.classes.name,
          status: item.status
        };
      });
      
      // Convert to CSV
      const headers = ["Date", "Student Name", "Roll Number", "Class", "Status"];
      const csvRows = [
        headers.join(","),
        ...formattedData.map(row => [
          `"${row.date}"`,
          `"${row.studentName}"`,
          `"${row.rollNumber}"`,
          `"${row.class}"`,
          `"${row.status}"`
        ].join(","))
      ];
      
      const csvContent = csvRows.join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "attendance_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Attendance data has been exported successfully",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "An error occurred during export",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="mb-6">
        <TabsList className="grid grid-cols-4 w-full md:w-[500px]">
          <TabsTrigger value="general">
            <User className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system">
            <Shield className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="export">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" defaultValue="Admin User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" defaultValue="admin@smartattend.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="staff">Staff Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Theme Preference</Label>
                <RadioGroup defaultValue="light">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about attendance updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-email">Notification Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="notification-email"
                    type="email"
                    placeholder="your.email@example.com"
                    defaultValue="admin@smartattend.edu"
                    disabled={!notificationsEnabled || !emailNotifications}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Notification Triggers</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="attendance-below" className="cursor-pointer">
                      Low Attendance Alert
                    </Label>
                    <Switch
                      id="attendance-below"
                      defaultChecked
                      disabled={!notificationsEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-student" className="cursor-pointer">
                      New Student Registration
                    </Label>
                    <Switch
                      id="new-student"
                      defaultChecked
                      disabled={!notificationsEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="report-generated" className="cursor-pointer">
                      Report Generation
                    </Label>
                    <Switch
                      id="report-generated"
                      defaultChecked
                      disabled={!notificationsEnabled}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Attendance Threshold</Label>
                  <span className="text-sm font-medium">{attendanceThreshold}%</span>
                </div>
                <Slider
                  value={attendanceThreshold}
                  onValueChange={setAttendanceThreshold}
                  max={100}
                  min={50}
                  step={1}
                />
                <p className="text-sm text-muted-foreground">
                  Students falling below this attendance percentage will be flagged as at risk.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="academic-year">Academic Year</Label>
                <Select defaultValue="2023-2024">
                  <SelectTrigger id="academic-year">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Current Semester</Label>
                <Select defaultValue="fall">
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall">Fall</SelectItem>
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Data Management</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">Export All Data</Button>
                  <Button variant="outline" className="text-destructive">
                    Reset System
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSystem}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export system data for reporting and analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Student Data</Label>
                <p className="text-sm text-muted-foreground">
                  Export a CSV file containing all student information, including names, classes, and attendance records.
                </p>
                <Button 
                  onClick={exportStudentData} 
                  disabled={exportLoading || !isTeacher}
                  className="w-full flex items-center justify-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {exportLoading ? "Exporting..." : "Export Student Data"}
                </Button>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Attendance Records</Label>
                <p className="text-sm text-muted-foreground">
                  Export a CSV file containing detailed attendance records for all classes and students.
                </p>
                <Button 
                  onClick={exportAttendanceData} 
                  disabled={exportLoading || !isTeacher}
                  className="w-full flex items-center justify-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {exportLoading ? "Exporting..." : "Export Attendance Data"}
                </Button>
              </div>
              {!isTeacher && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                  Note: Only teachers can export system data. Contact your administrator if you need access to this data.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Settings;
