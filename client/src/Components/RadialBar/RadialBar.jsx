import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import productService from "../../Services/ProductService";

const RadialBar = (props) => {
  const [chart, setChart] = useState([0]); // The percentage for the radial bar

  useEffect(() => {
    const GetProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        let totalQuantity = 0;
        response.forEach((element) => {
          totalQuantity += element.quantity;
        });
        setChart([Math.floor(totalQuantity / 5000)]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    GetProducts();
  }, []);

  const options = {
    chart: {
      height: 150, // Reduced height
      type: "radialBar",
      offsetY: -5, // Reduced offset
    },
    plotOptions: {
      radialBar: {
        startAngle: -130,
        endAngle: 130,
        dataLabels: {
          name: {
            fontSize: "18px", // Reduced font size for the label name
            color: undefined,
            offsetY: 70, // Further adjusted for smaller height
          },
          value: {
            offsetY: 0, // Reduced offset for the value
            fontSize: "24px", // Reduced font size for the value
            color: undefined,
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: [`Capacite remplissage ${chart[0] * 5} k / 500 k`],
  };

  return (
    <div>
      <div id="chart">
        <ApexCharts
          options={options}
          series={chart}
          type="radialBar"
          height={250}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default RadialBar;
