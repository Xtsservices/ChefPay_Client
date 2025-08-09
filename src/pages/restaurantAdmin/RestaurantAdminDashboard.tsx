import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { Building, ShoppingCart, IndianRupee } from "lucide-react";
import { apiGet } from "@/api/apis";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const RestaurantAdminDashboard = () => {
  // Separate states for line chart and pie chart filters
  const [lineSelectedMonth, setLineSelectedMonth] = useState("all");
  const [lineSelectedYear, setLineSelectedYear] = useState("2025");
  const [pieSelectedMonth, setPieSelectedMonth] = useState("all");
  const [pieSelectedYear, setPieSelectedYear] = useState("2025");
  const hasDashboardData = useRef(false);
  const [dashboardData, setDashboardData] = useState(null);

  const totalRestaurants = 247;
  const todaysOrders = 1842;
  const todaysRevenue = 89247;

  // Monthly dataset (aggregated)
  const monthlyData = [
    {
      month: "Jan",
      tiffins: 5,
      lunch: 8,
      snacks: 12,
      beverages: 15,
      desserts: 18,
    },
    {
      month: "Feb",
      tiffins: 7,
      lunch: 10,
      snacks: 14,
      beverages: 17,
      desserts: 20,
    },
    {
      month: "Mar",
      tiffins: 6,
      lunch: 9,
      snacks: 13,
      beverages: 16,
      desserts: 19,
    },
    {
      month: "Apr",
      tiffins: 8,
      lunch: 11,
      snacks: 15,
      beverages: 18,
      desserts: 21,
    },
    {
      month: "May",
      tiffins: 9,
      lunch: 12,
      snacks: 16,
      beverages: 19,
      desserts: 22,
    },
    {
      month: "Jun",
      tiffins: 8,
      lunch: 11,
      snacks: 15,
      beverages: 18,
      desserts: 21,
    },
    {
      month: "Jul",
      tiffins: 10,
      lunch: 13,
      snacks: 17,
      beverages: 20,
      desserts: 23,
    },
    {
      month: "Aug",
      tiffins: 9,
      lunch: 12,
      snacks: 16,
      beverages: 19,
      desserts: 22,
    },
    {
      month: "Sep",
      tiffins: 11,
      lunch: 14,
      snacks: 18,
      beverages: 21,
      desserts: 24,
    },
    {
      month: "Oct",
      tiffins: 12,
      lunch: 15,
      snacks: 19,
      beverages: 22,
      desserts: 25,
    },
    {
      month: "Nov",
      tiffins: 11,
      lunch: 14,
      snacks: 18,
      beverages: 21,
      desserts: 24,
    },
    {
      month: "Dec",
      tiffins: 13,
      lunch: 16,
      snacks: 20,
      beverages: 23,
      desserts: 26,
    },
  ];

  // Daily dataset for one example month
  const dailyData = Array.from({ length: 31 }, (_, i) => ({
    day: `${i + 1}`,
    tiffins: Math.floor(Math.random() * 10) + 5,
    lunch: Math.floor(Math.random() * 12) + 8,
    snacks: Math.floor(Math.random() * 15) + 10,
    beverages: Math.floor(Math.random() * 18) + 12,
    desserts: Math.floor(Math.random() * 20) + 15,
  }));

  const filteredData = lineSelectedMonth === "all" ? monthlyData : dailyData;

  const lineData = {
    labels:
      lineSelectedMonth === "all"
        ? filteredData.map((d) => d.month)
        : filteredData.map((d) => d.day),
    datasets: [
      {
        label: "Tiffins",
        data: filteredData.map((d) => d.tiffins),
        borderColor: "#FBBF24",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Lunch",
        data: filteredData.map((d) => d.lunch),
        borderColor: "#EF4444",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Snacks",
        data: filteredData.map((d) => d.snacks),
        borderColor: "#3B82F6",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Beverages",
        data: filteredData.map((d) => d.beverages),
        borderColor: "#F97316",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Desserts",
        data: filteredData.map((d) => d.desserts),
        borderColor: "#EC4899",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
      },
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
        borderWidth: 0,
        cutout: "60%",
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

  const getDashboardData = async () => {
    try {
      const response = await apiGet(
        "/adminDasboard/getCanteenCountAndTotalRevenue"
      );
      if (response.status === 200) {
        console.log("Dashboard data fetched successfully:", response);
        setDashboardData(response.data.data);
        // Process the data as needed
        // For example, you can update state variables here
      } else {
        console.error("Failed to fetch dashboard data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (!hasDashboardData.current) {
      hasDashboardData.current = true;
      getDashboardData();
    }
  }, []);

  console.log("dashboardData:", dashboardData);

  return (
    <div className="bg-white rounded-xl min-h-screen max-w-full overflow-hidden">
      <div className="p-4 sm:p-6 space-y-6 max-w-full">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CardContent className="flex items-center justify-between p-4 sm:p-6">
              <div className="min-w-0 flex-1">
                <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 text-black">
                  Total Restaurants
                </div>
                <div className="font-bold text-xl sm:text-3xl text-black truncate">
                  {dashboardData?.totalCanteens || 0}
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-gray-100 rounded-full flex-shrink-0 ml-3">
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CardContent className="flex items-center justify-between p-4 sm:p-6">
              <div className="min-w-0 flex-1">
                <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 text-black">
                  Today's Orders
                </div>
                <div className="font-bold text-xl sm:text-3xl text-black truncate">
                  {dashboardData?.todayOrders || 0}
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-gray-100 rounded-full flex-shrink-0 ml-3">
                <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CardContent className="flex items-center justify-between p-4 sm:p-6">
              <div className="min-w-0 flex-1">
                <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1 text-black">
                  Today's Revenue
                </div>
                <div className="font-bold text-xl sm:text-3xl text-black truncate">
                  ₹ {dashboardData?.todayRevenue?.toLocaleString() || "0"}
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-gray-100 rounded-full flex-shrink-0 ml-3">
                <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Panels */}
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4 sm:gap-6 max-w-full">
          {/* Orders Over Time */}
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-black truncate">
                Orders Over Time
              </CardTitle>
              <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                <Select
                  value={lineSelectedMonth}
                  onValueChange={setLineSelectedMonth}
                >
                  <SelectTrigger className="w-[80px] sm:w-[100px] h-8 sm:h-9 bg-white border border-gray-300 rounded-md text-xs sm:text-sm text-black">
                    <SelectValue placeholder="All" />
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
                <Select
                  value={lineSelectedYear}
                  onValueChange={setLineSelectedYear}
                >
                  <SelectTrigger className="w-[80px] sm:w-[100px] h-8 sm:h-9 bg-white border border-gray-300 rounded-md text-xs sm:text-sm text-black">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-2 min-w-0">
              <div className="w-full" style={{ height: "250px" }}>
                <Line
                  data={lineData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: "index",
                      intersect: false,
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: {
                          color: "#6B7280",
                          font: { size: 11 },
                          maxRotation: 0,
                        },
                      },
                      y: {
                        grid: { color: "#F3F4F6" },
                        border: { display: false },
                        ticks: {
                          color: "#6B7280",
                          font: { size: 11 },
                        },
                        beginAtZero: true,
                      },
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        enabled: true,
                        mode: "index",
                        intersect: false,
                        backgroundColor: "#1F2937",
                        titleColor: "#F9FAFB",
                        bodyColor: "#F9FAFB",
                        borderColor: "#374151",
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        titleFont: {
                          size: 13,
                          weight: "bold",
                        },
                        bodyFont: {
                          size: 12,
                        },
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                          title: function (context) {
                            return lineSelectedMonth === "all"
                              ? `Month: ${context[0].label}`
                              : `Day: ${context[0].label}`;
                          },
                          label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.y} orders`;
                          },
                          footer: function (tooltipItems) {
                            let sum = 0;
                            tooltipItems.forEach(function (tooltipItem) {
                              sum += tooltipItem.parsed.y;
                            });
                            return `Total: ${sum} orders`;
                          },
                        },
                      },
                    },
                    elements: {
                      point: {
                        radius: 0,
                        hoverRadius: 8,
                        hoverBorderWidth: 3,
                        hoverBorderColor: "#FFFFFF",
                        backgroundColor: function (context) {
                          return context.dataset.borderColor;
                        },
                      },
                      line: {
                        tension: 0.4,
                        borderWidth: 2,
                      },
                    },
                    onHover: (event, activeElements) => {
                      const chart = event.chart;
                      chart.canvas.style.cursor =
                        activeElements.length > 0 ? "pointer" : "default";
                    },
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6">
                {categories.map((cat) => (
                  <span
                    key={cat.label}
                    className="flex items-center gap-2 text-xs sm:text-sm text-black font-medium"
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    ></span>
                    <span className="whitespace-nowrap">{cat.label}</span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 3 Restaurants Revenue */}
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 pb-2 sm:pb-4 gap-3">
              <CardTitle className="text-base sm:text-lg font-semibold text-black leading-tight">
                Top 3 Restaurants
                <br className="sm:hidden" /> Revenue
              </CardTitle>
              <div className="flex gap-2 flex-shrink-0">
                <Select
                  value={pieSelectedMonth}
                  onValueChange={setPieSelectedMonth}
                >
                  <SelectTrigger className="w-[60px] sm:w-[80px] h-8 sm:h-9 bg-white border border-gray-300 rounded-md text-xs sm:text-sm text-black">
                    <SelectValue placeholder="All" />
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
                <Select
                  value={pieSelectedYear}
                  onValueChange={setPieSelectedYear}
                >
                  <SelectTrigger className="w-[60px] sm:w-[80px] h-8 sm:h-9 bg-white border border-gray-300 rounded-md text-xs sm:text-sm text-black">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-2 min-w-0">
              <div
                style={{ height: "150px" }}
                className="flex items-center justify-center w-full"
              >
                <Doughnut
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "60%",
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: "#1F2937",
                        titleColor: "#F9FAFB",
                        bodyColor: "#F9FAFB",
                        borderColor: "#374151",
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                          label: function (context) {
                            return `${
                              context.label
                            }: ₹${context.parsed.toLocaleString()}`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
                {topRestaurantsRevenue.map((r, index) => (
                  <div
                    key={r.name}
                    className="flex items-center justify-between min-w-0 gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            pieData.datasets[0].backgroundColor[index],
                        }}
                      ></span>
                      <span className="text-xs sm:text-sm text-black font-medium truncate">
                        {r.name}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-black whitespace-nowrap">
                      ₹{r.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdminDashboard;
