import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AcademicBanner from "@/components/AcademicBanner";

const Insights = () => {
  const acceptanceData = [
    { month: "Jan", rate: 45 },
    { month: "Feb", rate: 52 },
    { month: "Mar", rate: 61 },
    { month: "Apr", rate: 58 },
    { month: "May", rate: 67 },
    { month: "Jun", rate: 73 },
  ];

  const segmentData = [
    { segment: "Urban Savers", acceptance: 85, count: 450 },
    { segment: "Green Advocates", acceptance: 72, count: 320 },
    { segment: "Luxury Seekers", acceptance: 91, count: 180 },
    { segment: "Budget Conscious", acceptance: 45, count: 620 },
  ];

  const objectionData = [
    { name: "Price too high", value: 35 },
    { name: "Privacy concerns", value: 28 },
    { name: "No brand trust", value: 18 },
    { name: "Product mismatch", value: 12 },
    { name: "Others", value: 7 },
  ];

  const COLORS = ["#FF5636", "#FF8A65", "#FFAB91", "#FFCCBC", "#FBE9E7"];

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">Track campaign performance and consumer behavior</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Overall Acceptance</p>
            <p className="text-3xl font-bold text-success">73%</p>
            <p className="text-xs text-muted-foreground mt-2">↑ 12% from last month</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Avg Discount Required</p>
            <p className="text-3xl font-bold">18%</p>
            <p className="text-xs text-muted-foreground mt-2">↓ 3% from last month</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Simulations</p>
            <p className="text-3xl font-bold">1,570</p>
            <p className="text-xs text-muted-foreground mt-2">↑ 284 this month</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">CLV Uplift</p>
            <p className="text-3xl font-bold text-success">+42%</p>
            <p className="text-xs text-muted-foreground mt-2">Predicted avg increase</p>
          </Card>
        </div>

        {/* Acceptance Rate Trend */}
        <Card className="p-6">
          <h3 className="mb-4">Acceptance Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={acceptanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="rate" stroke="#FF5636" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Segment Performance */}
          <Card className="p-6">
            <h3 className="mb-4">Segment Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={segmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="segment" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="acceptance" fill="#FF5636" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Objections */}
          <Card className="p-6">
            <h3 className="mb-4">Top Objections</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={objectionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {objectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <AcademicBanner />
    </AppShell>
  );
};

export default Insights;
