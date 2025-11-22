import { useEffect, useState, useRef, useLayoutEffect } from "react";
import "./AnswerPreview.css";
import { marked } from "marked";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Preserve single line breaks in markdown as <br /> tags (GitHub-flavored behavior)
// ADD this function before the component:
function parseMarkdown(markdown) {
  let html = markdown;

  // Convert bold text (between asterisks)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<strong>$1</strong>');

  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p style="margin-bottom: 1em;">');
  html = html.replace(/\n/g, '<br/>');

  // Convert unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul style="margin-bottom: 1em; padding-left: 1.5rem;">$1</ul>');

  // Convert ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Wrap in paragraph tags
  html = '<p style="margin-bottom: 1em;">' + html + '</p>';

  // Clean up multiple paragraph tags
  html = html.replace(/<\/p><p style="margin-bottom: 1em;"><p style="margin-bottom: 1em;">/g, '</p><p style="margin-bottom: 1em;">');
  html = html.replace(/<\/p><\/p>/g, '</p>');

  return html;
}

export default function AnswerPreview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const VALIDATE_KEY_URL =
    "https://krutsha.ireavaschool.in/validate-answer-preview-key";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({});
  const [skimcards, setSkimcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  // Use refs for touch coordinates to avoid re-renders and stale state in handlers
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  // refs to measure content height so card height can adapt to content
  const frontContentRef = useRef(null);
  const backContentRef = useRef(null);
  const skimcardRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(null);
  const [skimcardHeight, setSkimcardHeight] = useState(0);

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

  // 🔹 Parse markdown and split into front/back of cards
  function processMarkdown(markdownText) {
    // Split by "---" to get individual skimcards
    const sections = markdownText.split(/\n---\n/);
    const cards = [];

    sections.forEach((section) => {
      // Extract skimcard number
      const numMatch = section.match(/\*Skimcard\s*(\d+)\*/i);
      if (!numMatch) return;

      const num = numMatch[1];

      // Split at "Can you answer below questions?"
      const parts = section.split(/\*Can you answer below questions\?\*/i);

      if (parts.length >= 2) {
        // Front: Everything before questions
        const frontContent = parts[0].trim();

        // Back: Questions part
        const backContent = parts[1].trim();

        cards.push({
          num,
          id: `skimcard-${num}`,
          front: parseMarkdown(frontContent),
          back: parseMarkdown("**Questions**\n\n" + backContent)
        });
      }
    });

    console.log("Parsed skimcards:", cards);
    setSkimcards(cards);
  }

  useEffect(() => {
    const key = searchParams.get('key');
    if (!key) {
      navigate('/', { replace: true });
      return;
    }
    validateKey(key);
  }, [searchParams, navigate]);

  // Measure front/back content and set the card height to the max so the card
  // container grows with content instead of having internal scroll.
  useLayoutEffect(() => {
    function updateHeight() {
      const frontH = frontContentRef.current?.scrollHeight || 0;
      const backH = backContentRef.current?.scrollHeight || 0;
      const skimH = skimcardRef.current?.offsetHeight || 0;
      const padding = 48; // approximate header+padding space
      const max = Math.max(frontH, backH, 240) + padding;
      setCardHeight(max);
      setSkimcardHeight(skimH);
    }

    updateHeight();

    const ro = new ResizeObserver(() => updateHeight());
    if (frontContentRef.current) ro.observe(frontContentRef.current);
    if (backContentRef.current) ro.observe(backContentRef.current);
    if (skimcardRef.current) ro.observe(skimcardRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [currentCardIndex, skimcards]);

  const handleCardClick = () => {
    if (!isDragging) {
      setIsFlipped(!isFlipped);
    }
  };

  const goToNextCard = () => {
    if (currentCardIndex < skimcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchEndX.current = t.clientX;
    touchEndY.current = t.clientY;
    setIsDragging(false);
  };

  const onTouchMove = (e) => {
    const t = e.touches[0];
    const currentY = t.clientY;
    touchEndY.current = currentY;
    const deltaY = currentY - touchStartY.current;
    const deltaX = t.clientX - touchStartX.current;

    // Only treat as vertical drag if vertical movement sufficiently dominates horizontal
    if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
      e.preventDefault(); // ✅ Prevent native scroll during valid swipe
      setIsDragging(true);
      setDragOffset(deltaY);
    }
  };

  const onTouchEnd = () => {
    const deltaY = touchEndY.current - touchStartY.current;
    const deltaX = touchEndX.current - touchStartX.current;
    const threshold = 0;

    // Only consider vertical swipes when vertical movement sufficiently dominates horizontal
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
      if (deltaY < -threshold && currentCardIndex < skimcards.length - 1) {
        goToNextCard(); // swipe up → next card
      } else if (deltaY > threshold && currentCardIndex > 0) {
        goToPrevCard(); // swipe down → previous card
      }
    }

    setDragOffset(0);
    setIsDragging(false);
  };


  const onMouseDown = (e) => {
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY || 0;
    touchEndX.current = e.clientX;
    touchEndY.current = e.clientY || 0;
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (e.buttons !== 1) return; // ✅ Only track if mouse button is pressed

    const currentY = e.clientY || 0;
    touchEndY.current = currentY;
    const deltaY = currentY - touchStartY.current;
    const deltaX = e.clientX - touchStartX.current;

    if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
      e.preventDefault();
      setIsDragging(true);
      setDragOffset(deltaY);
    }
  };

  const onMouseUp = () => {
    const deltaY = touchEndY.current - touchStartY.current;
    const deltaX = touchEndX.current - touchStartX.current;
    const threshold = 40;

    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
      if (deltaY < -threshold && currentCardIndex < skimcards.length - 1) {
        goToNextCard(); // swipe up → next card
      } else if (deltaY > threshold && currentCardIndex > 0) {
        goToPrevCard(); // swipe down → previous card
      }
    }

    setDragOffset(0);
    setIsDragging(false);
  };


  const onMouseLeave = () => {
    if (isDragging) {
      setDragOffset(0);
      setIsDragging(false);
      // reset refs used for tracking
      touchStartX.current = 0;
      touchStartY.current = 0;
      touchEndX.current = 0;
      touchEndY.current = 0;
    }
  };

  return (
    <div id="answer-preview">
      <div className="container-fluid">
        {loading ? (
          <p style={{ textAlign: "center", margin: "auto", color: '#4b5563' }}>Loading ....</p>
        ) : message ? (
          <p style={{ textAlign: "center", margin: "auto", color: '#dc2626' }}>{message}</p>
        ) : (
          <>
            <div className="user-details" style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                {userData?.type?.toUpperCase()}
              </h2>
              <p className="subject-details" style={{ color: '#4b5563' }}>
                {userData?.class_name} | {userData?.subject_name} |{" "}
                {userData?.chapter_name}
              </p>
            </div>

            {skimcards && skimcards.length > 0 && (
              <>
                {/* Card Container */}
                <div className="card-stage">
                  {/* Swipe instruction overlay */}
                  {currentCardIndex === 0 && !isDragging && (
                    <div className="swipe-overlay">👆 Tap to flip • ☝️👆 Swipe up/down to navigate</div>
                  )}


                  {/* Card with swipe effect */}
                  <div
                    className={`card-drag-wrapper ${isDragging ? 'dragging' : ''}`}  // ✅ New version with dynamic class
                    style={{
                      transform: `translateY(${dragOffset}px)`,
                      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                      opacity: isDragging ? 0.8 : 1,
                      cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onClick={handleCardClick}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseLeave}
                  >
                    <div
                      className="skimcard-3d"
                      style={{
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                        height: cardHeight ? `${cardHeight}px` : 'auto'
                      }}
                    >
                      {/* Front of Card */}
                      <div className="card card-front">
                        <div className="card-header">
                          <span className="card-badge">Skimcard {skimcards[currentCardIndex].num}</span>
                          <span className="card-action">Tap to flip</span>
                        </div>
                        <div className="card-body" ref={frontContentRef} dangerouslySetInnerHTML={{ __html: skimcards[currentCardIndex].front }} />
                      </div>

                      {/* Back of Card */}
                      <div className="card card-back">
                        <div className="card-header card-header-back">
                          <span className="card-badge card-badge-light">Questions</span>
                          <span className="card-action card-action-back">Tap to flip back</span>
                        </div>
                        <div className="card-body card-body-back" ref={backContentRef} dangerouslySetInnerHTML={{ __html: skimcards[currentCardIndex].back }} />
                      </div>
                    </div>
                  </div>

                  {/* Swipe indicator arrows */}
                  {isDragging && (
                    <>
                      {dragOffset < -50 && currentCardIndex < skimcards.length - 1 && (
                        <div style={{ position: 'absolute', left: '50%', top: '0.5rem', transform: 'translateX(-50%)', color: '#4f46e5', fontSize: '2.25rem', animation: 'bounce 1s infinite', pointerEvents: 'none' }}>
                          ▲
                        </div>
                      )}
                      {dragOffset > 50 && currentCardIndex > 0 && (
                        <div style={{ position: 'absolute', left: '50%', bottom: '0.5rem', transform: 'translateX(-50%)', color: '#4f46e5', fontSize: '2.25rem', animation: 'bounce 1s infinite', pointerEvents: 'none' }}>
                          ▼
                        </div>
                      )}
                    </>
                  )}
                  {/* Progress Indicator */}
                  <div className="progress-indicator">
                    {skimcards.map((card, index) => (
                      <button
                        key={card.id}
                        onClick={() => {
                          setCurrentCardIndex(index);
                          setIsFlipped(false);
                        }}
                        className={`progress-btn ${index === currentCardIndex ? 'active' : ''}`}
                      >
                        {card.num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counter */}
                {/* <p className="card-counter">Card {currentCardIndex + 1} of {skimcards.length}</p> */}

                {/* Instructions */}
                {/* <div className="instructions-box">
                  <p>
                    <span className="hint-title">💡 How to use:</span><br/>
                    <span className="hint-body">
                      <strong>Tap</strong> the card to see questions
<strong> • Swipe left/right</strong> to navigate
                      <strong> • Click numbers</strong> to jump to any card
                    </span>
                  </p>
                </div> */}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}