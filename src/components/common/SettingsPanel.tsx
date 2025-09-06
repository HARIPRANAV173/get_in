import React, { useState } from 'react';
import { Settings, LogOut, HelpCircle, User, Bell, Shield, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AIAssistant from './AIAssistant';

const SettingsPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const [showAI, setShowAI] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
  });

  if (showAI) {
    return <AIAssistant onBack={() => setShowAI(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Account Type</p>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Name</p>
              <p className="text-sm text-gray-600">{user?.name}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">{user?.email || 'N/A'}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <Bell className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive attendance updates via email</p>
            </div>
            <button
              onClick={() => setNotifications({...notifications, email: !notifications.email})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.email ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive alerts via SMS</p>
            </div>
            <button
              onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.sms ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.sms ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-600">Receive in-app notifications</p>
            </div>
            <button
              onClick={() => setNotifications({...notifications, push: !notifications.push})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.push ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.push ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Security</h3>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <div className="text-blue-600">→</div>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add extra security to your account</p>
            </div>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              Not Enabled
            </span>
          </button>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <HelpCircle className="h-6 w-6 text-orange-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Help & Support</h3>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowAI(true)}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">AI Assistant</p>
                <p className="text-sm text-gray-600">Get help with the application</p>
              </div>
            </div>
            <div className="text-blue-600">→</div>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <p className="font-medium text-gray-900">Contact Support</p>
              <p className="text-sm text-gray-600">Reach out to our support team</p>
            </div>
            <div className="text-blue-600">→</div>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <p className="font-medium text-gray-900">FAQ</p>
              <p className="text-sm text-gray-600">Frequently asked questions</p>
            </div>
            <div className="text-blue-600">→</div>
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-gray-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-center p-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <User className="h-5 w-5 mr-2" />
            Switch Account
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* App Information */}
      <div className="bg-gray-100 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">App Information</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Version</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated</span>
            <span>January 2024</span>
          </div>
          <div className="flex justify-between">
            <span>Developer</span>
            <span>College IT Department</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;