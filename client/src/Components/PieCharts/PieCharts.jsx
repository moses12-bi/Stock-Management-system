import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import productService from "../../Services/ProductService";

const PieCharts = (props) => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  const options = {
    chart: {
      height: 200,
      type: "pie",
    },
    labels: labels,
    legend: {
      show: false, // Hide the legend
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  useEffect(() => {
    const GetProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        setSeries(response.map((item) => item.quantity));
        setLabels(response.map((item) => item.name));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    GetProducts();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <div id="chart">
          <Chart options={options} series={series} type="pie" height={200} />
        </div>
      )}
      <div id="html-dist"></div>
    </div>
  );
};

export default PieCharts;
