'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  GraduationCap,
  Globe,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';

// Mock application data
const applicationData = {
  id: 'A001',
  applicant: {
    name: 'Anna Mueller',
    email: 'anna.mueller@gmail.com',
    phone: '+49-xxx-xxxx',
    country: 'Germany',
    countryCode: 'DE',
  },
  application: {
    school: 'Seoul National University',
    program: 'Computer Science',
    degree: "Master's",
    semester: 'Fall 2026',
  },
  education: {
    degree: "Bachelor's in Computer Science",
    university: 'Technical University of Munich',
    gpa: '3.8 / 4.0',
    graduationYear: '2025',
  },
  languages: {
    topik: 'Level 4',
    ielts: '7.5',
    native: 'German',
  },
  documents: [
    { name: 'Transcript.pdf', size: '2.4 MB', uploaded: '2026-02-01' },
    { name: 'Recommendation_Letter_1.pdf', size: '1.2 MB', uploaded: '2026-02-01' },
    { name: 'Personal_Statement.pdf', size: '890 KB', uploaded: '2026-02-01' },
    { name: 'TOPIK_Certificate.pdf', size: '1.5 MB', uploaded: '2026-02-01' },
    { name: 'IELTS_Score.pdf', size: '1.1 MB', uploaded: '2026-02-01' },
  ],
  motivation: `I am passionate about AI research and Korea's leading position in technology innovation.
  Seoul National University's Computer Science program offers the perfect environment for my academic
  and professional growth. I am particularly interested in working with Professor Kim's research lab
  on natural language processing.`,
  timeline: [
    { date: '2026-02-05 10:30', action: 'Documents reviewed', by: 'Kim' },
    { date: '2026-02-03 15:45', action: 'Additional documents requested', by: 'Lee' },
    { date: '2026-02-01 09:15', action: 'Application submitted', by: 'System' },
  ],
  status: 'under_review',
  priority: 'high',
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params.id;

  return (
    <AdminLayout title={`Application #${id}`} subtitle="Application Details">
      {/* Back Button */}
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Applicant Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{applicationData.applicant.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{applicationData.applicant.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{applicationData.applicant.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">🇩🇪 {applicationData.applicant.country}</p>
              </div>
            </div>
          </div>

          {/* Application Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Application Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">School</p>
                <p className="font-medium">{applicationData.application.school}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">{applicationData.application.program}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Degree</p>
                <p className="font-medium">{applicationData.application.degree}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Semester</p>
                <p className="font-medium">{applicationData.application.semester}</p>
              </div>
            </div>
          </div>

          {/* Education Background */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education Background</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Previous Degree</p>
                <p className="font-medium">{applicationData.education.degree}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">University</p>
                <p className="font-medium">{applicationData.education.university}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GPA</p>
                <p className="font-medium">{applicationData.education.gpa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Graduation Year</p>
                <p className="font-medium">{applicationData.education.graduationYear}</p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language Proficiency
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">TOPIK</p>
                <p className="font-medium">{applicationData.languages.topik}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IELTS</p>
                <p className="font-medium">{applicationData.languages.ielts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Native Language</p>
                <p className="font-medium">{applicationData.languages.native}</p>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivation Statement</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {applicationData.motivation}
            </p>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Submitted Documents
            </h3>
            <div className="space-y-3">
              {applicationData.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.size} • {doc.uploaded}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Under Review
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600">High Priority</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button className="w-full flex items-center justify-center gap-2 h-10 bg-green-500 text-white rounded-lg hover:bg-green-600">
                <CheckCircle className="w-4 h-4" />
                Accept
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-10 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                <FileText className="w-4 h-4" />
                Request Documents
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-10 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Mail className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Review Timeline
            </h3>
            <div className="space-y-4">
              {applicationData.timeline.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 mt-2 bg-gray-300 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-900">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.date} • {item.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Internal Notes
            </h3>
            <textarea
              placeholder="Add a note..."
              className="w-full h-24 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-[var(--leica-orange)]"
            />
            <button className="mt-2 w-full h-9 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
              Add Note
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
