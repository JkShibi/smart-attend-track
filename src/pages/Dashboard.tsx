
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  XCircle 
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  // Mock data
  const attendanceStats = [
    { name: "Present", value: 85, color: "#10b981" },
    { name: "Absent", value: 10, color: "#ef4444" },
    { name: "Late", value: 5, color: "#f59e0b" },
  ];

  const classAttendanceData = [
    { id: 1, name: "Biology 101", present: 92, absent: 8 },
    { id: 2, name: "Mathematics 202", present: 88, absent: 12 },
    { id: 3, name: "Physics 101", present: 85, absent: 15 },
    { id: 4, name: "Chemistry 201", present: 90, absent: 10 },
  ];

  const recentActivity = [
    { id: 1, action: "Attendance taken for Physics 101", time: "10 minutes ago" },
    { id: 2, action: "New student registered", time: "1 hour ago" },
    { id: 3, action: "Attendance report generated", time: "3 hours ago" },
    { id: 4, action: "Class schedule updated", time: "Yesterday" },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="dashboard-grid mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">248</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">92%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
            <CardDescription>Last 30 days attendance summary</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceStats}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {attendanceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Class Attendance</CardTitle>
            <CardDescription>Attendance by class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classAttendanceData.map((cls) => (
                <div key={cls.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{cls.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {cls.present}% present
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${cls.present}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex justify-between border-b last:border-0 pb-3 last:pb-0">
                <div className="flex">
                  <div className="mr-3 bg-muted rounded-full p-2">
                    <BarChart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Dashboard;
