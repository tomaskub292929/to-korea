'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  subscribeToApplications
} from '@/lib/services/applicationService';
import type { Application } from '@/lib/types/application';
import Link from 'next/link';

export default function TestRealtimePage() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [testAppId, setTestAppId] = useState<string | null>(null);
  const [status, setStatus] = useState('Ready');
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Subscribe to applications in real-time
  useEffect(() => {
    const unsubscribe = subscribeToApplications((data) => {
      setApplications(data);
    });
    return () => unsubscribe();
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runTest = async () => {
    if (!user) {
      alert('Please log in first to run the test');
      return;
    }

    setIsRunning(true);
    setStep(0);

    try {
      // Step 1: Create
      setStep(1);
      setStatus('Creating test application...');
      const newId = await createApplication(
        user.id,
        'test-school-' + Date.now(),
        '[TEST] Real-time Sync Test School'
      );
      setTestAppId(newId);
      await sleep(2000);

      // Step 2: Update to under_review
      setStep(2);
      setStatus('Updating status to "Under Review"...');
      await updateApplicationStatus(newId, 'under_review');
      await sleep(2000);

      // Step 3: Update to accepted
      setStep(3);
      setStatus('Updating status to "Accepted"...');
      await updateApplicationStatus(newId, 'accepted');
      await sleep(2000);

      // Step 4: Delete
      setStep(4);
      setStatus('Deleting test application...');
      await deleteApplication(newId);
      setTestAppId(null);
      await sleep(1000);

      setStep(5);
      setStatus('Test completed successfully!');
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Real-time Sync Test</h1>
        <p className="text-gray-600 mb-8">
          This page tests real-time synchronization between Firestore and the admin panel.
        </p>

        {/* Auth Status */}
        <div className={`p-4 rounded-lg mb-6 ${user ? 'bg-green-100' : 'bg-yellow-100'}`}>
          {user ? (
            <p className="text-green-800">Logged in as: {user.email}</p>
          ) : (
            <div>
              <p className="text-yellow-800 mb-2">Please log in to run the test</p>
              <Link href="/login" className="text-blue-600 hover:underline">
                Go to Login →
              </Link>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-blue-900 mb-3">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Open <code className="bg-blue-100 px-2 py-0.5 rounded">/admin/applications</code> in another tab</li>
            <li>Click "Run Test" button below</li>
            <li>Watch the admin page - changes should appear WITHOUT refreshing!</li>
          </ol>
          <div className="mt-4">
            <Link
              href="/admin/applications"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Open Admin Page →
            </Link>
          </div>
        </div>

        {/* Test Progress */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="font-semibold mb-4">Test Progress</h2>

          <div className="space-y-3 mb-6">
            {[
              { num: 1, text: 'Create test application', desc: 'New row appears in admin' },
              { num: 2, text: 'Update to "Under Review"', desc: 'Status badge turns amber' },
              { num: 3, text: 'Update to "Accepted"', desc: 'Status badge turns green' },
              { num: 4, text: 'Delete application', desc: 'Row disappears from admin' },
              { num: 5, text: 'Complete!', desc: 'All tests passed' },
            ].map((item) => (
              <div
                key={item.num}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  step === item.num ? 'bg-blue-100 border-2 border-blue-500' :
                  step > item.num ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step === item.num ? 'bg-blue-500 text-white animate-pulse' :
                  step > item.num ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step > item.num ? '✓' : item.num}
                </div>
                <div>
                  <p className="font-medium">{item.text}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={runTest}
              disabled={isRunning || !user}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running...' : 'Run Test'}
            </button>
            <span className="text-gray-600">{status}</span>
          </div>
        </div>

        {/* Live Applications List */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="font-semibold">Live Applications ({applications.length})</h2>
          </div>

          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No applications yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {applications.slice(0, 10).map((app) => (
                <div
                  key={app.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    app.id === testAppId ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-medium">{app.schoolName}</p>
                    <p className="text-sm text-gray-500">{app.id.slice(0, 8)}...</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    app.status === 'under_review' ? 'bg-amber-100 text-amber-700' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
