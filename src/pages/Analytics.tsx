
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const Analytics = () => {
  // Mock data for charts
  const attendanceTrendData = [
    { month: "Jan", attendance: 92 },
    { month: "Feb", attendance: 89 },
    { month: "Mar", attendance: 91 },
    { month: "Apr", attendance: 87 },
    { month: "May", attendance: 90 },
    { month: "Jun", attendance: 93 },
    { month: "Jul", attendance: 88 },
    { month: "Aug", attendance: 85 },
    { month: "Sep", attendance: 92 },
    { month: "Oct", attendance: 94 },
    { month: "Nov", attendance: 91 },
  ];

  const classComparisonData = [
    { name: "Biology 101", attendance: 92 },
    { name: "Mathematics 202", attendance: 87 },
    { name: "Physics 101", attendance: 85 },
    { name: "Chemistry 201", attendance: 91 },
    { name: "History 101", attendance: 89 },
    { name: "English 202", attendance: 93 },
  ];

  const attendanceByDayData = [
    { day: "Monday", attendance: 94 },
    { day: "Tuesday", attendance: 92 },
    { day: "Wednesday", attendance: 88 },
    { day: "Thursday", attendance: 85 },
    { day: "Friday", attendance: 81 },
  ];

  const attendanceDistributionData = [
    { name: "90-100%", value: 58, color: "#10b981" },
    { name: "80-89%", value: 24, color: "#3b82f6" },
    { name: "70-79%", value: 12, color: "#f59e0b" },
    { name: "Below 70%", value: 6, color: "#ef4444" },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Select defaultValue="current">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Semester</SelectItem>
            <SelectItem value="previous">Previous Semester</SelectItem>
            <SelectItem value="yearly">Yearly Overview</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Average Attendance</div>
            <div className="text-3xl font-bold">89.7%</div>
            <div className="text-xs text-muted-foreground mt-1">+2.1% from last semester</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Perfect Attendance</div>
            <div className="text-3xl font-bold">32</div>
            <div className="text-xs text-muted-foreground mt-1">Students with 100% attendance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">At Risk</div>
            <div className="text-3xl font-bold">15</div>
            <div className="text-xs text-muted-foreground mt-1">Students below 75% attendance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Classes Monitored</div>
            <div className="text-3xl font-bold">24</div>
            <div className="text-xs text-muted-foreground mt-1">Across 4 departments</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="mb-6">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>Monthly attendance percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Attendance %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance by Day</CardTitle>
                <CardDescription>Weekly attendance pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceByDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="attendance"
                        fill="#14b8a6"
                        name="Attendance %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Comparison</CardTitle>
              <CardDescription>Attendance percentage by class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={classComparisonData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[80, 100]} />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="attendance"
                      fill="#f59e0b"
                      name="Attendance %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Distribution</CardTitle>
              <CardDescription>
                Student attendance breakdown by percentage range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={140}
                      innerRadius={70}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {attendanceDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Attendance patterns and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-700 mb-2">Attendance Trends</h3>
              <p className="text-sm text-blue-600">
                Attendance is highest at the beginning of the week, with a gradual decline towards Friday. Consider scheduling important classes or tests early in the week for maximum attendance.
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-medium text-amber-700 mb-2">At-Risk Students</h3>
              <p className="text-sm text-amber-600">
                15 students currently have below 75% attendance, which puts them at risk of academic penalties. Early intervention is recommended.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-700 mb-2">High Performers</h3>
              <p className="text-sm text-green-600">
                Biology 101 and English 202 have the highest attendance rates. Consider studying their engagement techniques for implementation in other classes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Analytics;
