import React, { useState } from 'react';
import { Calendar, Users, Clock, ChefHat, Pause, Play, AlertCircle, CheckCircle } from 'lucide-react';
import { host } from '../../script/variables';
import Cookies from 'js-cookie';
import './style/dailyMealReport.css';

const DailyMealReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch today's report on component mount
  React.useEffect(() => {
    fetchMealReport();
  }, []); // Empty dependency array means this runs once on mount

  const fetchMealReport = async () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Get token from localStorage (adjust based on your auth implementation)
      const token = Cookies.get('adminToken');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${host}/admin/getSpecificDateReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer JWT ${token}`, // Adjust format based on your backend
        },
        body: JSON.stringify({
          date: selectedDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch meal report');
      }

      if (data.success) {
        setReport(data.report);
      } else {
        setError(data.message || 'Failed to fetch meal report');
      }
    } catch (err) {
      setError(err.message || 'Error fetching meal report');
      console.error('Error fetching meal report:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const MealSection = ({ title, data, icon: Icon, mealType }) => {
    const totalMeals = Object.values(data.mealQuantities || {}).reduce((sum, qty) => sum + qty, 0);
    
    return (
      <div className={`meal-section-card ${mealType}`}>
        <div className="meal-section-header">
          <div className="meal-section-title">
            <Icon className="meal-icon" />
            <h3>{title}</h3>
          </div>
          <div className="meal-section-orders">
            <p className="orders-count">{data.totalOrders}</p>
            <p className="orders-label">Orders</p>
          </div>
        </div>
        
        {Object.keys(data.mealQuantities || {}).length > 0 ? (
          <div>
            <p className="meal-total-info">
              Total meals to prepare: <span className="total-count">{totalMeals}</span>
            </p>
            <div className="meals-list">
              {Object.entries(data.mealQuantities).map(([mealName, quantity]) => (
                <div key={mealName} className="meal-item">
                  <span className="meal-item-name">{mealName}</span>
                  <span className="meal-item-quantity">
                    {quantity} portions
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-meals-message">No meals to prepare</p>
        )}
      </div>
    );
  };

  return (
    <div className="meal-report-container">
      <div className="meal-report-header">
        <h1>Daily Meal Preparation Report</h1>
        <p>View active orders, meal quantities, and paused subscriptions</p>
      </div>

      {/* Date Selection */}
      <div className="date-selection-card">
        <div className="date-selection-form">
          <div className="date-input-group">
            <label htmlFor="date" className="date-label">
              Select Date
            </label>
            <div className="date-input-wrapper">
              <Calendar className="date-input-icon" />
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
          <button
            onClick={fetchMealReport}
            disabled={loading}
            className="report-button"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Loading...
              </>
            ) : (
              <>
                <ChefHat />
                Get Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-alert">
          <AlertCircle />
          <p>{error}</p>
        </div>
      )}

      {/* Report Display */}
      {report && (
        <div>
          {/* Summary Cards */}
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-card-content">
                <div className="summary-card-info">
                  <h3>Report Date</h3>
                  <p className="date-text">{formatDate(report.date)}</p>
                </div>
                <Calendar className="summary-card-icon icon-blue" />
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-card-content">
                <div className="summary-card-info">
                  <h3>Active Orders</h3>
                  <p className="active-orders">{report.summary.totalActiveOrders}</p>
                </div>
                <CheckCircle className="summary-card-icon icon-green" />
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-card-content">
                <div className="summary-card-info">
                  <h3>Paused Users</h3>
                  <p className="paused-users">{report.summary.totalPausedUsers}</p>
                </div>
                <Pause className="summary-card-icon icon-orange" />
              </div>
            </div>
          </div>

          {/* Meal Sections */}
          <div className="meals-grid">
            <MealSection
              title="Breakfast"
              data={report.breakfast}
              icon={Clock}
              mealType="breakfast"
            />
            <MealSection
              title="Lunch"
              data={report.lunch}
              icon={ChefHat}
              mealType="lunch"
            />
            <MealSection
              title="Dinner"
              data={report.dinner}
              icon={Users}
              mealType="dinner"
            />
          </div>

          {/* Quick Stats */}
          <div className="statistics-card">
            <h3>Quick Statistics</h3>
            <div className="statistics-grid">
              <div className="statistic-item">
                <p className="statistic-value blue">
                  {report.breakfast.totalOrders + report.lunch.totalOrders + report.dinner.totalOrders}
                </p>
                <p className="statistic-label">Total Meal Orders</p>
              </div>
              <div className="statistic-item">
                <p className="statistic-value green">
                  {Object.values(report.breakfast.mealQuantities || {}).reduce((sum, qty) => sum + qty, 0) +
                   Object.values(report.lunch.mealQuantities || {}).reduce((sum, qty) => sum + qty, 0) +
                   Object.values(report.dinner.mealQuantities || {}).reduce((sum, qty) => sum + qty, 0)}
                </p>
                <p className="statistic-label">Total Portions</p>
              </div>
              <div className="statistic-item">
                <p className="statistic-value purple">
                  {new Set([
                    ...Object.keys(report.breakfast.mealQuantities || {}),
                    ...Object.keys(report.lunch.mealQuantities || {}),
                    ...Object.keys(report.dinner.mealQuantities || {})
                  ]).size}
                </p>
                <p className="statistic-label">Unique Meals</p>
              </div>
              <div className="statistic-item">
                <p className="statistic-value orange">
                  {Math.round((report.summary.totalActiveOrders / (report.summary.totalActiveOrders + report.summary.totalPausedUsers)) * 100) || 0}%
                </p>
                <p className="statistic-label">Active Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!report && !loading && !error && (
        <div className="empty-state">
          <ChefHat className="empty-state-icon" />
          <h3>No Report Generated</h3>
          <p>Select a date and click "Get Report" to view meal preparation details</p>
        </div>
      )}
    </div>
  );
};

export default DailyMealReport;