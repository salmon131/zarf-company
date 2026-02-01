"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StudyApplication, RentalInquiry, ArtistApplication } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<StudyApplication[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [rentalInquiries, setRentalInquiries] = useState<RentalInquiry[]>([]);
  const [isLoadingRentalInquiries, setIsLoadingRentalInquiries] = useState(false);
  const [artistApplications, setArtistApplications] = useState<ArtistApplication[]>([]);
  const [isLoadingArtistApplications, setIsLoadingArtistApplications] = useState(false);
  const [activeTab, setActiveTab] = useState<"studies" | "rentals" | "artists">("studies");

  // 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/applications");
      if (response.ok) {
        setIsAuthenticated(true);
        loadApplications();
        loadRentalInquiries();
        loadArtistApplications();
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword("");
        loadApplications();
        loadRentalInquiries();
        loadArtistApplications();
      } else {
        setError(data.error || "비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      setError("로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", {
        method: "DELETE",
      });
      setIsAuthenticated(false);
      setApplications([]);
      setRentalInquiries([]);
      setArtistApplications([]);
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  const loadRentalInquiries = async () => {
    setIsLoadingRentalInquiries(true);
    try {
      const response = await fetch("/api/admin/rental-inquiries");
      const data = await response.json();

      if (response.ok) {
        setRentalInquiries(data.inquiries || []);
      } else {
        if (response.status === 401) {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("대관 문의 조회 오류:", error);
    } finally {
      setIsLoadingRentalInquiries(false);
    }
  };

  const loadArtistApplications = async () => {
    setIsLoadingArtistApplications(true);
    try {
      const response = await fetch("/api/admin/artist-applications");
      const data = await response.json();

      if (response.ok) {
        setArtistApplications(data.applications || []);
      } else {
        if (response.status === 401) {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("그림작가 모집 조회 오류:", error);
    } finally {
      setIsLoadingArtistApplications(false);
    }
  };

  const handleDeleteRentalInquiry = async (id: string) => {
    if (!confirm("정말 이 문의를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/rental-inquiries?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadRentalInquiries();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteArtistApplication = async (id: string) => {
    if (!confirm("정말 이 신청을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/artist-applications?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadArtistApplications();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const loadApplications = async () => {
    setIsLoadingApplications(true);
    try {
      const response = await fetch("/api/admin/applications");
      const data = await response.json();

      if (response.ok) {
        setApplications(data.applications || []);
      } else {
        if (response.status === 401) {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("신청 정보 조회 오류:", error);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 신청을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/applications?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadApplications();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin 로그인</h1>
            <p className="text-gray-600">관리자 비밀번호를 입력해주세요</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 페이지</h1>
            <p className="text-gray-600">스터디 신청을 관리할 수 있습니다</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("studies")}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "studies"
                ? "text-brand-600 border-b-2 border-brand-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            스터디 신청 ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab("rentals")}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "rentals"
                ? "text-brand-600 border-b-2 border-brand-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            대관 문의 ({rentalInquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("artists")}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "artists"
                ? "text-brand-600 border-b-2 border-brand-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            그림작가 모집 ({artistApplications.length})
          </button>
        </div>

        {/* 스터디 신청 탭 */}
        {activeTab === "studies" && (
          <>
            {isLoadingApplications ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">신청 정보를 불러오는 중...</p>
              </Card>
            ) : applications.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">신청된 정보가 없습니다.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-lg text-sm font-semibold">
                            {app.study_type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(app.created_at)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">전화번호</p>
                            <p className="text-gray-900">{app.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">희망 시간</p>
                            <p className="text-gray-900">{app.preferred_time}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">나이대</p>
                            <p className="text-gray-900">{app.age_range}</p>
                          </div>
                          {app.desired_content && (
                            <div className="md:col-span-2">
                              <p className="text-sm font-semibold text-gray-600 mb-1">원하는 수업 내용</p>
                              <p className="text-gray-900">{app.desired_content}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* 대관 문의 탭 */}
        {activeTab === "rentals" && (
          <>
            {isLoadingRentalInquiries ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">문의 정보를 불러오는 중...</p>
              </Card>
            ) : rentalInquiries.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">문의된 정보가 없습니다.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {rentalInquiries.map((inquiry) => (
                  <Card key={inquiry.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
                            {inquiry.purpose}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(inquiry.created_at)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">이름</p>
                            <p className="text-gray-900">{inquiry.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">이메일</p>
                            <p className="text-gray-900">{inquiry.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">연락처</p>
                            <p className="text-gray-900">{inquiry.phone}</p>
                          </div>
                          {inquiry.date && (
                            <div>
                              <p className="text-sm font-semibold text-gray-600 mb-1">희망 날짜</p>
                              <p className="text-gray-900">{inquiry.date}</p>
                            </div>
                          )}
                          {inquiry.time && (
                            <div>
                              <p className="text-sm font-semibold text-gray-600 mb-1">희망 시간</p>
                              <p className="text-gray-900">{inquiry.time}</p>
                            </div>
                          )}
                          {inquiry.message && (
                            <div className="md:col-span-2">
                              <p className="text-sm font-semibold text-gray-600 mb-1">문의 내용</p>
                              <p className="text-gray-900">{inquiry.message}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteRentalInquiry(inquiry.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* 그림작가 모집 탭 */}
        {activeTab === "artists" && (
          <>
            {isLoadingArtistApplications ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">신청 정보를 불러오는 중...</p>
              </Card>
            ) : artistApplications.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">신청된 정보가 없습니다.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {artistApplications.map((app) => (
                  <Card key={app.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-lg text-sm font-semibold">
                            그림작가 지원
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(app.created_at)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">이름</p>
                            <p className="text-gray-900">{app.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">이메일</p>
                            <p className="text-gray-900">{app.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">연락처</p>
                            <p className="text-gray-900">{app.phone}</p>
                          </div>
                          {app.portfolio && (
                            <div>
                              <p className="text-sm font-semibold text-gray-600 mb-1">포트폴리오</p>
                              <a 
                                href={app.portfolio} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                              >
                                {app.portfolio}
                              </a>
                            </div>
                          )}
                          {app.message && (
                            <div className="md:col-span-2">
                              <p className="text-sm font-semibold text-gray-600 mb-1">메시지</p>
                              <p className="text-gray-900">{app.message}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteArtistApplication(app.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

