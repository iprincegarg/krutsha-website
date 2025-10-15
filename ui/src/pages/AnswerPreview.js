import { useEffect, useState } from "react";
import "./AnswerPreview.css";
import { marked } from "marked";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AnswerPreview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const VALIDATE_KEY_URL =
    "https://krutsha.ireavaschool.in/validate-answer-preview-key";

  const [markdownHtml, setMarkdownHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({});
  const [skimcards, setSkimcards] = useState([]);
  const [activeSkimcard, setActiveSkimcard] = useState(null);

  // 🔹 Validate key and fetch markdown from backend
  async function validateKey(key) {
    if (!key) return null;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${VALIDATE_KEY_URL}?key=${encodeURIComponent(key)}`
      );

      if (!data || !data.success) {
        setMessage(data.message);
        return;
      }

      const user = data.data || {};
      setUserData(user);
      processMarkdown(user?.content || "");
    } catch (error) {
      console.error("error in validate key:: ", error);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Parse markdown, assign IDs to Skimcards, and build menu
  function processMarkdown(markdownText) {
    let rendered = marked.parse(markdownText);

    // Match <em>Skimcard 01</em>, <em>Skimcard 02</em>, etc. (after marked converts *text* to <em>)
    const regex = /<em>Skimcard\s*(\d+)<\/em>/gi;
    const ids = [];

    rendered = rendered.replace(regex, (match, num) => {
      const id = `skimcard-${num}`;
      ids.push({ num, id });
      return `<span class="skimcard-title" id="${id}"><em>Skimcard ${num}</em></span>`;
    });

    console.log("Skimcards found:", ids); // 🟢 DEBUG
    setSkimcards(ids);
    setMarkdownHtml(rendered);
  }

      useEffect(() => {
        const key = searchParams.get('key');
        if (!key) {
            // if key missing, redirect to home
            navigate('/', { replace: true });
            return;
        }

        // fetch class list first
        validateKey(key);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, navigate]);

  // 🔹 For local testing: fallback markdown if no API call
//   useEffect(() => {
//     const markdownString = `
// *Skimcard 01*
// *What Development Promises — Different People, Different Goalsdadfahdkuagsisdaijgdiagigdigaisgd*

// Development means different things...

// asdasdasdasd


// asdasd

// as
// a
// d
// asdasd

// asdasd



// dsasdad


// dsasd 

// adasd

// df

// dfsdf

// adsada

// asdasd

// asdasd


// asdasd

// asdasd





// ---

// *Skimcard 02*
// *Income and Other Goals*

// While getting a higher income is a common goal...


// ---

// *Skimcard 03*
// *Income and Other Goals*

// While getting a higher income is a common goal...


// *Skimcard 04*
// *Income and Other Goals*

// While getting a higher income is a common goal...

// `;
//     processMarkdown(markdownString);
//   }, []);

  // 🔹 Scroll to a Skimcard when menu button clicked
  const scrollToSkimcard = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="answer-preview">
      <div className="container-fluid">
        {loading ? (
          <p style={{ textAlign: "center", margin: "auto" }}>Loading ....</p>
        ) : message ? (
          <p style={{ textAlign: "center", margin: "auto" }}>{message}</p>
        ) : (
          <>
            <div className="user-details">
              <h2>{userData?.type?.toUpperCase()}</h2>
              <p className="subject-details">
                {userData?.class_name} | {userData?.subject_name} |{" "}
                {userData?.chapter_name}
              </p>
            </div>

            <div
              id="preview"
              dangerouslySetInnerHTML={{ __html: markdownHtml }}
            ></div>

            {/* 🔹 Sticky right menu */}
            {skimcards && skimcards.length > 0 && (
              <div className="skimcard-menu">
                {skimcards.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSkimcard(s.id)}
                    title={`Go to Skimcard ${s.num}`}
                  >
                    {s.num}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}