import React, { useState } from 'react';
import { BarChart3, QrCode, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TeacherOverview from '../teacher/TeacherOverview';
import QRGenerator from '../teacher/QRGenerator';
import StudentManagement from '../teacher/StudentManagement';
import ClassPerformance from '../teacher/ClassPerformance';
import TeacherTimetable from '../teacher/TeacherTimetable';
import SettingsPanel from '../common/SettingsPanel';

type TabType = 'overview' | 'qr' | 'students' | 'performance' | 'timetable' | 'settings';

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'qr' as TabType, label: 'QR Generator', icon: QrCode },
    { id: 'students' as TabType, label: 'Students', icon: Users },
    { id: 'performance' as TabType, label: 'Performance', icon: BarChart3 },
    { id: 'timetable' as TabType, label: 'Timetable', icon: Calendar },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <TeacherOverview />;
      case 'qr':
        return <QRGenerator />;
      case 'students':
        return <StudentManagement />;
      case 'performance':
        return <ClassPerformance />;
      case 'timetable':
        return <TeacherTimetable />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <TeacherOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Roll Number: {user?.rollNumber}</p>
              <p className="text-sm text-gray-500">{user?.subject} • {user?.department}</p>
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
                            ? 'bg-green-600 text-white'
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

export default TeacherDashboard;