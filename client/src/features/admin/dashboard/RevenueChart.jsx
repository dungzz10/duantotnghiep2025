import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Card, DatePicker, Spin, Select } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getBaseUrl } from "../../../utils/baseURL";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;
const { Option } = Select;

const RevenueChart = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(6, "months"),
    moment()
  ]);
  const [revenueData, setRevenueData] = useState([]);
  const [timeGrouping, setTimeGrouping] = useState("month");

  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      fetchRevenueData();
    }
  }, [dateRange, timeGrouping]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");

      const response = await axios.get(
        `${getBaseUrl()}/api/v1/thongke/revenue-statistics?startDate=${startDate}&endDate=${endDate}&type=${timeGrouping}`
      );

      setRevenueData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
    }
  };

  const handleGroupingChange = (value) => {
    setTimeGrouping(value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Prepare chart data
  const chartData = {
    labels: revenueData.map(item => {
      if (timeGrouping === "day") return moment(item._id).format("DD/MM/YYYY");
      if (timeGrouping === "week") return `Tuần ${item._id}`;
      if (timeGrouping === "month") return moment(item._id).format("MM/YYYY");
      if (timeGrouping === "year") return item._id;
      return item._id;
    }),
    datasets: [
      {
        label: 'Doanh thu',
        data: revenueData.map(item => item.revenue),
        borderColor: '#00FF7F',
        backgroundColor: 'rgba(0, 255, 127, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: '#00FF7F',
        pointRadius: 5,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#FFF'
        }
      },
      title: {
        display: true,
        text: 'Biểu đồ doanh thu',
        color: '#FF69B4',
        font: {
          size: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Doanh thu: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#00FFFF',
          callback: function(value) {
            if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            return value;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        title: {
          display: true,
          text: 'DOANH THU (VNĐ)',
          color: '#00FFFF',
          font: {
            size: 14
          }
        }
      },
      x: {
        ticks: {
          color: '#FFFF00'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        title: {
          display: true,
          text: 'THỜI GIAN',
          color: '#FFFF00',
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <Card 
      title="Biểu đồ thống kê doanh thu"
      style={{ backgroundColor: '#191970', borderColor: '#4169E1' }}
      headStyle={{ color: '#FFFFFF' }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span style={{ marginRight: '10px', color: '#FFFFFF' }}>Nhóm theo:</span>
          <Select 
            value={timeGrouping} 
            onChange={handleGroupingChange}
            style={{ width: 120 }}
          >
            <Option value="day">Ngày</Option>
            <Option value="week">Tuần</Option>
            <Option value="month">Tháng</Option>
            <Option value="year">Năm</Option>
          </Select>
        </div>
        <RangePicker
          value={dateRange}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          ranges={{
            'Hôm nay': [moment().startOf('day'), moment()],
            '7 ngày qua': [moment().subtract(7, 'days'), moment()],
            '30 ngày qua': [moment().subtract(30, 'days'), moment()],
            '3 tháng qua': [moment().subtract(3, 'months'), moment()],
            '6 tháng qua': [moment().subtract(6, 'months'), moment()],
            'Năm nay': [moment().startOf('year'), moment()]
          }}
        />
      </div>

      <div style={{ height: '400px' }}>
        {loading ? (
          <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
      
      <div style={{ textAlign: 'right', marginTop: '10px', color: '#CCCCCC' }}>
        Biểu đồ được tạo ngày {moment().format('DD/MM/YYYY')}
      </div>
    </Card>
  );
};

export default RevenueChart;