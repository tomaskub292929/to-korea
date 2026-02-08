'use client';

import { useState } from 'react';
import {
  Settings,
  Mail,
  Bell,
  Shield,
  Users,
  Globe,
  Save,
  Key,
  Smartphone,
  Clock,
  Lock,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';

const admins = [
  { id: 1, name: 'Kim Admin', email: 'kim@gateway.com', role: 'Super Admin', twoFA: true, lastLogin: '2 hours ago' },
  { id: 2, name: 'Lee Manager', email: 'lee@gateway.com', role: 'School Manager', twoFA: true, lastLogin: '1 day ago' },
  { id: 3, name: 'Park Content', email: 'park@gateway.com', role: 'Content Manager', twoFA: false, lastLogin: '3 hours ago' },
];

const roles = ['Super Admin', 'School Manager', 'Content Manager', 'Application Manager', 'Analyst'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'admins', label: 'Admins', icon: Users },
  ];

  return (
    <AdminLayout title="Settings" subtitle="System configuration">
      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[var(--leica-orange)] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">General Settings</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Gateway to Korea"
                    className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Language
                  </label>
                  <select className="w-full h-10 px-4 border border-gray-200 rounded-lg">
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[var(--leica-orange)] rounded-lg flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">G</span>
                    </div>
                    <button className="h-10 px-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      Change Logo
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Mode
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="maintenance" defaultChecked />
                      <span>Off</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="maintenance" />
                      <span>On</span>
                    </label>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 h-10 px-6 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00]">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Email Settings</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Gateway to Korea"
                    className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    defaultValue="noreply@gatewaytokorea.com"
                    className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    placeholder="smtp.example.com"
                    className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    placeholder="587"
                    className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex items-center gap-2 h-10 px-6 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00]">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button className="h-10 px-6 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Send Test Email
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Notification Settings</h3>

              <div className="space-y-4">
                {[
                  { label: 'New Application', desc: 'When a new application is submitted' },
                  { label: 'Review Pending', desc: 'When reviews need moderation' },
                  { label: 'User Report', desc: 'When content is reported' },
                  { label: 'Daily Summary', desc: 'Daily activity report' },
                  { label: 'Weekly Report', desc: 'Weekly analytics report' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">Dashboard</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 h-10 px-6 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00]">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Security Settings</h3>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="2fa" />
                      <span>All Admins</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="2fa" defaultChecked />
                      <span>Super Admin Only</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="2fa" />
                      <span>Optional</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                    </div>
                  </div>
                  <select className="h-10 px-4 border border-gray-200 rounded-lg">
                    <option value="15">15 minutes</option>
                    <option value="30" selected>30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Login Attempts</p>
                      <p className="text-sm text-gray-500">Lock account after failed attempts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <select className="h-10 px-4 border border-gray-200 rounded-lg">
                      <option value="3">3 attempts</option>
                      <option value="5" selected>5 attempts</option>
                      <option value="10">10 attempts</option>
                    </select>
                    <span className="text-gray-500">then lock for</span>
                    <select className="h-10 px-4 border border-gray-200 rounded-lg">
                      <option value="5">5 minutes</option>
                      <option value="15" selected>15 minutes</option>
                      <option value="30">30 minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 h-10 px-6 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00]">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {/* Admins Management */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Admin Accounts</h3>
                <button className="h-10 px-4 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00]">
                  Add Admin
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Name</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Email</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Role</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">2FA</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Last Login</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {admins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-4 py-3 font-medium">{admin.name}</td>
                        <td className="px-4 py-3 text-gray-600">{admin.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {admin.twoFA ? (
                            <span className="text-green-600">✓ Enabled</span>
                          ) : (
                            <span className="text-gray-400">Disabled</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{admin.lastLogin}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-sm text-blue-600 hover:underline">Edit</button>
                            <button className="text-sm text-red-600 hover:underline">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
