import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import {
  GetStockEntryProgress,
  GetStockOutputProgress,
} from "../../Services/ChartsService";

const AreaCharts = (props) => {
  const [sortieData, setSortieData] = useState([]);
  const [entreeData, setEntreeData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sortieProgress = await GetStockOutputProgress();
        const entreeProgress = await GetStockEntryProgress();

        // Convert dates to JavaScript Date objects
        const sortieQuantities = sortieProgress.map((item) => item.quantity || 0);
        const entreeQuantities = entreeProgress.map((item) => item.totalQuantite || 0);
        const months = sortieProgress.map((item) => new Date(item.date).getTime());

        setSortieData(sortieQuantities);
        setEntreeData(entreeQuantities);
        setCategories(months);
      } catch (error) {
        console.error("Error fetching stock progress", error);
      }
    };

    fetchData();
  }, []);

  const series = [
    {
      name: "Stock Input", 
      data: entreeData,
    },
    {
      name: "Stock Output", 
      data: sortieData,
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: categories,
      labels: {
        format: "MMM yyyy"
      }
    },
    tooltip: {
      x: {
        format: "MMM yyyy"
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ApexCharts
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default AreaCharts;
