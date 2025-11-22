import './UserRegistration.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const VALIDATE_KEY_URL = 'https://krutsha.ireavaschool.in/validate-registration-key';
const UPDATE_USER_URL = 'https://krutsha.ireavaschool.in/update-user-details';
const GET_BOARD_LIST_URL = 'https://krutsha.ireavaschool.in/get-board-list';
const GET_CLASS_LIST_URL = 'https://krutsha.ireavaschool.in/get-class-list';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // form state (controlled inputs)
  const [form, setForm] = useState({
    id: null,
    board_id: "",
    class_id: "",
    name: "",
    phone_number: "",
    is_registered: 0,
    brand_number: null
  });

  // dropdown data states
  const [boardList, setBoardList] = useState([]);
  const [classList, setClassList] = useState([]);

  // fetch class list
  async function fetchBoardList() {
    try {
      const { data } = await axios.get(GET_BOARD_LIST_URL);
      if (data && data.success && data.data) {
        setBoardList(data.data);
      }
    } catch (error) {
      console.error("Error fetching board list:", error);
    }
  }

  // fetch class list
  async function fetchClassList(boardId = null) {
    try {
      let URL = GET_CLASS_LIST_URL;
      if(boardId){
        URL = `${GET_CLASS_LIST_URL}?board_id=${boardId}`;
      }
      const { data } = await axios.get(URL);
      if (data && data.success && data.data) {
        setClassList(data.data);
      }
    } catch (error) {
      console.error("Error fetching class list:", error);
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
        board_id: user.board_id ?? "",
        class_id: user.class_id ?? "",
        //subject_id: user.subject_id ?? "",
        //chapter_id: user.chapter_id ?? "",
        name: user.name ?? "",
        phone_number: user.phone_number,
        is_registered: user.is_registered ?? 0,
        brand_number: user.brand_number ?? null
      };

      setForm(newForm);

      // fetch dependent dropdown data if values are present
      // if (newForm.class_id) {
      //   await fetchSubjectList(newForm.class_id);

      //   if (newForm.subject_id) {
      //     await fetchChapterList(newForm.class_id, newForm.subject_id);
      //   }
      // }

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
    fetchBoardList();
    fetchClassList();
    validateKey(key);
    // setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, navigate]);

  const key = searchParams.get('key');
  if (!key) return null;

  // handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'board') {
      setForm((s) => ({
        ...s,
        board_id: value,
        class_id: "",
      }));

      // clear dependent dropdowns
      setClassList([]);

      // fetch subjects for new class
      if (value) {
        fetchClassList(value);
      }

    }
    else if (name === 'class') {
      setForm((s) => ({
        ...s,
        class_id: value,
      }));

    } 
    else if (name === 'name') {
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
    if (!form.name || !form.board_id || !form.class_id) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    // payload - adapt to backend expected keys
    const payload = {
      id: form.id,
      board_id: parseInt(form.board_id),
      class_id: parseInt(form.class_id),
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
              <label htmlFor="board">Select Board</label>
              <select id="board" name="board" value={form.board_id} onChange={handleChange}>
                <option value="">Choose a board...</option>
                {boardList.map((boardItem) => (
                  <option key={boardItem.id} value={boardItem.id}>
                    {boardItem.title}
                  </option>
                ))}
              </select>
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

            {/* <div className="form-group">
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
            </div> */}

            {/* <div className="form-group">
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
            </div> */}
            {
              form?.is_registered !== "1" && <p>By signing up, you acknowledge and agree to Krutsha's
                                              <a href="/terms-and-conditions" target="_blank">Terms & Conditions</a>
                                              and
                                              <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                                              .
                                            </p>
            }

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