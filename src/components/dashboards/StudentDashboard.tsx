import React, { useState } from 'react';
import { BarChart3, QrCode, User, Calendar, Calculator, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AttendanceOverview from '../student/AttendanceOverview';
import QRScanner from '../student/QRScanner';
import StudentProfile from '../student/StudentProfile';
import Timetable from '../student/Timetable';
import DaysCalculator from '../student/DaysCalculator';
import SettingsPanel from '../common/SettingsPanel';

type TabType = 'overview' | 'scan' | 'profile' | 'timetable' | 'calculator' | 'settings';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'scan' as TabType, label: 'Scan QR', icon: QrCode },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'timetable' as TabType, label: 'Timetable', icon: Calendar },
    { id: 'calculator' as TabType, label: 'Days Calc', icon: Calculator },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AttendanceOverview />;
      case 'scan':
        return <QRScanner />;
      case 'profile':
        return <StudentProfile />;
      case 'timetable':
        return <Timetable />;
      case 'calculator':
        return <DaysCalculator />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <AttendanceOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Roll Number: {user?.rollNumber}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-sm p-6">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;