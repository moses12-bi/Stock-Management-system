import React, { useEffect, useState } from "react";
import AreaCharts from "../../Components/AreaCharts/AreaCharts";
import PieCharts from "../../Components/PieCharts/PieCharts";
import RadialBar from "../../Components/RadialBar/RadialBar";
import ItemSkeleton from "../../Components/ItemSkeleton/ItemSkeleton";
import { GetStockEntryProgress, GetStockOutputProgress, GetDashboardStats } from "../../Services/ChartsService";
import { useAuth } from "../../contexts/useAuth";
import Dashboard from "../../Components/Dashboard/Dashboard";

const DashboardPage = () => {
  console.log("Rendering DashboardPage");
  const [stats, setStats] = useState(null);
  const [stockEntryProgress, setStockEntryProgress] = useState([]);
  const [stockOutputProgress, setStockOutputProgress] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log("DashboardPage useEffect running");
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First fetch stats
        const statsResponse = await GetDashboardStats();
        console.log('Stats Response:', statsResponse);
        setStats(statsResponse);

        // Then fetch progress data
        const [entryResponse, outputResponse] = await Promise.all([
          GetStockEntryProgress(),
          GetStockOutputProgress()
        ]);

        setStockEntryProgress(entryResponse);
        setStockOutputProgress(outputResponse);
        setLoading(false);
        console.log("Dashboard data fetched successfully. isLoading:", false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
        setLoading(false);
        console.log("Error fetching dashboard data. isLoading:", false, "error:", error.message);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="flex-1 flex flex-col p-4">
        {error && (
          <div className="w-full p-4 text-center text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="flex-1">
          <Dashboard stats={stats} />
        </div>

        {/* Charts Section */}
        <div className="mt-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Stock Entry Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Entry Progress</h3>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="bg-gray-200 rounded h-64"></div>
                </div>
              ) : (
                <AreaCharts data={stockEntryProgress} type="entry" />
              )}
            </div>

            {/* Stock Output Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Output Progress</h3>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="bg-gray-200 rounded h-64"></div>
                </div>
              ) : (
                <AreaCharts data={stockOutputProgress} type="output" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
