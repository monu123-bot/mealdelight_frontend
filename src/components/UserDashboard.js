import React, { useEffect, useState } from 'react'
import History from './dashboard/History'
import Dues from './dashboard/Dues'
import Wallet from './dashboard/Wallet'
import Plans from './dashboard/Plans'
import Referral from './dashboard/Referral'
import '../style/userdashboard.css'
import { host } from '../script/variables'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyToken } from '../script/tokenVerification'
import { MdRefresh } from "react-icons/md";

const UserDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('plans')
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // Configuration for dashboard tabs - easy to extend
    const dashboardTabs = [
        {
            key: 'history',
            label: 'History',
            component: <History />
        },
        {
            key: 'wallet',
            label: 'Wallet',
            component: <Wallet user={user} setUser={setUser} />
        },
        {
            key: 'plans',
            label: 'Plans',
            component: <Plans user={user} setUser={setUser} />
        },
        {
            key: 'referral',
            label: 'Referral',
            component: <Referral user={user} setUser={setUser} />
        },
        // Add more tabs here easily in the future
        // {
        //     key: 'settings',
        //     label: 'Settings',
        //     component: <Settings user={user} setUser={setUser} />
        // }
    ];

    const fetchUser = async () => {
        try {
            setRefreshing(true)
            // Retrieve the token from localStorage
            const token = localStorage.getItem('mealdelight');
            if (!token) {
                throw new Error("No authentication token found");
            }

            // Set up the request headers with the token
            const response = await fetch(`${host}/user/user_details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Handle response
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }

            // Parse the JSON response
            const userData = await response.json();
            console.log('User Details:', userData);

            setUser(userData)

        } catch (error) {
            console.error('Error fetching user details:', error.message);
        } finally {
            setRefreshing(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const token_resp = await verifyToken();
                console.log(token_resp);

                if (!token_resp.isVerified) {
                    navigate('/')
                } else {
                    fetchUser()
                }

            } catch (error) {
                console.error("Error in useEffect:", error);
                setLoading(false)
            }
        };
        checkLogin()
    }, [])

    // Function to get the active component
    const getActiveComponent = () => {
        const activeTabConfig = dashboardTabs.find(tab => tab.key === activeTab);
        return activeTabConfig ? activeTabConfig.component : null;
    }

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-container">
            {user && (
                <>
                    <div className="user-info-card">
                        <div className="greeting">
                            <h2>Hi {user.firstName}!</h2>
                        </div>
                        <div className="balance-section">
                            <p className="balance-label">Available Balance</p>
                            <div className="balance-amount">
                                <span className="currency">₹</span>
                                <span className="amount">{Number(user.walletbalance).toFixed(2)}</span>
                                <button
                                    className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
                                    onClick={fetchUser}
                                    disabled={refreshing}
                                    aria-label="Refresh balance"
                                >
                                    <MdRefresh />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="tabs-container">
                        <div className="tabs-wrapper">
                            {dashboardTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.key)}
                                    aria-pressed={activeTab === tab.key}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="tab-content">
                        {getActiveComponent()}
                    </div>
                </>
            )}
        </div>
    )
}

export default UserDashboard