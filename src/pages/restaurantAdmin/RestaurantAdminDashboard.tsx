import { useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { Building, ShoppingCart, IndianRupee } from "lucide-react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend);

const RestaurantAdminDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2025");

  const totalRestaurants = 247;
  const todaysOrders = 1842;
  const todaysRevenue = 89247;

  // Monthly dataset (aggregated)
  const monthlyData = [
    { month: "Jan", tiffins: 20, lunch: 30, snacks: 15, beverages: 10, desserts: 5 },
    { month: "Feb", tiffins: 25, lunch: 35, snacks: 20, beverages: 15, desserts: 10 },
    { month: "Mar", tiffins: 18, lunch: 28, snacks: 12, beverages: 8, desserts: 4 },
    { month: "Apr", tiffins: 30, lunch: 40, snacks: 25, beverages: 20, desserts: 15 },
    { month: "May", tiffins: 35, lunch: 45, snacks: 30, beverages: 25, desserts: 20 },
    { month: "Jun", tiffins: 28, lunch: 38, snacks: 22, beverages: 18, desserts: 12 },
    { month: "Jul", tiffins: 40, lunch: 50, snacks: 35, beverages: 30, desserts: 25 },
    { month: "Aug", tiffins: 32, lunch: 42, snacks: 28, beverages: 22, desserts: 18 },
    { month: "Sep", tiffins: 45, lunch: 55, snacks: 40, beverages: 35, desserts: 30 },
    { month: "Oct", tiffins: 48, lunch: 58, snacks: 42, beverages: 38, desserts: 32 },
    { month: "Nov", tiffins: 42, lunch: 52, snacks: 38, beverages: 32, desserts: 28 },
    { month: "Dec", tiffins: 50, lunch: 60, snacks: 45, beverages: 40, desserts: 35 },
  ];

  // Daily dataset for one example month (replace with real API data)
  const dailyData = Array.from({ length: 31 }, (_, i) => ({
    day: `${i + 1}`,
    tiffins: Math.floor(Math.random() * 20) + 5,
    lunch: Math.floor(Math.random() * 30) + 10,
    snacks: Math.floor(Math.random() * 15) + 5,
    beverages: Math.floor(Math.random() * 10) + 2,
    desserts: Math.floor(Math.random() * 8) + 1,
  }));

  const filteredData =
    selectedMonth === "all" ? monthlyData : dailyData;

  const lineData = {
    labels: selectedMonth === "all"
      ? filteredData.map((d) => d.month)
      : filteredData.map((d) => d.day),
    datasets: [
      { label: "Tiffins", data: filteredData.map((d) => d.tiffins), borderColor: "#FBBF24", backgroundColor: "#FBBF2433", fill: true },
      { label: "Lunch", data: filteredData.map((d) => d.lunch), borderColor: "#EF4444", backgroundColor: "#EF444433", fill: true },
      { label: "Snacks", data: filteredData.map((d) => d.snacks), borderColor: "#3B82F6", backgroundColor: "#3B82F633", fill: true },
      { label: "Beverages", data: filteredData.map((d) => d.beverages), borderColor: "#F97316", backgroundColor: "#F9731633", fill: true },
      { label: "Desserts", data: filteredData.map((d) => d.desserts), borderColor: "#EC4899", backgroundColor: "#EC489933", fill: true },
    ],
  };

  const topRestaurantsRevenue = [
    { name: "Restaurant A", revenue: 45000 },
    { name: "Restaurant B", revenue: 35000 },
    { name: "Restaurant C", revenue: 9200 },
  ];

  const pieData = {
    labels: topRestaurantsRevenue.map((r) => r.name),
    datasets: [
      {
        data: topRestaurantsRevenue.map((r) => r.revenue),
        backgroundColor: ["#FBBF24", "#3B82F6", "#10B981"],
        borderWidth: 1,
      },
    ],
  };

  const categories = [
    { label: "Tiffins", color: "#FBBF24" },
    { label: "Lunch", color: "#EF4444" },
    { label: "Snacks", color: "#3B82F6" },
    { label: "Beverages", color: "#F97316" },
    { label: "Desserts", color: "#EC4899" },
  ];

  return (
    <div className="p-3 space-y-8">

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white text-black rounded-lg">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <div className="text-gray-500 text-sm">Total Restaurants</div>
              <div className="font-bold text-2xl">{totalRestaurants}</div>
            </div>
            <Building className="h-10 w-10 text-gray-700" />
          </CardContent>
        </Card>
        <Card className="bg-white text-black rounded-lg">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <div className="text-gray-500 text-sm">Today's Orders</div>
              <div className="font-bold text-2xl">{todaysOrders}</div>
            </div>
            <ShoppingCart className="h-10 w-10 text-gray-700" />
          </CardContent>
        </Card>
        <Card className="bg-white text-black rounded-lg">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <div className="text-gray-500 text-sm">Today's Revenue</div>
              <div className="font-bold text-2xl">₹{todaysRevenue.toLocaleString()}</div>
            </div>
            <IndianRupee className="h-10 w-10 text-gray-700" />
          </CardContent>
        </Card>
      </div>

      {/* Analytics Panels */}
      <div className="grid grid-cols-1 md:grid-cols-[65%_35%] gap-8">

        {/* Orders Over Time */}
        <Card className=" bg-white text-black rounded-lg">
          <CardHeader className="bg-white text-black rounded-lg flex items-center justify-center">
            <CardTitle>Orders Over Time</CardTitle>
            <div className="flex text-white gap-4 mt-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="jan">Jan</SelectItem>
                  <SelectItem value="feb">Feb</SelectItem>
                  <SelectItem value="mar">Mar</SelectItem>
                  <SelectItem value="apr">Apr</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="jun">Jun</SelectItem>
                  <SelectItem value="jul">Jul</SelectItem>
                  <SelectItem value="aug">Aug</SelectItem>
                  <SelectItem value="sep">Sep</SelectItem>
                  <SelectItem value="oct">Oct</SelectItem>
                  <SelectItem value="nov">Nov</SelectItem>
                  <SelectItem value="dec">Dec</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ height: "192px" }}>
              <Line data={lineData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { x: { grid: { display: false } }, y: { grid: { color: "#E5E7EB" } } },
                plugins: { legend: { display: false } }
              }} />
            </div>
            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              {categories.map((cat) => (
                <span key={cat.label} className="flex items-center gap-1">
                  <span className="w-3 h-3 inline-block rounded-full" style={{ backgroundColor: cat.color }}></span>
                  {cat.label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Restaurants Revenue */}
        <Card className="bg-white text-black rounded-lg">
          
            <CardHeader className="bg-white text-black rounded-lg flex items-center justify-center">
            <CardTitle>Orders Over Time</CardTitle>
            <div className="flex text-white gap-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="jan">Jan</SelectItem>
                  <SelectItem value="feb">Feb</SelectItem>
                  <SelectItem value="mar">Mar</SelectItem>
                  <SelectItem value="apr">Apr</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="jun">Jun</SelectItem>
                  <SelectItem value="jul">Jul</SelectItem>
                  <SelectItem value="aug">Aug</SelectItem>
                  <SelectItem value="sep">Sep</SelectItem>
                  <SelectItem value="oct">Oct</SelectItem>
                  <SelectItem value="nov">Nov</SelectItem>
                  <SelectItem value="dec">Dec</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
         
          </CardHeader>
          <CardContent>
            <div style={{ height: "192px" }}>
              <Pie data={pieData} options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "60%",
                plugins: { legend: { display: false } }
              }} />
            </div>
            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              {topRestaurantsRevenue.map((r, index) => (
                <span key={r.name} className="flex items-center gap-1">
                  <span className="w-3 h-3 inline-block rounded-full"
                    style={{ backgroundColor: pieData.datasets[0].backgroundColor[index] }}></span>
                  {r.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantAdminDashboard;
