import './UserRegistration.css';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://krutsha.ireavaschool.in' : '';

const GET_MOBILE_SCREEN_URL = `${BASE_URL}/get-enter-mobile-screen`;
const SIGNUP_URL = `${BASE_URL}/api/supervisor/signup`;
const SEND_OTP_URL = `${BASE_URL}/api/supervisor/send_otp`;
const VERIFY_OTP_URL = `${BASE_URL}/api/supervisor/verify_otp`;
const PATCH_NAME_URL = `${BASE_URL}/api/supervisor/patch_supervisor_name`;
const GET_DETAILS_URL = `${BASE_URL}/api/supervisor/get_supervisor_details`;
const PENDING_REQUESTS_URL = `${BASE_URL}/api/supervisor/view_pending_requests`;
const UPDATE_REQUEST_URL = `${BASE_URL}/api/supervisor/update_link_request`;
const GET_USER_DETAILS_URL = `${BASE_URL}/api/supervisor/get_user_details`;
const GET_USER_LEARNING_DATA_URL = `${BASE_URL}/api/supervisor/get_user_learning_data`;
const GET_CLASSES_SUBJECTS_URL = `${BASE_URL}/api/supervisor/get_classes_subjects`;
const GET_CHAPTER_LEARNING_PROGRESS_URL = `${BASE_URL}/api/supervisor/get_chapter_learning_progress`;
const GET_CHAPTER_QUIZ_PROGRESS_URL = `${BASE_URL}/webservice/get_chapter_progress`;
const GET_EXAM_RESULT_URL = `${BASE_URL}/user_exam_result`;
const GET_EXAM_ANALYSIS_URL = `${BASE_URL}/user-exam-analyser`;
const GET_TODAY_OVERVIEW_URL = `${BASE_URL}/api/supervisor/today_overview`;
const DELETE_LINK_REQUEST_URL = `${BASE_URL}/api/supervisor/delete_link_request`;

const API_HEADERS = {
  'Client-Service': 'education',
  'Auth-Key': 'krutsha@@',
  'Content-Type': 'application/json'
};

const SupervisorAuth = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [uiData, setUiData] = useState(null);

  const [selectedCode, setSelectedCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // OTP State
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [serverOtp, setServerOtp] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [allowOtp, setAllowOtp] = useState(1);
  const [resendCount, setResendCount] = useState(3);
  const [reAllowTimer, setReAllowTimer] = useState(0);
  const [otpError, setOtpError] = useState("");

  // Name Entry State
  const [supervisorName, setSupervisorName] = useState("");

  // Dashboard State
  const [pendingRequests, setPendingRequests] = useState([]);
  const [linkedUsers, setLinkedUsers] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Selected User Inner State
  const [userInnerTab, setUserInnerTab] = useState("overview"); // "overview" | "today_overview" | "learning" | "subject_progress" | "quiz"

  // Today's Overview State
  const [todayOverviewData, setTodayOverviewData] = useState(null);
  const [loadingTodayOverview, setLoadingTodayOverview] = useState(false);

  // Learning Progress State
  const [learningData, setLearningData] = useState([]);
  const [learningOffset, setLearningOffset] = useState(0);
  const [hasMoreLearning, setHasMoreLearning] = useState(true);
  const [loadingLearning, setLoadingLearning] = useState(false);
  const [dateFilter, setDateFilter] = useState("this week");

  // Subject Wise Progress State
  const [subjectProgressData, setSubjectProgressData] = useState([]);
  const [loadingSubjectProgress, setLoadingSubjectProgress] = useState(false);
  const [expandedClassId, setExpandedClassId] = useState(null);

  // Chapter Learning Progress State
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [chapterProgressData, setChapterProgressData] = useState([]);
  const [loadingChapterProgress, setLoadingChapterProgress] = useState(false);

  // Chapter Quiz Progress State
  const [quizData, setQuizData] = useState([]);
  const [quizOffset, setQuizOffset] = useState(0);
  const [hasMoreQuiz, setHasMoreQuiz] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Exam Result Modal State
  const [selectedExamResult, setSelectedExamResult] = useState(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [loadingExamResult, setLoadingExamResult] = useState(false);

  // AI Analysis Modal State
  const [selectedAnalysisResult, setSelectedAnalysisResult] = useState(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Search States
  const [learningSearchQuery, setLearningSearchQuery] = useState("");
  const [quizSearchQuery, setQuizSearchQuery] = useState("");

  const getDateRange = (filter) => {
    const today = new Date();
    let fromDate = new Date();
    let toDate = new Date();

    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    switch (filter) {
      case "today":
        break; // fromDate and toDate are today
      case "this week":
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday as start of week
        fromDate = new Date(today.setDate(diff));
        toDate = new Date(); // up to today
        break;
      case "last week":
        const lwDayOfWeek = today.getDay();
        const lwStart = today.getDate() - lwDayOfWeek - 6;
        fromDate = new Date(today.setDate(lwStart));
        toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 6);
        break;
      case "this month":
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = new Date(); // up to today
        break;
      case "last month":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        toDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "overall":
        fromDate = new Date("2025-01-01");
        toDate = new Date(); // up to today
        break;
      default:
        break;
    }

    return { from: formatDate(fromDate), to: formatDate(toDate) };
  };

  useEffect(() => {
    async function fetchData() {
      const loadFallbackData = () => {
        setCountryCodes([
          { "code": "91", "is_whatsapp": "1", "is_sms": "1" },
          { "code": "971", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "973", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "972", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "974", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "975", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "976", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "978", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "979", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "950", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "975", "is_whatsapp": "1", "is_sms": "0" },
          { "code": "976", "is_whatsapp": "1", "is_sms": "0" }
        ]);
        setUiData({
          header_title: "Enter Phone Number",
          header_description: "A verification code will be sent to this number.",
          input_title: "000-000-0000",
          next_button: "Get OTP",
          footer_description: "By proceeding, you agree to Krutsha <a href=\"https://krutsha.app/terms-and-conditions\">Terms & Conditions</a>  and  <a href=\"https://krutsha.app/privacy-policy\">Privacy Policy.</a>"
        });
        setSelectedCode("91");
      };

      try {
        const { data } = await axios.get(GET_MOBILE_SCREEN_URL, { headers: API_HEADERS });

        if (data && data.status === 200) {
          setCountryCodes(data.country_code || []);
          setUiData(data.data || {});
          if (data.country_code && data.country_code.length > 0) {
            setSelectedCode(data.country_code[0].code);
          }
        } else {
          console.warn("Invalid data from mobile screen API, using fallback");
          loadFallbackData();
        }
      } catch (error) {
        console.error("API error (using fallback):", error?.message);
        loadFallbackData();
      }

      // Session restore logic
      const storedToken = localStorage.getItem("supervisor_access_token");
      const storedNumber = localStorage.getItem("supervisor_number");

      if (storedToken && storedNumber) {
        setPhoneNumber(storedNumber);
        try {
          const detailsRes = await axios.get(`${GET_DETAILS_URL}?supervisor_number=${storedNumber}`, {
            headers: {
              ...API_HEADERS,
              'Supervisor-Number': storedNumber,
              'New-Key': storedToken
            }
          });

          if (detailsRes.data && detailsRes.data.status === 200) {
            if (detailsRes.data.supervisor_name) {
              setSupervisorName(detailsRes.data.supervisor_name);
              setStep(4);
            } else {
              setStep(3);
            }
          } else {
            // Token likely invalid / rejected
            localStorage.removeItem("supervisor_access_token");
            localStorage.removeItem("supervisor_number");
            setStep(1); // Force re-login
          }
        } catch (detailsError) {
          console.error("Failed to restore session", detailsError);
          // If network error, maybe keep token, but if 401/403, clear it
          if (detailsError?.response && (detailsError.response.status === 401 || detailsError.response.status === 403 || detailsError.response.status === 400)) {
            localStorage.removeItem("supervisor_access_token");
            localStorage.removeItem("supervisor_number");
          }
          setStep(1); // Force re-login
        }
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (step === 2) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(interval);
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleGetOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phoneNumber) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    setSubmitting(true);
    setErrorMessage("");
    setOtpError("");

    try {
      const selectedCountryObj = countryCodes.find(c => c.code === selectedCode);
      const isWhatsapp = selectedCountryObj?.is_whatsapp === "1" ? "1" : "0";
      const isSms = selectedCountryObj?.is_sms === "1" ? "1" : "0";

      const payload = {
        phone_number: phoneNumber,
        country_code: `+${selectedCode}`,
        is_whatsapp: isWhatsapp,
        is_sms: isSms
      };

      // 1. Signup API
      await axios.post(SIGNUP_URL, payload, { headers: API_HEADERS });

      // 2. Send OTP API
      const { data } = await axios.post(SEND_OTP_URL, payload, { headers: API_HEADERS });

      if (data && data.status === 200) {
        if (data.retry_after) {
          // Handle retry logic
          setErrorMessage(data.message || `Please retry after ${data.retry_after} seconds.`);
          setResendTimer(data.retry_after);
          setStep(2);
        } else {
          setServerOtp(data.otp);
          setResendCount(data.resend_count_remaining);
          setAllowOtp(data.allow_otp);
          setResendTimer(data.resend_timer);
          setReAllowTimer(data.re_allow_otp_timer);
          setStep(2);
        }
      } else {
        setErrorMessage(data?.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error fetching OTP (using fallback):", error);

      // Fallback for local development if CORS / Network Error occurs
      if (error?.message === "Network Error" && process.env.NODE_ENV !== 'production') {
        setServerOtp(1134);
        setResendCount(3);
        setAllowOtp(1);
        setResendTimer(30);
        setReAllowTimer(120);
        setStep(2);
        setErrorMessage(""); // Clear error to proceed to OTP screen
      } else {
        setErrorMessage(error?.response?.data?.message || error?.message || "An error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!otpInput) {
      setOtpError("Please enter OTP.");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await axios.post(VERIFY_OTP_URL, {
        phone_number: phoneNumber,
        country_code: `+${selectedCode}`,
        otp: otpInput
      }, { headers: API_HEADERS });

      // Some APIs return 200 HTTP status but 400 in the body
      if (data && data.status === 200) {
        // Storing token securely in localStorage, not showing it to the user
        if (data.access_token) {
          localStorage.setItem("supervisor_access_token", data.access_token);
          localStorage.setItem("supervisor_number", phoneNumber);
        }

        // Fetch supervisor details to check if name exists
        try {
          const detailsRes = await axios.get(`${GET_DETAILS_URL}?supervisor_number=${phoneNumber}`, {
            headers: {
              ...API_HEADERS,
              'Supervisor-Number': phoneNumber,
              'New-Key': data.access_token
            }
          });
          if (detailsRes.data && detailsRes.data.status === 200 && detailsRes.data.supervisor_name) {
            setSupervisorName(detailsRes.data.supervisor_name);
            setStep(4); // Go to Dashboard
          } else {
            setStep(3); // Name is empty, go to Name Entry
          }
        } catch (detailsError) {
          console.error("Error fetching details:", detailsError);
          setStep(3); // Default to Name Entry on error
        }
      } else {
        setOtpError(data?.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP (using fallback):", error);

      if (error?.message === "Network Error" && process.env.NODE_ENV !== 'production') {
        // Fallback logic for local CORS issues
        if (String(otpInput) === "1134") {
          setStep(3);
        } else {
          setOtpError("Invalid OTP. (Fallback expected 1134)");
        }
      } else {
        // If the server returned an actual 400 error response or blocked by CORS in production
        setOtpError(error?.response?.data?.message || error?.message || "Invalid OTP. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!supervisorName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("supervisor_access_token");
      const num = localStorage.getItem("supervisor_number") || phoneNumber;
      await axios.patch(PATCH_NAME_URL, {
        name: supervisorName.trim()
      }, {
        headers: {
          ...API_HEADERS,
          'Supervisor-Number': num,
          'New-Key': token
        }
      });

      setStep(4); // Proceed to Dashboard
    } catch (error) {
      console.error("Error patching name:", error);
      setErrorMessage(error?.response?.data?.message || error?.message || "Failed to update name.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === 4) {
      fetchDashboardData();
    }
  }, [step]);

  const fetchDashboardData = async () => {
    setLoadingRequests(true);
    try {
      const token = localStorage.getItem("supervisor_access_token");
      const num = localStorage.getItem("supervisor_number") || phoneNumber;
      const headers = { ...API_HEADERS, 'Supervisor-Number': num, 'New-Key': token };

      const [pendingRes, linkedRes] = await Promise.all([
        axios.get(PENDING_REQUESTS_URL, { headers }).catch(e => e),
        axios.get(GET_USER_DETAILS_URL, { headers }).catch(e => e)
      ]);

      let currentPending = [];
      if (pendingRes?.data?.status === 200 && pendingRes.data.pending_requests) {
        currentPending = pendingRes.data.pending_requests;
        setPendingRequests(currentPending);
      } else {
        setPendingRequests([]);
      }

      if (linkedRes?.data?.status === 200 && linkedRes.data.data) {
        const filteredLinked = linkedRes.data.data.filter(user => user.link_status === 'accepted');
        setLinkedUsers(filteredLinked);
      } else {
        setLinkedUsers([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleUpdateRequest = async (req, status) => {
    try {
      const num = localStorage.getItem("supervisor_number") || phoneNumber;
      const token = localStorage.getItem("supervisor_access_token");
      const res = await axios.post(UPDATE_REQUEST_URL, {
        user_id: req.user_id,
        supervisor_number: num,
        status: status
      }, {
        headers: {
          ...API_HEADERS,
          'New-Key': token // Passing just in case it requires auth like the other endpoints
        }
      });

      if (res.data && res.data.status === 200) {
        await fetchDashboardData(); // Re-fetch to update lists
      } else {
        alert(res.data?.message || "Failed to update request.");
      }
    } catch (error) {
      console.error("Error updating request:", error);

      // Local development fallback
      if (error?.message === "Network Error" && process.env.NODE_ENV !== 'production') {
        if (status === 1) {
          // Mock local state update
          setPendingRequests(pendingRequests.filter(p => p.link_id !== req.link_id));
          setLinkedUsers([...linkedUsers, { ...req, name: req.user_name, user_id: req.user_id, current_class: "N/A", subject: "N/A", chapter: "N/A", user_status: "1", plan: "demo", plan_remaining_days: 0 }]);
        } else {
          setPendingRequests(pendingRequests.filter(p => p.link_id !== req.link_id));
        }
      } else {
        alert(error?.response?.data?.message || error?.message || "An error occurred.");
      }
    }
  };

  const handleAcceptRequest = (req) => {
    handleUpdateRequest(req, 1);
  };

  const handleRejectRequest = (req) => {
    handleUpdateRequest(req, 0);
  };

  const fetchLearningProgress = async (reset = false, userToFetch = selectedUser, filterToUse = dateFilter) => {
    if (!userToFetch) return;

    setLoadingLearning(true);
    const newOffset = reset ? 0 : learningOffset;
    const { from, to } = getDateRange(filterToUse);
    const limit = 10;

    try {
      const token = localStorage.getItem("supervisor_access_token");
      const num = localStorage.getItem("supervisor_number") || phoneNumber;

      const res = await axios.get(GET_USER_LEARNING_DATA_URL, {
        headers: {
          ...API_HEADERS,
          'Supervisor-Number': num,
          'New-Key': token
        },
        params: {
          user_id: userToFetch.user_id,
          from_date: from,
          to_date: to,
          limit: limit,
          offset: newOffset
        }
      });

      if (res.data && res.data.status === 200 && res.data.data) {
        if (reset) {
          setLearningData(res.data.data);
        } else {
          setLearningData([...learningData, ...res.data.data]);
        }
        setLearningOffset(newOffset + limit);
        setHasMoreLearning(res.data.data.length === limit);
      } else {
        if (reset) setLearningData([]);
        setHasMoreLearning(false);
      }
    } catch (error) {
      console.error("Error fetching learning progress:", error);
      if (reset) setLearningData([]);
      setHasMoreLearning(false);
    } finally {
      setLoadingLearning(false);
    }
  };

  const fetchSubjectProgress = async (userToFetch = selectedUser) => {
    if (!userToFetch) return;

    setLoadingSubjectProgress(true);
    try {
      const token = localStorage.getItem("supervisor_access_token");
      const num = localStorage.getItem("supervisor_number") || phoneNumber;

      const res = await axios.get(GET_CLASSES_SUBJECTS_URL, {
        headers: {
          ...API_HEADERS,
          'Supervisor-Number': num,
          'New-Key': token
        },
        params: {
          user_id: userToFetch.user_id
        }
      });

      if (res.data && res.data.status === 200 && res.data.data) {
        setSubjectProgressData(res.data.data);
      } else {
        setSubjectProgressData([]);
      }
    } catch (error) {
      console.error("Error fetching subject progress:", error);
      setSubjectProgressData([]);
    } finally {
      setLoadingSubjectProgress(false);
    }
  };

  const fetchTodayOverview = async (userToFetch = selectedUser) => {
    if (!userToFetch) return;

    setLoadingTodayOverview(true);
    try {
      const token = localStorage.getItem("supervisor_access_token");
      const num = localStorage.getItem("supervisor_number") || phoneNumber;

      const res = await axios.get(GET_TODAY_OVERVIEW_URL, {
        headers: {
          'Client-Service': 'education',
          'Auth-Key': 'krutsha@@',
          'Supervisor-Number': num,
          'New-Key': token
        },
        params: {
          userID: userToFetch.user_id
        }
      });

      if (res.data && res.data.status === 200 && res.data.data) {
        setTodayOverviewData(res.data.data);
      } else {
        setTodayOverviewData(null);
      }
    } catch (error) {
      console.error("Error fetching today's overview:", error);
      setTodayOverviewData(null);
    } finally {
      setLoadingTodayOverview(false);
    }
  };

  const fetchChapterProgress = async (classId, subjectId) => {
    if (!selectedUser) return;

    setLoadingChapterProgress(true);
    setChapterProgressData([]);
    try {
      const token = localStorage.getItem("supervisor_access_token");
      const num = localStorage.getItem("supervisor_number") || phoneNumber;

      const res = await axios.get(GET_CHAPTER_LEARNING_PROGRESS_URL, {
        headers: {
          ...API_HEADERS,
          'Supervisor-Number': num,
          'New-Key': token
        },
        params: {
          user_id: selectedUser.user_id,
          class_id: classId,
          subject_id: subjectId
        }
      });

      if (res.data && res.data.status === 200 && res.data.data) {
        setChapterProgressData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching chapter progress:", error);
    } finally {
      setLoadingChapterProgress(false);
    }
  };

  const fetchQuizProgress = async (reset = false, userToFetch = selectedUser) => {
    if (!userToFetch) return;

    setLoadingQuiz(true);
    const newOffset = reset ? 0 : quizOffset;
    const limit = 10;

    try {
      const num = localStorage.getItem("supervisor_number") || phoneNumber;

      const res = await axios.get(GET_CHAPTER_QUIZ_PROGRESS_URL, {
        headers: {
          'Client-Service': 'education',
          'Auth-Key': 'krutsha@@',
          'Super-Number': num
        },
        params: {
          used_id: userToFetch.user_id,
          limit: limit,
          offset: newOffset
        }
      });

      if (res.data && res.data.status === 200 && res.data.data) {
        if (reset) {
          setQuizData(res.data.data);
        } else {
          setQuizData([...quizData, ...res.data.data]);
        }
        setQuizOffset(newOffset + limit);
        setHasMoreQuiz(res.data.data.length === limit);
      } else {
        if (reset) setQuizData([]);
        setHasMoreQuiz(false);
      }
    } catch (error) {
      console.error("Error fetching quiz progress:", error);
      if (reset) setQuizData([]);
      setHasMoreQuiz(false);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleExamClick = async (examId) => {
    if (!examId) return;
    setIsExamModalOpen(true);
    setLoadingExamResult(true);
    setSelectedExamResult(null);

    try {
      const res = await axios.get(GET_EXAM_RESULT_URL, {
        headers: {
          'Client-Service': 'education',
          'Auth-Key': 'krutsha@@',
          'User-ID': selectedUser.user_id
        },
        params: {
          exam_id: examId
        }
      });
      if (res.data && res.data.status === 200 && res.data.data) {
        setSelectedExamResult(res.data.data);
      } else {
        alert(res.data.message || "Failed to load exam result");
        setIsExamModalOpen(false);
      }
    } catch (error) {
      console.error("Error fetching exam result:", error);
      alert("An error occurred while fetching exam results.");
      setIsExamModalOpen(false);
    } finally {
      setLoadingExamResult(false);
    }
  };

  const handleAnalysisClick = async (examId) => {
    if (!examId) return;
    setIsAnalysisModalOpen(true);
    setLoadingAnalysis(true);
    setSelectedAnalysisResult(null);

    try {
      const res = await axios.get(GET_EXAM_ANALYSIS_URL, {
        headers: {
          'Client-Service': 'education',
          'Auth-Key': 'krutsha@@',
          'User-ID': selectedUser.user_id
        },
        params: {
          exam_id: examId
        }
      });
      if (res.data && res.data.status === 200 && res.data.data) {
        setSelectedAnalysisResult(res.data.data);
      } else {
        alert(res.data.message || "Failed to load exam analysis");
        setIsAnalysisModalOpen(false);
      }
    } catch (error) {
      console.error("Error fetching exam analysis:", error);
      alert("An error occurred while fetching exam analysis.");
      setIsAnalysisModalOpen(false);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleSubjectClick = (classId, subjectId) => {
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null);
    } else {
      setExpandedSubjectId(subjectId);
      fetchChapterProgress(classId, subjectId);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserInnerTab("overview");
    setDateFilter("this week");
    setExpandedClassId(null);
    setExpandedSubjectId(null);
    setLearningSearchQuery("");
    setQuizSearchQuery("");

    fetchTodayOverview(user);
    fetchLearningProgress(true, user, "this week");
    fetchSubjectProgress(user);
    fetchQuizProgress(true, user);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    fetchLearningProgress(true, selectedUser, e.target.value);
  };

  const handleDeleteStudent = async () => {
    if (!selectedUser) return;

    if (window.confirm(`Are you sure you want to remove ${selectedUser.name} from your list? This action cannot be undone.`)) {
      try {
        const num = localStorage.getItem("supervisor_number") || phoneNumber;
        const payload = {
          user_id: selectedUser.user_id,
          supervisor_number: num
        };

        const res = await axios.post(DELETE_LINK_REQUEST_URL, payload, {
          headers: API_HEADERS
        });

        if (res.data && res.data.status === 200) {
          fetchDashboardData();
          setSelectedUser(null);
        } else {
          alert("Failed to delete student: " + (res.data.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("An error occurred while trying to remove the student.");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh"
        }}>
          <span>Loading ...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>
          {step === 1 ? (uiData?.header_title || "Supervisor Auth") :
            step === 2 ? "Enter OTP" :
              step === 3 ? "Your Profile" :
                "Dashboard"}
        </title>
      </Helmet>

      {step === 4 ? (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f4f7f6" }}>
          {/* Dashboard Header */}
          <header className="dashboard-header">
            <div className="header-left-container" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div className="header-left">
                <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  ☰
                </button>
                <img src={`${process.env.PUBLIC_URL}/assets/Logo.png`} alt="Krutsha Logo" style={{ height: "40px", width: "auto" }} />
              </div>
              <h2 className="header-welcome-text" style={{ margin: 0, fontSize: "20px", color: "#333" }}>Welcome {supervisorName ? supervisorName : "Supervisor"}!</h2>
            </div>
            <button
              onClick={() => {
                setStep(1);
                setOtpInput("");
                setPhoneNumber("");
                setSupervisorName("");
                localStorage.removeItem("supervisor_access_token");
                localStorage.removeItem("supervisor_number");
              }}
              title="Log Out"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", background: "#333", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", transition: "all 0.2s" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </header>

          <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
              <h3 style={{ fontSize: "13px", color: "#888", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Menu</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>
                  <button
                    onClick={() => { setActiveTab("pending"); setSelectedUser(null); }}
                    style={{ width: "100%", textAlign: "left", padding: "12px 15px", background: activeTab === "pending" ? "#eef2ff" : "transparent", border: "none", borderRadius: "8px", cursor: "pointer", color: activeTab === "pending" ? "#4f46e5" : "#555", fontWeight: activeTab === "pending" ? "bold" : "normal", fontSize: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <span>Pending Requests</span>
                    {pendingRequests.length > 0 && (
                      <span style={{ background: activeTab === "pending" ? "#4f46e5" : "#ddd", color: activeTab === "pending" ? "#fff" : "#555", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                        {pendingRequests.length}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveTab("accepted"); setSelectedUser(null); }}
                    style={{ width: "100%", textAlign: "left", padding: "12px 15px", background: activeTab === "accepted" ? "#eef2ff" : "transparent", border: "none", borderRadius: "8px", cursor: "pointer", color: activeTab === "accepted" ? "#4f46e5" : "#555", fontWeight: activeTab === "accepted" ? "bold" : "normal", fontSize: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <span>Accepted Users</span>
                    {linkedUsers.length > 0 && (
                      <span style={{ background: activeTab === "accepted" ? "#4f46e5" : "#ddd", color: activeTab === "accepted" ? "#fff" : "#555", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                        {linkedUsers.length}
                      </span>
                    )}
                  </button>
                </li>
              </ul>

              {activeTab === "accepted" && linkedUsers.length > 0 && (
                <div style={{ marginTop: "25px" }}>
                  <h4 style={{ fontSize: "12px", color: "#999", textTransform: "uppercase", marginBottom: "10px", paddingLeft: "5px" }}>Students</h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
                    {linkedUsers.map(user => (
                      <li key={user.user_id}>
                        <button
                          onClick={() => handleSelectUser(user)}
                          style={{
                            width: "100%", textAlign: "left", padding: "10px 15px",
                            background: selectedUser?.user_id === user.user_id ? "#f4f7f6" : "transparent",
                            border: "none", borderRadius: "8px", cursor: "pointer",
                            color: selectedUser?.user_id === user.user_id ? "#333" : "#666",
                            fontSize: "14px", fontWeight: selectedUser?.user_id === user.user_id ? "bold" : "500",
                            borderLeft: selectedUser?.user_id === user.user_id ? "4px solid #4f46e5" : "4px solid transparent"
                          }}
                        >
                          {user.name || "Unknown"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="dashboard-main" style={{ flex: 1, padding: "40px", backgroundColor: "#f4f7f6", overflowY: "auto" }} onClick={() => setIsSidebarOpen(false)}>
              <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e1e5e9", padding: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>

                {activeTab === "pending" && (
                  <>
                    <h3 style={{ fontSize: "20px", marginBottom: "25px", color: "#333" }}>Pending Student Requests</h3>

                    {loadingRequests ? (
                      <p style={{ color: "#777", fontSize: "14px" }}>Loading requests...</p>
                    ) : pendingRequests.length === 0 ? (
                      <p style={{ color: "#777", fontSize: "14px", fontStyle: "italic" }}>No pending requests at the moment.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {pendingRequests.map((req) => (
                          <div key={req.link_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "#f8f9fa", border: "1px solid #e1e5e9", borderRadius: "8px" }}>
                            <div style={{ textAlign: "left" }}>
                              <h4 style={{ margin: "0 0 5px 0", color: "#222", fontSize: "16px" }}>{req.user_name || "Unknown User"}</h4>
                              <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>Phone: {req.user_phone}</p>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button
                                onClick={() => handleAcceptRequest(req)}
                                style={{ padding: "8px 20px", background: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectRequest(req)}
                                style={{ padding: "8px 20px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "accepted" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "25px" }}>
                      <h3 style={{ fontSize: "20px", margin: 0, color: "#333" }}>Student Details</h3>
                      {selectedUser && (
                        <span style={{ padding: "5px 12px", background: selectedUser.user_status === "1" ? "#d4edda" : "#f8d7da", color: selectedUser.user_status === "1" ? "#155724" : "#721c24", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                          {selectedUser.user_status === "1" ? "Active" : "Inactive"}
                        </span>
                      )}
                    </div>

                    {linkedUsers.length === 0 ? (
                      <p style={{ color: "#777", fontSize: "14px", fontStyle: "italic" }}>No accepted users yet.</p>
                    ) : !selectedUser ? (
                      <div style={{ textAlign: "center", padding: "60px 20px", color: "#888", border: "2px dashed #e1e5e9", borderRadius: "10px" }}>
                        <p style={{ fontSize: "16px", fontWeight: "500" }}>Please select a student from the sidebar</p>
                        <p style={{ fontSize: "13px", marginTop: "5px" }}>Click on any name under the Accepted Users menu to view their complete academic and plan details.</p>
                      </div>
                    ) : (
                      <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
                        <div style={{ marginBottom: "20px" }}>
                          <h3 style={{ fontSize: "26px", margin: "0", color: "#222" }}>{selectedUser.name}</h3>
                        </div>

                        {/* Inner Tabs */}
                        <div className="dashboard-tabs" style={{ display: "flex", gap: "20px", borderBottom: "2px solid #e1e5e9", marginBottom: "25px", overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}>
                          <button
                            onClick={() => setUserInnerTab("overview")}
                            style={{ padding: "10px 5px", background: "none", border: "none", borderBottom: userInnerTab === "overview" ? "3px solid #4f46e5" : "3px solid transparent", color: userInnerTab === "overview" ? "#4f46e5" : "#666", fontWeight: userInnerTab === "overview" ? "bold" : "normal", fontSize: "15px", cursor: "pointer", marginBottom: "-2px" }}
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => setUserInnerTab("today_overview")}
                            style={{ padding: "10px 5px", background: "none", border: "none", borderBottom: userInnerTab === "today_overview" ? "3px solid #4f46e5" : "3px solid transparent", color: userInnerTab === "today_overview" ? "#4f46e5" : "#666", fontWeight: userInnerTab === "today_overview" ? "bold" : "normal", fontSize: "15px", cursor: "pointer", marginBottom: "-2px" }}
                          >
                            Today's Learning
                          </button>
                          <button
                            onClick={() => setUserInnerTab("learning")}
                            style={{ padding: "10px 5px", background: "none", border: "none", borderBottom: userInnerTab === "learning" ? "3px solid #4f46e5" : "3px solid transparent", color: userInnerTab === "learning" ? "#4f46e5" : "#666", fontWeight: userInnerTab === "learning" ? "bold" : "normal", fontSize: "15px", cursor: "pointer", marginBottom: "-2px" }}
                          >
                            Learning Progress
                          </button>
                          <button
                            onClick={() => setUserInnerTab("subject_progress")}
                            style={{ padding: "10px 5px", background: "none", border: "none", borderBottom: userInnerTab === "subject_progress" ? "3px solid #4f46e5" : "3px solid transparent", color: userInnerTab === "subject_progress" ? "#4f46e5" : "#666", fontWeight: userInnerTab === "subject_progress" ? "bold" : "normal", fontSize: "15px", cursor: "pointer", marginBottom: "-2px" }}
                          >
                            Subject Wise Progress
                          </button>
                          <button
                            onClick={() => setUserInnerTab("quiz")}
                            style={{ padding: "10px 5px", background: "none", border: "none", borderBottom: userInnerTab === "quiz" ? "3px solid #4f46e5" : "3px solid transparent", color: userInnerTab === "quiz" ? "#4f46e5" : "#666", fontWeight: userInnerTab === "quiz" ? "bold" : "normal", fontSize: "15px", cursor: "pointer", marginBottom: "-2px" }}
                          >
                            Chapter Quiz Progress
                          </button>
                        </div>

                        {userInnerTab === "today_overview" && (
                          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
                            {loadingTodayOverview ? (
                              <p style={{ color: "#777", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>Loading today's overview...</p>
                            ) : !todayOverviewData || (todayOverviewData.learning_overview?.length === 0 && todayOverviewData.practice_overview?.length === 0) ? (
                              <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <p style={{ color: "#777", fontSize: "15px", fontStyle: "italic", marginBottom: "5px" }}>No activity recorded for today yet.</p>
                                <p style={{ color: "#999", fontSize: "13px" }}>Check back later to see the student's progress.</p>
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                {/* Learning Overview */}
                                {todayOverviewData.learning_overview?.length > 0 && (
                                  <div>
                                    <h4 style={{ fontSize: "16px", color: "#333", marginBottom: "15px", borderBottom: "2px solid #e1e5e9", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                                      <span>📚</span> Learning Activity
                                    </h4>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
                                      {todayOverviewData.learning_overview.map((item, idx) => (
                                        <div key={idx} style={{ padding: "15px", background: "#fff", borderRadius: "10px", border: "1px solid #e1e5e9", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                          <div style={{ marginBottom: "12px", borderBottom: "1px dashed #eee", paddingBottom: "10px" }}>
                                            <span style={{ fontSize: "11px", color: "#667eea", textTransform: "uppercase", fontWeight: "bold" }}>Class {item.class_name} &bull; {item.subject_name}</span>
                                            <h5 style={{ margin: "5px 0 0 0", color: "#333", fontSize: "15px", lineHeight: "1.3" }}>{item.chapter_name}</h5>
                                          </div>
                                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                            {['notes', 'qna', 'formula', 'skimcard'].filter(m => item.modules[m]).map(mod => {
                                              const progress = item.modules[mod].today_completed_percentage;
                                              if (progress <= 0) return null; // only show what they studied today

                                              const label = mod === "skimcard" ? "Skim Cards" : mod === "notes" ? "Notes" : mod === "formula" ? "Formulas" : "Q&A";
                                              return (
                                                <div key={mod}>
                                                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                                                    <span style={{ color: "#555", fontWeight: "500" }}>{label}</span>
                                                    <span style={{ color: "#4f46e5", fontWeight: "bold" }}>+{progress}% Today</span>
                                                  </div>
                                                  <div style={{ width: "100%", height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                                                    <div style={{ width: `${progress}%`, height: "100%", background: "#4f46e5" }}></div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Practice Overview */}
                                {todayOverviewData.practice_overview?.length > 0 && (
                                  <div>
                                    <h4 style={{ fontSize: "16px", color: "#333", marginBottom: "15px", borderBottom: "2px solid #e1e5e9", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                                      <span>📝</span> Practice Tests
                                    </h4>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" }}>
                                      {todayOverviewData.practice_overview.map((item, idx) => (
                                        <div key={idx} style={{ padding: "15px", background: "#fff", borderRadius: "10px", border: "1px solid #e1e5e9", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                          <div>
                                            <span style={{ fontSize: "11px", color: "#667eea", textTransform: "uppercase", fontWeight: "bold" }}>Class {item.class_name} &bull; {item.subject_name}</span>
                                            <h5 style={{ margin: "5px 0 15px 0", color: "#333", fontSize: "14px", lineHeight: "1.3" }}>{item.chapter_name}</h5>
                                          </div>
                                          <div>
                                            <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", fontWeight: "bold", marginBottom: "2px" }}>Score</div>
                                            <div style={{ fontSize: "24px", fontWeight: "bold", color: parseFloat(item.percentage_scored) >= 70 ? "#28a745" : parseFloat(item.percentage_scored) >= 40 ? "#fd7e14" : "#dc3545" }}>
                                              {parseFloat(item.percentage_scored).toFixed(0)}%
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {userInnerTab === "overview" && (
                          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
                            <div className="student-overview-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                              <h3 style={{ fontSize: "20px", margin: 0, color: "#333" }}>Student Profile</h3>
                              <button
                                onClick={handleDeleteStudent}
                                title="Remove Student"
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", background: "#fff", border: "1px solid #dc3545", color: "#dc3545", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}
                                onMouseOver={(e) => { e.currentTarget.style.background = "#dc3545"; e.currentTarget.style.color = "#fff"; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#dc3545"; }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </div>
                            <div className="dashboard-cards-grid">
                              {/* Academic Info Card */}
                              <div style={{ padding: "25px", background: "#f8f9fa", borderRadius: "12px", border: "1px solid #e1e5e9", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
                                <h4 style={{ fontSize: "14px", color: "#667eea", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 15px 0", borderBottom: "1px solid #e1e5e9", paddingBottom: "10px" }}>Academic Info</h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#666", fontSize: "14px" }}>Class</span>
                                    <strong style={{ color: "#333", fontSize: "15px" }}>{selectedUser.current_class}</strong>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#666", fontSize: "14px" }}>Subject</span>
                                    <strong style={{ color: "#333", fontSize: "15px" }}>{selectedUser.subject}</strong>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#666", fontSize: "14px" }}>Current Chapter</span>
                                    <strong style={{ color: "#333", fontSize: "15px", textAlign: "right", maxWidth: "60%" }}>{selectedUser.chapter}</strong>
                                  </div>
                                </div>
                              </div>

                              {/* Plan Details Card */}
                              <div style={{ padding: "25px", background: "#f8f9fa", borderRadius: "12px", border: "1px solid #e1e5e9", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
                                <h4 style={{ fontSize: "14px", color: "#667eea", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 15px 0", borderBottom: "1px solid #e1e5e9", paddingBottom: "10px" }}>Subscription</h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#666", fontSize: "14px" }}>Current Plan</span>
                                    <strong style={{ color: "#333", fontSize: "15px", textTransform: "capitalize" }}>{selectedUser.plan}</strong>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#666", fontSize: "14px" }}>Remaining Days</span>
                                    <strong style={{ color: "#333", fontSize: "15px" }}>{selectedUser.plan_remaining_days}</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {userInnerTab === "learning" && (
                          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
                            <div className="filters-container" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                              <select
                                value={dateFilter}
                                onChange={handleDateFilterChange}
                                className="filter-select"
                                style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", fontSize: "14px", cursor: "pointer", background: "#fff", color: "#333" }}
                              >
                                <option value="today">Today</option>
                                <option value="this week">This Week</option>
                                <option value="last week">Last Week</option>
                                <option value="this month">This Month</option>
                                <option value="last month">Last Month</option>
                                <option value="overall">Overall</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Search chapter..."
                                value={learningSearchQuery}
                                onChange={(e) => setLearningSearchQuery(e.target.value)}
                                className="filter-input"
                                style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", fontSize: "14px" }}
                              />
                            </div>

                            {loadingLearning && learningOffset === 0 ? (
                              <p style={{ color: "#777", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>Loading progress data...</p>
                            ) : learningData.length === 0 ? (
                              <p style={{ color: "#777", fontSize: "14px", fontStyle: "italic", textAlign: "center", padding: "40px 0" }}>No learning activity found for the selected period.</p>
                            ) : (
                              <>
                                <div className="dashboard-cards-grid">
                                  {learningData.filter(item => item.chapter_name.toLowerCase().includes(learningSearchQuery.toLowerCase())).map((item, index) => (
                                    <div key={index} style={{ padding: "20px", background: "#fff", borderRadius: "10px", border: "1px solid #e1e5e9", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                                      <div style={{ marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                                        <span style={{ fontSize: "12px", color: "#999", textTransform: "uppercase", fontWeight: "bold" }}>Class {item.class_name} &bull; {item.subject_name}</span>
                                        <h4 style={{ margin: "5px 0 0 0", color: "#333", fontSize: "18px" }}>{item.chapter_name}</h4>
                                      </div>

                                      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                        {['notes', 'qna', 'formula', 'skimcard'].filter(m => item.modules[m]).map((moduleName) => {
                                          const progressData = item.modules[moduleName];
                                          return (
                                            <div key={moduleName}>
                                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                                <span style={{ fontSize: "14px", color: "#555", textTransform: "capitalize", fontWeight: "bold" }}>{moduleName === 'qna' ? 'QnA' : moduleName}</span>
                                                <span style={{ fontSize: "13px", color: "#333", fontWeight: "bold" }}>{progressData.overall_completed_percentage}%</span>
                                              </div>
                                              <div style={{ width: "100%", height: "8px", background: "#e1e5e9", borderRadius: "4px", overflow: "hidden", marginBottom: "5px" }}>
                                                <div style={{ height: "100%", background: "#4f46e5", width: `${progressData.overall_completed_percentage}%`, borderRadius: "4px", transition: "width 0.5s ease-in-out" }}></div>
                                              </div>
                                              {progressData.completed_percentage_in_range > 0 && (
                                                <div style={{ fontSize: "12px", color: "#28a745", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                                  +{progressData.completed_percentage_in_range}% progress in this period
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {hasMoreLearning && (
                                  <button
                                    onClick={() => fetchLearningProgress(false)}
                                    disabled={loadingLearning}
                                    style={{ padding: "10px", width: "100%", background: "#f8f9fa", border: "1px dashed #ccc", borderRadius: "8px", color: "#555", fontWeight: "bold", cursor: loadingLearning ? "not-allowed" : "pointer", marginTop: "20px" }}
                                  >
                                    {loadingLearning ? "Loading more..." : "Load More"}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        )}

                        {userInnerTab === "subject_progress" && (
                          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>

                            {loadingSubjectProgress ? (
                              <p style={{ color: "#777", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>Loading subject data...</p>
                            ) : subjectProgressData.length === 0 ? (
                              <p style={{ color: "#777", fontSize: "14px", fontStyle: "italic", textAlign: "center", padding: "40px 0" }}>No subject data found for this student.</p>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {subjectProgressData.map((classData) => (
                                  <div key={classData.class_id} style={{ overflow: "hidden", marginBottom: "5px" }}>
                                    <div
                                      onClick={() => {
                                        setExpandedClassId(expandedClassId === classData.class_id ? null : classData.class_id);
                                        setExpandedSubjectId(null);
                                        setChapterProgressData([]);
                                      }}
                                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", cursor: "pointer", background: "transparent", transition: "background 0.2s" }}
                                    >
                                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                        <h4 style={{ margin: 0, fontSize: "16px", color: "#333" }}>Class {classData.class_name}</h4>
                                      </div>
                                      <div style={{ color: "#888" }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedClassId === classData.class_id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
                                          <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                      </div>
                                    </div>

                                    {expandedClassId === classData.class_id && (
                                      <div className="class-subjects-container" style={{ padding: "0", background: "transparent" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                          {classData.subjects.map((subject) => (
                                            <div key={subject.subject_id} style={{ overflow: "hidden", borderBottom: "1px solid #f1f1f1" }}>
                                              <div
                                                onClick={() => handleSubjectClick(classData.class_id, subject.subject_id)}
                                                className="subject-row"
                                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", cursor: "pointer", background: "transparent" }}
                                              >
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedSubjectId === subject.subject_id ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                  </svg>
                                                  <span style={{ fontSize: "15px", color: "#444", fontWeight: "600" }}>{subject.subject_name}</span>
                                                </div>
                                                {subject.status === 1 ? (
                                                  <span style={{ padding: "4px 10px", background: "#d4edda", color: "#155724", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                                                    Started Learning
                                                  </span>
                                                ) : (
                                                  <span style={{ padding: "4px 10px", background: "#f8d7da", color: "#721c24", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                                                    Learning Not Started
                                                  </span>
                                                )}
                                              </div>

                                              {expandedSubjectId === subject.subject_id && (
                                                <div style={{ padding: "20px", borderTop: "1px solid #e1e5e9", background: "#fcfcfc" }}>
                                                  {loadingChapterProgress ? (
                                                    <p style={{ color: "#777", fontSize: "13px", textAlign: "center" }}>Loading chapters...</p>
                                                  ) : chapterProgressData.length === 0 ? (
                                                    <p style={{ color: "#777", fontSize: "13px", fontStyle: "italic", textAlign: "center" }}>No chapters found for this subject.</p>
                                                  ) : (
                                                    <div className="dashboard-cards-grid">
                                                      {chapterProgressData.map((chapter) => (
                                                        <div key={chapter.chapter_id} style={{ padding: "15px", background: "#fff", borderRadius: "8px", border: "1px solid #e1e5e9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                                                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                                                            <h5 style={{ margin: 0, color: "#333", fontSize: "16px", lineHeight: "1.3" }}>{chapter.chapter_name}</h5>
                                                            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#4f46e5", background: "#eef2ff", padding: "4px 8px", borderRadius: "6px" }}>
                                                              {chapter.overall_chapter_progress}%
                                                            </span>
                                                          </div>

                                                          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                            {['notes', 'qna', 'formula', 'skimcard'].filter(m => chapter.modules && chapter.modules[m]).map((moduleName) => {
                                                              const progressData = chapter.modules[moduleName];
                                                              return (
                                                                <div key={moduleName}>
                                                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                                                    <span style={{ fontSize: "13px", color: "#666", textTransform: "capitalize", fontWeight: "600" }}>{moduleName === 'qna' ? 'QnA' : moduleName}</span>
                                                                    <span style={{ fontSize: "12px", color: "#444", fontWeight: "bold" }}>{progressData.overall_completed_percentage}%</span>
                                                                  </div>
                                                                  <div style={{ width: "100%", height: "6px", background: "#f0f2f5", borderRadius: "3px", overflow: "hidden" }}>
                                                                    <div style={{ height: "100%", background: "#4f46e5", width: `${progressData.overall_completed_percentage}%`, borderRadius: "3px", transition: "width 0.5s ease" }}></div>
                                                                  </div>
                                                                  {progressData.today_completed_percentage > 0 && (
                                                                    <div style={{ fontSize: "11px", color: "#28a745", fontWeight: "600", marginTop: "3px" }}>
                                                                      +{progressData.today_completed_percentage}% today
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              );
                                                            })}
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {userInnerTab === "quiz" && (
                          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
                            <div className="filters-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                              <input
                                type="text"
                                placeholder="Search chapter..."
                                value={quizSearchQuery}
                                onChange={(e) => setQuizSearchQuery(e.target.value)}
                                className="filter-input"
                                style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", fontSize: "14px" }}
                              />
                            </div>

                            {loadingQuiz && quizOffset === 0 ? (
                              <p style={{ color: "#777", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>Loading quiz progress...</p>
                            ) : quizData.length === 0 ? (
                              <p style={{ color: "#777", fontSize: "14px", fontStyle: "italic", textAlign: "center", padding: "40px 0" }}>No quiz activity found for this student.</p>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div className="dashboard-cards-grid">
                                  {quizData.filter(quiz => quiz.chapter.toLowerCase().includes(quizSearchQuery.toLowerCase())).map((quiz, idx) => {
                                    // Parse trend for sparkline
                                    let trend = [];
                                    if (quiz.trend && Array.isArray(quiz.trend)) {
                                      trend = quiz.trend.map(Number);
                                    }

                                    const svgWidth = 80;
                                    const svgHeight = 30;
                                    const padX = 5;
                                    const padY = 4;
                                    const graphWidth = svgWidth - 2 * padX;
                                    const graphHeight = svgHeight - 2 * padY;

                                    let points = [];
                                    if (trend.length === 1) {
                                      points.push({ x: svgWidth / 2, y: padY + graphHeight - (trend[0] / 100) * graphHeight });
                                    } else if (trend.length > 1) {
                                      trend.forEach((val, i) => {
                                        const x = padX + (i / (trend.length - 1)) * graphWidth;
                                        const y = padY + graphHeight - (val / 100) * graphHeight;
                                        points.push({ x, y });
                                      });
                                    }
                                    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

                                    return (
                                      <div
                                        key={idx}
                                        style={{ padding: "20px", background: "#fff", borderRadius: "10px", border: "1px solid #e1e5e9", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column" }}
                                      >
                                        <div style={{ marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                                          <span style={{ fontSize: "12px", color: "#999", textTransform: "uppercase", fontWeight: "bold" }}>Class {quiz.class} &bull; {quiz.subject}</span>
                                          <h4 style={{ margin: "5px 0 0 0", color: "#333", fontSize: "17px", lineHeight: "1.3" }}>{quiz.chapter}</h4>
                                          <div style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
                                            Completed: {new Date(quiz.completion_date).toLocaleDateString()}
                                          </div>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" }}>
                                          <div>
                                            <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase", fontWeight: "bold", marginBottom: "2px" }}>Latest Score</div>
                                            <div style={{ fontSize: "28px", fontWeight: "bold", color: parseFloat(quiz.scored_percentage) >= 70 ? "#28a745" : parseFloat(quiz.scored_percentage) >= 40 ? "#fd7e14" : "#dc3545" }}>
                                              {parseFloat(quiz.scored_percentage).toFixed(0)}%
                                            </div>
                                          </div>

                                          {trend.length > 0 && (
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                              <div style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>Trend (Last 3)</div>
                                              <svg width={svgWidth} height={svgHeight} style={{ overflow: "visible" }}>
                                                {trend.length > 1 && (
                                                  <polyline points={polylinePoints} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                )}
                                                {points.map((p, i) => (
                                                  <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#4f46e5" />
                                                ))}
                                              </svg>
                                            </div>
                                          )}
                                        </div>

                                        {quiz.examID && (
                                          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                                            <button
                                              onClick={() => handleExamClick(quiz.examID)}
                                              style={{ flex: 1, padding: "8px 12px", background: "#edf2f7", border: "1px solid #e2e8f0", borderRadius: "6px", color: "#4f46e5", fontSize: "13px", fontWeight: "bold", cursor: "pointer", transition: "background 0.2s" }}
                                              onMouseOver={(e) => e.currentTarget.style.background = "#e2e8f0"}
                                              onMouseOut={(e) => e.currentTarget.style.background = "#edf2f7"}
                                            >
                                              Answer Sheet
                                            </button>
                                            <button
                                              onClick={() => handleAnalysisClick(quiz.examID)}
                                              style={{ flex: 1, padding: "8px 12px", background: "#4f46e5", border: "1px solid #4f46e5", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: "bold", cursor: "pointer", transition: "background 0.2s" }}
                                              onMouseOver={(e) => e.currentTarget.style.background = "#4338ca"}
                                              onMouseOut={(e) => e.currentTarget.style.background = "#4f46e5"}
                                            >
                                              AI Analysis
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                {hasMoreQuiz && (
                                  <button
                                    onClick={() => fetchQuizProgress(false)}
                                    disabled={loadingQuiz}
                                    style={{ padding: "10px", width: "100%", background: "#f8f9fa", border: "1px dashed #ccc", borderRadius: "8px", color: "#555", fontWeight: "bold", cursor: loadingQuiz ? "not-allowed" : "pointer", marginTop: "10px" }}
                                  >
                                    {loadingQuiz ? "Loading more..." : "Load More"}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

              </div>
            </main>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "50px", paddingBottom: "50px", minHeight: "100vh", backgroundColor: "#f4f7f6" }}>
          <div className="form-container">
            <img
              src={`${process.env.PUBLIC_URL}/assets/Logo.png`}
              alt="Krutsha Logo"
              style={{
                display: "block",
                margin: "0 auto 20px auto",
                width: "auto",
                height: 60
              }}
            />

            {step === 1 ? (
              <>
                <h2 className="form-title" style={{ marginBottom: "10px" }}>{uiData?.header_title}</h2>
                <p style={{ textAlign: "center", color: "#555", marginBottom: "20px", fontSize: "14px", fontWeight: "500" }}>
                  {uiData?.header_description}
                </p>

                {errorMessage && (
                  <div className="error-message" style={{ color: "#d9534f", textAlign: "center", marginBottom: "15px", fontWeight: "bold" }}>
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleGetOtp}>
                  <div className="form-group phone-input-group">
                    <div className="country-code-col">
                      <label htmlFor="countryCode" style={{ marginBottom: "8px", display: "block" }}>Country Code</label>
                      <select
                        id="countryCode"
                        value={selectedCode}
                        onChange={(e) => setSelectedCode(e.target.value)}
                        style={{ width: "100%", boxSizing: "border-box" }}
                      >
                        {countryCodes.map((c, index) => (
                          <option key={index} value={c.code}>
                            +{c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="phone-number-col">
                      <label htmlFor="phoneNumber" style={{ marginBottom: "8px", display: "block" }}>Phone Number</label>
                      <input
                        type="text"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={uiData?.input_title || "000-000-0000"}
                        style={{ width: "100%", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="save-btn" disabled={submitting}>
                    {submitting ? "Processing..." : (uiData?.next_button || "Get OTP")}
                  </button>
                </form>

                {uiData?.footer_description && (
                  <div
                    style={{ marginTop: "25px", fontSize: "13px", textAlign: "center", color: "#666", lineHeight: "1.5" }}
                    dangerouslySetInnerHTML={{ __html: uiData.footer_description }}
                  />
                )}
              </>
            ) : step === 2 ? (
              <>
                <h2 className="form-title" style={{ marginBottom: "10px" }}>Enter OTP</h2>
                <p style={{ textAlign: "center", color: "#555", marginBottom: "20px", fontSize: "14px", fontWeight: "500" }}>
                  A verification code has been sent to +{selectedCode} {phoneNumber}.
                </p>

                {errorMessage && (
                  <div className="error-message" style={{ color: "#d9534f", textAlign: "center", marginBottom: "15px", fontWeight: "bold" }}>
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp}>
                  <div className="form-group">
                    <label htmlFor="otp" style={{ marginBottom: "8px", display: "block" }}>OTP</label>
                    <input
                      type="text"
                      id="otp"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter OTP"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      maxLength={10}
                    />
                    {otpError && <div style={{ color: "#d9534f", fontSize: "12px", marginTop: "5px" }}>{otpError}</div>}
                  </div>

                  <button type="submit" className="save-btn" disabled={submitting || (resendCount === 0 && allowOtp !== 1)}>
                    Verify OTP
                  </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
                  {allowOtp === 0 ? (
                    <span style={{ color: "#d9534f" }}>Please try later after {reAllowTimer} minutes.</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGetOtp}
                      disabled={resendTimer > 0 || allowOtp !== 1 || submitting}
                      style={{
                        background: "none", border: "none", color: (resendTimer > 0 || allowOtp !== 1) ? "#999" : "#667eea",
                        cursor: (resendTimer > 0 || allowOtp !== 1) ? "not-allowed" : "pointer", fontWeight: "bold", textDecoration: "underline"
                      }}
                    >
                      Resend OTP {resendTimer > 0 ? `in ${resendTimer}s` : ""}
                    </button>
                  )}

                  <div style={{ marginTop: "15px" }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{ background: "none", border: "none", color: "#555", cursor: "pointer", textDecoration: "underline", fontSize: "13px" }}
                    >
                      Change Phone Number
                    </button>
                  </div>
                </div>
              </>
            ) : step === 3 ? (
              <>
                <h2 className="form-title" style={{ marginBottom: "10px" }}>Your Profile</h2>
                <p style={{ textAlign: "center", color: "#555", marginBottom: "20px", fontSize: "14px", fontWeight: "500" }}>
                  Please enter your name to continue.
                </p>

                {errorMessage && (
                  <div className="error-message" style={{ color: "#d9534f", textAlign: "center", marginBottom: "15px", fontWeight: "bold" }}>
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleNameSubmit}>
                  <div className="form-group">
                    <label htmlFor="supervisorName" style={{ marginBottom: "8px", display: "block" }}>Full Name</label>
                    <input
                      type="text"
                      id="supervisorName"
                      value={supervisorName}
                      onChange={(e) => setSupervisorName(e.target.value.slice(0, 25))}
                      placeholder="Enter your name"
                      style={{ width: "100%", boxSizing: "border-box" }}
                    />
                    <div style={{ textAlign: "right", fontSize: "12px", color: supervisorName.length === 25 ? "#d9534f" : "#777", marginTop: "5px" }}>
                      {supervisorName.length}/25 characters
                    </div>
                  </div>

                  <button type="submit" className="save-btn" disabled={submitting}>
                    {submitting ? "Saving..." : "Continue"}
                  </button>
                </form>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Exam Result Modal */}
      {isExamModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", borderRadius: "10px", padding: "20px", position: "relative" }}>
            <button
              onClick={() => setIsExamModalOpen(false)}
              style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#666" }}
            >
              &times;
            </button>
            <h3 style={{ marginTop: 0, color: "#333", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Answer Sheet</h3>

            {loadingExamResult ? (
              <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading results...</p>
            ) : selectedExamResult ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", background: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>{selectedExamResult.total_question}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Total</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{selectedExamResult.correct_answer}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Correct</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ef4444" }}>{selectedExamResult.incorrect_answer}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Incorrect</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {selectedExamResult.attempted_questions && selectedExamResult.attempted_questions.map((q, i) => {
                    const isCorrect = q.options && q.options[q.user_answer] ? q.options[q.user_answer] === q.correct_answer : q.user_answer === q.correct_answer;
                    return (
                      <div key={i} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px" }}>
                        <div style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "15px", color: "#333" }}>Q{i + 1}. {q.question}</div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px", fontSize: "13px" }}>
                          <div style={{ background: isCorrect ? "#ecfdf5" : "#fef2f2", padding: "8px", borderRadius: "6px", color: isCorrect ? "#065f46" : "#991b1b" }}>
                            <strong>Your Answer:</strong> {q.options && q.options[q.user_answer] ? q.options[q.user_answer] : q.user_answer}
                          </div>
                          <div style={{ background: "#ecfdf5", padding: "8px", borderRadius: "6px", color: "#065f46" }}>
                            <strong>Correct Answer:</strong> {q.correct_answer}
                          </div>
                        </div>

                        {q.explanation && (
                          <div style={{ fontSize: "12px", color: "#555", background: "#f8f9fa", padding: "10px", borderRadius: "6px" }}>
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {isAnalysisModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", width: "90%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", borderRadius: "10px", padding: "20px", position: "relative" }}>
            <button
              onClick={() => setIsAnalysisModalOpen(false)}
              style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#666" }}
            >
              &times;
            </button>
            <h3 style={{ marginTop: 0, color: "#333", borderBottom: "1px solid #eee", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>✨</span> AI Exam Analysis
            </h3>

            {loadingAnalysis ? (
              <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>Generating AI analysis...</p>
            ) : selectedAnalysisResult ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px" }}>
                  <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4f46e5" }}>{selectedAnalysisResult.percentage}%</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Score</div>
                  </div>
                  <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>+{selectedAnalysisResult.improvement_by}%</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Previous Quiz Improvement</div>
                  </div>
                  <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>{selectedAnalysisResult.percentile_ranking?.percentile_rank || "N/A"}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Percentile Rank</div>
                  </div>
                  <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>{selectedAnalysisResult.avg_time_per_question}s</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Avg Time/Question</div>
                  </div>
                </div>

                {/* AI Insights: Mistake Patterns */}
                {selectedAnalysisResult.ai_analysis?.mistake_patterns?.length > 0 && (
                  <div>
                    <h4 style={{ color: "#ef4444", fontSize: "16px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>⚠️</span> Mistake Patterns
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {selectedAnalysisResult.ai_analysis.mistake_patterns.map((mp, i) => (
                        <div key={i} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px" }}>
                          <div style={{ fontWeight: "bold", color: "#991b1b", marginBottom: "5px" }}>{mp.pattern}</div>
                          <div style={{ fontSize: "13px", color: "#b91c1c", marginBottom: "8px" }}>{mp.description}</div>
                          {mp.question_numbers && mp.question_numbers.length > 0 && (
                            <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: "bold" }}>                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Insights: Knowledge Gaps */}
                {selectedAnalysisResult.ai_analysis?.knowledge_gaps?.length > 0 && (
                  <div>
                    <h4 style={{ color: "#f59e0b", fontSize: "16px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>🔍</span> Knowledge Gaps
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {selectedAnalysisResult.ai_analysis.knowledge_gaps.map((kg, i) => (
                        <div key={i} style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <div style={{ fontWeight: "bold", color: "#b45309" }}>{kg.topic}</div>
                            <span style={{ fontSize: "11px", background: "#fef3c7", padding: "2px 6px", borderRadius: "4px", color: "#d97706", fontWeight: "bold" }}>
                              {kg.severity} Severity
                            </span>
                          </div>
                          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#92400e" }}>
                            {kg.missing_concepts?.map((c, j) => (
                              <li key={j} style={{ marginBottom: "3px" }}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic Performance */}
                {selectedAnalysisResult.ai_analysis?.topic_performance?.length > 0 && (
                  <div>
                    <h4 style={{ color: "#10b981", fontSize: "16px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>📈</span> Topic Performance
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "10px" }}>
                      {selectedAnalysisResult.ai_analysis.topic_performance.map((tp, i) => (
                        <div key={i} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "12px" }}>
                          <div style={{ fontWeight: "bold", color: "#333", fontSize: "14px", marginBottom: "8px" }}>{tp.topic}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                            <span>Score: {tp.score_percent}%</span>
                            <span>{tp.correct} / {tp.total}</span>
                          </div>
                          <div style={{ width: "100%", height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${tp.score_percent}%`, height: "100%", background: tp.score_percent >= 80 ? "#10b981" : tp.score_percent >= 50 ? "#f59e0b" : "#ef4444" }}></div>
                          </div>
                          <div style={{ fontSize: "11px", marginTop: "8px", fontWeight: "bold", color: tp.performance_label === "Outstanding" ? "#10b981" : tp.performance_label === "Progressing Well" ? "#f59e0b" : tp.performance_label === "Needs Review" ? "#ef4444" : "#666" }}>
                            {tp.performance_label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Question Analysis */}
                {selectedAnalysisResult.ai_analysis?.results?.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <h4 style={{ color: "#4f46e5", fontSize: "16px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>📝</span> Detailed Question Analysis
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                      {selectedAnalysisResult.ai_analysis.results.map((result, i) => (
                        <div key={i} style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "15px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                            <div style={{ fontWeight: "bold", color: "#1f2937", flex: 1, paddingRight: "10px" }}>Q{i + 1}: {result.question}</div>
                            <div style={{ fontSize: "12px", background: result.awarded_marks > 0 ? "#d1fae5" : "#fee2e2", color: result.awarded_marks > 0 ? "#065f46" : "#991b1b", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", whiteSpace: "nowrap" }}>
                              {result.awarded_marks} / {result.question_marks} Marks
                            </div>
                          </div>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "10px" }}>
                            <div>
                              <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold", marginBottom: "4px" }}>Your Answer:</div>
                              <div style={{ fontSize: "14px", color: result.awarded_marks === result.question_marks ? "#059669" : "#dc2626" }}>{result.user_answer || "Not Answered"}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold", marginBottom: "4px" }}>Correct Answer:</div>
                              <div style={{ fontSize: "14px", color: "#374151" }}>{result.answer}</div>
                            </div>
                          </div>

                          {(result.feedback || result.mistake_type !== "none") && (
                            <div style={{ background: result.mistake_type === "none" ? "#ecfdf5" : "#fff1f2", borderLeft: `4px solid ${result.mistake_type === "none" ? "#10b981" : "#f43f5e"}`, padding: "10px 12px", borderRadius: "0 6px 6px 0", fontSize: "13px" }}>
                              {result.mistake_type !== "none" && (
                                <div style={{ fontWeight: "bold", color: "#be123c", marginBottom: "4px", textTransform: "capitalize" }}>
                                  Mistake Type: {result.mistake_type.replace(/_/g, ' ')}
                                </div>
                              )}
                              <div style={{ color: result.mistake_type === "none" ? "#065f46" : "#881337" }}>
                                <strong>Feedback:</strong> {result.feedback}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}


              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default SupervisorAuth;
