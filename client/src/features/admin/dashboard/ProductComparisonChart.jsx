import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Card, DatePicker, Spin, Select, Switch } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getBaseUrl } from "../../../utils/baseURL";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;
const { Option } = Select;

const ProductComparisonChart = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, "days"),
    moment()
  ]);
  const [productsData, setProductsData] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(5);
  const [showByRevenue, setShowByRevenue] = useState(false);

  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      fetchProductsData();
    }
  }, [dateRange]);

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");

      // Fetch both quantity and revenue data
      const [quantityResponse, revenueResponse] = await Promise.all([
        axios.get(`${getBaseUrl()}/api/v1/thongke/top-products?startDate=${startDate}&endDate=${endDate}`),
        axios.get(`${getBaseUrl()}/api/v1/thongke/top-products-sell?startDate=${startDate}&endDate=${endDate}`)
      ]);

      const quantityData = quantityResponse.data.data || [];
      const revenueData = revenueResponse.data.data || [];
      
      // Combine data for analysis
      const combined = revenueData.map(revItem => {
        const quantityItem = quantityData.find(q => q._id === revItem._id);
        return {
          ...revItem,
          totalQuantity: quantityItem ? quantityItem.totalQuantity : 0
        };
      });

      setProductsData(combined);
    } catch (error) {
      console.error("Error fetching products data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
    }
  };

  const handleLimitChange = (value) => {
    setDisplayLimit(parseInt(value));
  };

  const handleShowByRevenueChange = (checked) => {
    setShowByRevenue(checked);
  };

  // Prepare chart data
  const sortedData = [...productsData]
    .sort((a, b) => {
      if (showByRevenue) {
        return b.productPrice - a.productPrice;
      } else {
        return b.totalQuantity - a.totalQuantity;
      }
    })
    .slice(0, displayLimit);

  const chartData = {
    labels: sortedData.map(item => {
      // Truncate long product names
      const name = item.productName || "Không tên";
      return name.length > 15 ? name.substring(0, 15) + '...' : name;
    }),
    datasets: [
      {
        label: showByRevenue ? 'Doanh thu (VNĐ)' : 'Số lượng bán',
        data: sortedData.map(item => showByRevenue ? item.productPrice : item.totalQuantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)',
          'rgba(40, 159, 64, 0.7)',
          'rgba(210, 199, 199, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(40, 159, 64, 1)',
          'rgba(210, 199, 199, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y',  // Horizontal bar chart
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
        text: showByRevenue ? 'Thống kê doanh thu theo sản phẩm' : 'Thống kê số lượng bán theo sản phẩm',
        color: '#FF69B4',
        font: {
          size: 18
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            if (showByRevenue) {
              return `Doanh thu: ${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`;
            } else {
              return `Số lượng: ${value}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#00FFFF',
          callback: function(value) {
            if (showByRevenue) {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            }
            return value;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#FFFF00'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <Card 
      title="So sánh sản phẩm"
      style={{ backgroundColor: '#191970', borderColor: '#4169E1' }}
      headStyle={{ color: '#FFFFFF' }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ marginRight: '10px', color: '#FFFFFF' }}>Hiển thị:</span>
          <Select 
            value={displayLimit} 
            onChange={handleLimitChange}
            style={{ width: 80, marginRight: '20px' }}
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={15}>15</Option>
          </Select>
          
          <span style={{ marginRight: '10px', color: '#FFFFFF' }}>So sánh theo doanh thu:</span>
          <Switch 
            checked={showByRevenue} 
            onChange={handleShowByRevenueChange} 
            checkedChildren="Doanh thu" 
            unCheckedChildren="Số lượng"
          />
        </div>
        
        <RangePicker
          value={dateRange}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          ranges={{
            'Hôm nay': [moment().startOf('day'), moment()],
            '7 ngày qua': [moment().subtract(7, 'days'), moment()],
            '30 ngày qua': [moment().subtract(30, 'days'), moment()],
            '3 tháng qua': [moment().subtract(3, 'months'), moment()]
          }}
        />
      </div>

      <div style={{ height: '400px' }}>
        {loading ? (
          <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
      
      <div style={{ textAlign: 'right', marginTop: '10px', color: '#CCCCCC' }}>
        Biểu đồ được tạo ngày {moment().format('DD/MM/YYYY')}
      </div>
    </Card>
  );
};

export default ProductComparisonChart;