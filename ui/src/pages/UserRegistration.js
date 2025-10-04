import './UserRegistration.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const VALIDATE_KEY_URL = 'https://krutsha.ireavaschool.in/validate-registration-key';
const UPDATE_USER_URL = 'https://krutsha.ireavaschool.in/update-user-details';
const GET_CLASS_LIST_URL = 'https://krutsha.ireavaschool.in/get-class-list';
const GET_SUBJECT_LIST_URL = 'https://krutsha.ireavaschool.in/get-subject-list';
const GET_CHAPTER_LIST_URL = 'https://krutsha.ireavaschool.in/get-chapter-list';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // form state (controlled inputs)
  const [form, setForm] = useState({
    id: null,
    class_id: "",
    subject_id: "",
    chapter_id: "",
    name: "",
    phone_number: "",
    is_registered: 0,
    brand_number: null
  });

  // dropdown data states
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [chapterList, setChapterList] = useState([]);

  // loading states for dropdowns
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);

  // fetch class list
  async function fetchClassList() {
    try {
      const { data } = await axios.get(GET_CLASS_LIST_URL);
      if (data && data.success && data.data) {
        setClassList(data.data);
      }
    } catch (error) {
      console.error("Error fetching class list:", error);
    }
  }

  // fetch subject list based on class_id
  async function fetchSubjectList(classId) {
    if (!classId) {
      setSubjectList([]);
      return;
    }

    setLoadingSubjects(true);
    try {
      const { data } = await axios.get(`${GET_SUBJECT_LIST_URL}?class_id=${classId}`);
      if (data && data.success && data.data) {
        setSubjectList(data.data);
      } else {
        setSubjectList([]);
      }
    } catch (error) {
      console.error("Error fetching subject list:", error);
      setSubjectList([]);
    } finally {
      setLoadingSubjects(false);
    }
  }

  // fetch chapter list based on class_id and subject_id
  async function fetchChapterList(classId, subjectId) {
    if (!classId || !subjectId) {
      setChapterList([]);
      return;
    }

    setLoadingChapters(true);
    try {
      const { data } = await axios.get(`${GET_CHAPTER_LIST_URL}?class_id=${classId}&subject_id=${subjectId}`);
      if (data && data.success && data.data) {
        setChapterList(data.data);
      } else {
        setChapterList([]);
      }
    } catch (error) {
      console.error("Error fetching chapter list:", error);
      setChapterList([]);
    } finally {
      setLoadingChapters(false);
    }
  }

  // validateKey -> fetch decode-key and prefills form
  async function validateKey(key) {
    if (!key) return null;
    setLoading(true);
    setErrorMessage("");
    try {
      const { data } = await axios.get(`${VALIDATE_KEY_URL}?key=${encodeURIComponent(key)}`, {
        // withCredentials: true, // uncomment if backend uses cookies
      });

      if (!data || !data.success) {
        // backend responded with success: false
        const err = data?.message || 'Invalid or expired key';
        setErrorMessage(err);
        return;
      }

      // assume `data.data.data` contains user info (as in your existing code)
      const user = data.data || {};

      console.log("user:: ", user);

      // normalize fields - ensure keys match form state
      const newForm = {
        id: user.id ?? null,
        class_id: user.class_id ?? "",
        subject_id: user.subject_id ?? "",
        chapter_id: user.chapter_id ?? "",
        name: user.name ?? "",
        phone_number: user.phone_number,
        is_registered: user.is_registered ?? 0,
        brand_number: user.brand_number ?? null
      };

      setForm(newForm);

      // fetch dependent dropdown data if values are present
      if (newForm.class_id) {
        await fetchSubjectList(newForm.class_id);

        if (newForm.subject_id) {
          await fetchChapterList(newForm.class_id, newForm.subject_id);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("error in validate key:: ", error);
      setErrorMessage(error?.message || "Something went wrong while validating key");
      // setLoading(false);
    }
  }

  useEffect(() => {
    const key = searchParams.get('key');
    if (!key) {
      // if key missing, redirect to home
      navigate('/', { replace: true });
      return;
    }

    // fetch class list first
    fetchClassList();
    validateKey(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, navigate]);

  const key = searchParams.get('key');
  if (!key) return null;

  // handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'class') {
      setForm((s) => ({
        ...s,
        class_id: value,
        subject_id: "", // reset subject when class changes
        chapter_id: ""  // reset chapter when class changes
      }));

      // clear dependent dropdowns
      setSubjectList([]);
      setChapterList([]);

      // fetch subjects for new class
      if (value) {
        fetchSubjectList(value);
      }

    } else if (name === 'subject') {
      setForm((s) => ({
        ...s,
        subject_id: value,
        chapter_id: "" // reset chapter when subject changes
      }));

      // clear chapters
      setChapterList([]);

      // fetch chapters for new subject
      if (value && form.class_id) {
        fetchChapterList(form.class_id, value);
      }

    } else if (name === 'chapter') {
      setForm((s) => ({ ...s, chapter_id: value }));

    } else if (name === 'name') {
      // limit to 24 characters if you want
      const truncated = value.slice(0, 24);
      setForm((s) => ({ ...s, name: truncated }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  }

  // submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    // basic validation
    if (!form.name || !form.class_id || !form.subject_id || !form.chapter_id) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    // payload - adapt to backend expected keys
    const payload = {
      id: form.id,
      class_id: parseInt(form.class_id), // ensure it's integer
      subject_id: parseInt(form.subject_id), // ensure it's integer
      chapter_id: parseInt(form.chapter_id), // ensure it's integer
      name: form.name.trim(),
      key: searchParams.get('key'),
      is_registered: form.is_registered
    };



    try {
      // show some loading UI if needed
      setLoading(true);

      const { data } = await axios.post(UPDATE_USER_URL, payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // adjust handling depending on backend response shape
      if (data && data.success) {
        setErrorMessage(data.message || 'Profile Created Successfully');
        // optionally update local form state from returned data
        if (data.data) {
          setForm((s) => ({
            ...s,
            id: data.data.id ?? s.id,
            is_registered: data.data.is_registered ?? 1,
          }));
        } else {
          setForm((s) => ({ ...s, is_registered: 1 }));
        }
        // show success msg for a while and optionally redirect
        setTimeout(() => {
          setErrorMessage('Redirecting to WhatsApp...');
          let redirect_url = `https://wa.me/${form.brand_number}`;
          console.log("redirect_url:: ", redirect_url);
          window.location.href = redirect_url;

        }, 2000);
      } else {
        setErrorMessage(data?.data?.error || data?.message || 'Failed to save details');
      }
    } catch (error) {
      console.error("update error:", error);
      // axios error structure
      const msg = error?.response?.data?.message
        || error?.response?.data?.data?.error
        || error?.message
        || 'Network or server error';
      setErrorMessage(msg);
    } finally {
      // setLoading(false);
    }
  }

  // char count for name
  const nameCharCount = form.name?.length || 0;

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
          paddingTop: "15px",
          paddingBottom: "15px",
          minHeight: "100vh"
        }}>
          <span style={{textAlign: "center"}} dangerouslySetInnerHTML={{ __html: (errorMessage || 'Loading ...').replace(/\n/g, "<br/><br />") }} />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ display: "flex", justifyContent: "center", paddingTop: "15px", paddingBottom: "15px" }}>
        <div className="form-container">
          <img
            src={`${process.env.PUBLIC_URL}/assets/logo.png`}
            alt="Krutsha Logo"
            style={{
              display: "block",
              margin: "0 auto 20px auto",
              width: "auto",
              height: 60
            }}
          />
          <h2 className="form-title">{form?.is_registered === "1" ? "Update Profile" : "Fill your details"}</h2>

          {errorMessage && <div className="error-message" style={{ marginBottom: 12 }}>
            <div dangerouslySetInnerHTML={{ __html: errorMessage.replace(/\n/g, "<br/>") }} />
          </div>}
          <form id="studentForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                maxLength={24}
              />
              <span className="char-counter pull-right">
                Characters: <span id="charCount">{nameCharCount}</span>/24
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="class">Select Class</label>
              <select id="class" name="class" value={form.class_id} onChange={handleChange}>
                <option value="">Choose a class...</option>
                {classList.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Select Subject</label>
              <select
                id="subject"
                name="subject"
                value={form.subject_id}
                onChange={handleChange}
                disabled={!form.class_id || loadingSubjects}
              >
                <option value="">
                  {loadingSubjects ? "Loading subjects..." : "Choose a subject..."}
                </option>
                {subjectList.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="chapter">Select Chapter</label>
              <select
                id="chapter"
                name="chapter"
                value={form.chapter_id}
                onChange={handleChange}
                disabled={!form.subject_id || loadingChapters}
              >
                <option value="">
                  {loadingChapters ? "Loading chapters..." : "Choose a chapter..."}
                </option>
                {chapterList.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.full_name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading
                ? 'Processing...'
                : form?.is_registered === 1
                  ? 'Update Details'
                  : 'Save Details'
              }
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserRegistration;