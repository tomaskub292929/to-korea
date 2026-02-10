'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getSchoolById } from '@/lib/services/schoolService';
import { School } from '@/lib/types';
import {
  getOrCreateApplication,
  updateApplicationStep,
  submitApplication
} from '@/lib/services/applicationService';
import type {
  Application,
  PersonalInfoData,
  EducationData,
  ProgramData,
  Gender,
  EducationLevel,
  LanguageTest
} from '@/lib/types/application';
import {
  NATIONALITIES,
  EDUCATION_LEVELS,
  LANGUAGE_TESTS,
  SEMESTERS,
  GRADUATION_YEARS,
} from '@/lib/types/application';

const STEPS = [
  { id: 1, name: '기본 정보', nameEn: 'Personal Info' },
  { id: 2, name: '학력 정보', nameEn: 'Education' },
  { id: 3, name: '지원 정보', nameEn: 'Application' },
];

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const schoolId = params.schoolId as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState<Application | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    dateOfBirth: '',
    gender: 'male' as Gender,
  });

  const [educationInfo, setEducationInfo] = useState<EducationData>({
    educationLevel: 'bachelor' as EducationLevel,
    schoolNamePrevious: '',
    major: '',
    graduationYear: 2024,
    gpa: '',
    languageTest: 'none' as LanguageTest,
    languageScore: '',
  });

  const [programInfo, setProgramInfo] = useState<ProgramData>({
    intendedProgram: '',
    intendedSemester: '2026-fall',
    motivation: '',
  });

  // Fetch school info from Firestore
  useEffect(() => {
    async function fetchSchool() {
      try {
        const schoolData = await getSchoolById(schoolId);
        setSchool(schoolData);
      } catch (error) {
        console.error('Error fetching school:', error);
      }
    }
    fetchSchool();
  }, [schoolId]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/apply/${schoolId}`);
    }
  }, [user, authLoading, router, schoolId]);

  // Load or create application
  useEffect(() => {
    async function loadApplication() {
      if (!user || !school) return;

      try {
        const app = await getOrCreateApplication(user.id, schoolId, school.name);
        setApplication(app);
        setCurrentStep(app.currentStep || 1);

        // Restore form data if exists
        if (app.firstName) {
          setPersonalInfo({
            firstName: app.firstName,
            lastName: app.lastName,
            email: app.email,
            phone: app.phone,
            nationality: app.nationality,
            dateOfBirth: app.dateOfBirth,
            gender: app.gender,
          });
        } else if (user.email) {
          setPersonalInfo(prev => ({ ...prev, email: user.email || '' }));
        }

        if (app.educationLevel) {
          setEducationInfo({
            educationLevel: app.educationLevel,
            schoolNamePrevious: app.schoolNamePrevious,
            major: app.major,
            graduationYear: app.graduationYear,
            gpa: app.gpa,
            languageTest: app.languageTest,
            languageScore: app.languageScore,
          });
        }

        if (app.intendedProgram) {
          setProgramInfo({
            intendedProgram: app.intendedProgram,
            intendedSemester: app.intendedSemester,
            motivation: app.motivation,
          });
        }
      } catch (error) {
        console.error('Error loading application:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user && school) {
      loadApplication();
    }
  }, [user, school, schoolId]);

  // Save current step
  const saveStep = async () => {
    if (!application) return;

    setSaving(true);
    try {
      let data = {};
      if (currentStep === 1) {
        data = personalInfo;
      } else if (currentStep === 2) {
        data = educationInfo;
      } else if (currentStep === 3) {
        data = programInfo;
      }

      await updateApplicationStep(application.id, currentStep, data);
    } catch (error) {
      console.error('Error saving step:', error);
    } finally {
      setSaving(false);
    }
  };

  // Handle next step
  const handleNext = async () => {
    await saveStep();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit and go to payment
      if (application) {
        await submitApplication(application.id);
        router.push(`/apply/${schoolId}/payment?applicationId=${application.id}`);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--md-primary)]" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">학교를 찾을 수 없습니다</h1>
          <Link href="/schools" className="text-[var(--md-primary)]">
            학교 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/schools/${schoolId}`}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              {school.headerImageUrl && (
                <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                  <Image
                    src={school.headerImageUrl}
                    alt={school.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="font-semibold text-lg">{school.name}</h1>
                <p className="text-sm text-gray-500">입학 지원서</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-[var(--md-primary)] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className="font-medium text-sm">{step.name}</p>
                    <p className="text-xs text-gray-500">{step.nameEn}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 rounded ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6">기본 정보 / Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 (영문) / First Name *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성 (영문) / Last Name *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.lastName}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 / Email *
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호 / Phone *
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    placeholder="+82 10-1234-5678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    국적 / Nationality *
                  </label>
                  <select
                    value={personalInfo.nationality}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, nationality: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    required
                  >
                    <option value="">선택하세요 / Select</option>
                    {NATIONALITIES.map((nat) => (
                      <option key={nat.value} value={nat.value}>
                        {nat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    생년월일 / Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성별 / Gender *
                  </label>
                  <select
                    value={personalInfo.gender}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, gender: e.target.value as Gender })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    required
                  >
                    <option value="male">남성 / Male</option>
                    <option value="female">여성 / Female</option>
                    <option value="other">기타 / Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6">학력 정보 / Education</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최종학력 / Education Level *
                  </label>
                  <select
                    value={educationInfo.educationLevel}
                    onChange={(e) =>
                      setEducationInfo({
                        ...educationInfo,
                        educationLevel: e.target.value as EducationLevel,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    required
                  >
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학교명 / School Name *
                  </label>
                  <input
                    type="text"
                    value={educationInfo.schoolNamePrevious}
                    onChange={(e) =>
                      setEducationInfo({
                        ...educationInfo,
                        schoolNamePrevious: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    placeholder="University Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전공 / Major
                  </label>
                  <input
                    type="text"
                    value={educationInfo.major}
                    onChange={(e) =>
                      setEducationInfo({ ...educationInfo, major: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    placeholder="Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    졸업연도 / Graduation Year *
                  </label>
                  <select
                    value={educationInfo.graduationYear}
                    onChange={(e) =>
                      setEducationInfo({
                        ...educationInfo,
                        graduationYear: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    required
                  >
                    {GRADUATION_YEARS.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학점/GPA
                  </label>
                  <input
                    type="text"
                    value={educationInfo.gpa}
                    onChange={(e) =>
                      setEducationInfo({ ...educationInfo, gpa: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    placeholder="3.5 / 4.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    어학시험 / Language Test
                  </label>
                  <select
                    value={educationInfo.languageTest}
                    onChange={(e) =>
                      setEducationInfo({
                        ...educationInfo,
                        languageTest: e.target.value as LanguageTest,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                  >
                    {LANGUAGE_TESTS.map((test) => (
                      <option key={test.value} value={test.value}>
                        {test.label}
                      </option>
                    ))}
                  </select>
                </div>

                {educationInfo.languageTest && educationInfo.languageTest !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      점수 / Score
                    </label>
                    <input
                      type="text"
                      value={educationInfo.languageScore}
                      onChange={(e) =>
                        setEducationInfo({
                          ...educationInfo,
                          languageScore: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                      placeholder="TOPIK 4급 / IELTS 6.5"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Program Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6">지원 정보 / Application Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    지원 프로그램 / Program *
                  </label>
                  <select
                    value={programInfo.intendedProgram}
                    onChange={(e) =>
                      setProgramInfo({ ...programInfo, intendedProgram: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    required
                  >
                    <option value="">선택하세요 / Select</option>
                    {school.programs.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    입학 학기 / Semester *
                  </label>
                  <select
                    value={programInfo.intendedSemester}
                    onChange={(e) =>
                      setProgramInfo({ ...programInfo, intendedSemester: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                    required
                  >
                    {SEMESTERS.map((sem) => (
                      <option key={sem.value} value={sem.value}>
                        {sem.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지원 동기 / Motivation *
                  <span className="text-gray-500 font-normal ml-2">(최소 100자)</span>
                </label>
                <textarea
                  value={programInfo.motivation}
                  onChange={(e) =>
                    setProgramInfo({ ...programInfo, motivation: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent resize-none"
                  placeholder="왜 이 대학교와 프로그램에 지원하시나요? / Why do you want to apply to this university and program?"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {programInfo.motivation.length} / 100자
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              이전
            </button>

            <button
              onClick={handleNext}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-[var(--md-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : currentStep === 3 ? (
                <>
                  결제하기
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  다음
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
