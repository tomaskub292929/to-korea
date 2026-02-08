'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Daily signups data
const signupData = [
  { date: 'Jan 1', users: 45 },
  { date: 'Jan 8', users: 52 },
  { date: 'Jan 15', users: 48 },
  { date: 'Jan 22', users: 65 },
  { date: 'Jan 29', users: 78 },
  { date: 'Feb 5', users: 92 },
  { date: 'Feb 12', users: 85 },
];

// Popular schools data
const popularSchoolsData = [
  { name: 'Seoul National', applications: 156 },
  { name: 'Korea Univ.', applications: 142 },
  { name: 'Yonsei Univ.', applications: 138 },
  { name: 'KAIST', applications: 125 },
  { name: 'POSTECH', applications: 98 },
];

// Applications by region
const regionData = [
  { name: 'Germany', value: 35, color: '#FF8C00' },
  { name: 'Russia', value: 28, color: '#3B82F6' },
  { name: 'France', value: 18, color: '#10B981' },
  { name: 'Central Asia', value: 12, color: '#8B5CF6' },
  { name: 'Others', value: 7, color: '#6B7280' },
];

// Application status distribution
const statusData = [
  { name: 'Accepted', value: 28, color: '#10B981' },
  { name: 'Under Review', value: 45, color: '#F59E0B' },
  { name: 'Rejected', value: 12, color: '#EF4444' },
  { name: 'Pending', value: 15, color: '#6B7280' },
];

export function SignupChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Signups</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={signupData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#FF8C00"
              strokeWidth={2}
              dot={{ fill: '#FF8C00', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PopularSchoolsChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Schools</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={popularSchoolsData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="#9CA3AF"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="applications" fill="#FF8C00" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RegionDistributionChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Region</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={regionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {regionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
              formatter={(value) => [`${value}%`, 'Percentage']}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ApplicationStatusChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
              formatter={(value) => [`${value}%`, 'Percentage']}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
