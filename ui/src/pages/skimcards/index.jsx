import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './index.css';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const VALIDATE_KEY_URL = 'https://krutsha.ireavaschool.in/validate-answer-preview-key';
const GET_PUBLISHER_LIST_URL = 'https://krutsha.ireavaschool.in/get-publishers-list';
const GET_PUBLISHER_CLASS_LIST_URL = 'https://krutsha.ireavaschool.in/get-publisher-class-list';
const GET_SUBJECT_LIST_URL = 'https://krutsha.ireavaschool.in/get-subject-list';
const GET_CHAPTER_LIST_URL = 'https://krutsha.ireavaschool.in/get-chapter-list';
const GET_SKIMCARDS_URL = 'https://krutsha.ireavaschool.in/get-skimcards-by-chapter-id';

const Skimcards = ({ grade = '11', subject = 'Physics', chapter = '1' }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const frontRef = useRef(null);
    const skimRef = useRef(null);
    const containerRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userData, setUserData] = useState({});
    const [publisherList, setPublisherList] = useState([]);
    const [publisherClassList, setPublisherClassList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [chapterList, setChapterList] = useState([]);
    const [notesContent, setNotesContent] = useState("");
    const [selectedClass, setSelectedClass] = useState({});
    const [answerType, setAnswerType] = useState('notes');
    const [form, setForm] = useState({
        id: null,
        publisher_id: "",
        class_id: "",
        subject_id: "",
        chapter_id: "",
        name: "",
        phone_number: "",
        is_registered: 0,
        brand_number: null
    });

    // validateKey -> fetch decode-key and prefills form
    async function validateKey(key) {
        if (!key) return null;
        setLoading(true);
        setErrorMessage("");
        try {
            const { data } = await axios.get(`${VALIDATE_KEY_URL}?key=${encodeURIComponent(key)}`);
            console.log("after key validate", data);

            if (!data || !data.success) {
                const err = data?.message || 'Invalid or expired key';
                setErrorMessage(err);
                return;
            }

            console.log("after key validate 2");

            const user = data.data || {};

            console.log("user:: ", user);

            const newForm = {
                id: user.id ?? null,
                publisher_id: user.publisher_id ?? "",
                class_id: user.class_id ?? "",
                subject_id: user.subject_id ?? "",
                chapter_id: user.chapter_id ?? "",
                name: user.name ?? "",
                phone_number: user.phone_number,
                is_registered: user.is_registered ?? 0,
                brand_number: user.brand_number ?? null
            };
            setAnswerType(user.token_type || 'notes');
            await fetchPublisherClassList(newForm.publisher_id);
            await fetchSubjectList(newForm.class_id);
            if (newForm.class_id) {
                fetchSubjectList(newForm.class_id);
            }
            if (newForm.class_id && newForm.subject_id) {
                fetchChapterList(newForm.class_id, newForm.subject_id);
            }
            if (newForm.chapter_id) {
                fetchNotes(newForm.chapter_id);
            }

            setForm(newForm);

        } catch (error) {
            console.error("error in validate key:: ", error);
            setErrorMessage(error?.message || "Something went wrong while validating key");
        } finally {
            setLoading(false);
        }
    }

    async function fetchPublisherList() {
        try {
            const { data } = await axios.get(GET_PUBLISHER_LIST_URL);
            if (data && data.success && data.data) {
                setPublisherList(data.data);
            }
        } catch (error) {
            console.error("Error fetching publisher list:", error);
        }
    }

    async function fetchPublisherClassList(publisherId) {
        try {
            const { data } = await axios.get(GET_PUBLISHER_CLASS_LIST_URL, { params: { publisherId } });
            if (data && data.success && data.data) {
                setPublisherClassList(data.data);
            }
        } catch (error) {
            console.error("Error fetching publisher list:", error);
        }
    }

    async function fetchSubjectList(classId) {
        try {
            const { data } = await axios.get(GET_SUBJECT_LIST_URL, { params: { class_id: classId } });
            if (data && data.success && data.data) {
                setSubjectList(data.data);
            }
        } catch (error) {
            console.error("Error fetching subject list:", error);
        }
    }

    async function fetchChapterList(classId, subjectId) {
        try {
            const { data } = await axios.get(GET_CHAPTER_LIST_URL, { params: { class_id: classId, subject_id: subjectId } });
            if (data && data.success && data.data) {
                setChapterList(data.data);
            }
        } catch (error) {
            console.error("Error fetching chapter list:", error);
        }
    }

    async function fetchNotes(chapterId) {
        try {
            const { data } = await axios.get(GET_SKIMCARDS_URL, { params: { chapter_id: chapterId } });
            if (data && data.success && data.data) {
                if (data.data.length == 0) {
                    setNotesContent(data.message);
                }
                else {
                    setNotesContent(data.data.content);
                }
            } else {
                console.log("data.message:: ", data.message);

                setNotesContent(data.message);
            }
        } catch (error) {
            console.error("Error fetching skimcards:", error);
            setNotesContent("");
        }
    }

    // handle input changes
    function handleChange(e) {
        const { name, value } = e.target;

        setNotesContent("");

        if (name === 'publisher') {
            setForm((s) => ({
                ...s,
                publisher_id: value,
                class_id: "",
                subject_id: "",
                chapter_id: "",
            }));

            // clear dependent dropdowns
            setPublisherClassList([]);
            setSubjectList([]);
            setChapterList([]);

            if (value) fetchPublisherClassList(value);

        }
        else if (name === 'class') {
            setForm((s) => ({
                ...s,
                class_id: value,
                subject_id: "",
                chapter_id: "",
            }));

            setSubjectList([]);
            setChapterList([]);

            if (value) fetchSubjectList(value);

            let classSelected = publisherClassList.find((item) => item.id === value);
            setSelectedClass(classSelected);
        }
        else if (name === 'subject') {
            setForm((s) => ({
                ...s,
                subject_id: value,
                chapter_id: "",
            }));

            setChapterList([]);

            if (value) fetchChapterList(form.class_id, value);
        }
        else if (name === 'chapter') {
            setForm((s) => ({
                ...s,
                chapter_id: value,
            }));

            if (value) {
                fetchNotes(value);
            } else {
                setNotesContent("");
            }

        }
        else if (name === 'name') {
            // limit to 24 characters if you want
            const truncated = value.slice(0, 24);
            setForm((s) => ({ ...s, name: truncated }));
        } else {
            setForm((s) => ({ ...s, [name]: value }));
        }
    }


    // Markdown content (kept from the original file)


    // Ported parseMarkdown from the original HTML file
    function parseMarkdown(markdown) {
        let html = markdown;

        // Handle nested lists FIRST (before any newline processing)
        // eslint-disable-next-line
        html = html.replace(/^- (.+?)(?:\n  - (.+?))*$/gm, (match) => {
            const lines = match.split('\n');
            let listHtml = '<ul style="margin:0.5em 0;padding-left:1.5em;">';
            let inNestedList = false;

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('  - ')) {
                    if (!inNestedList) {
                        listHtml += '<ul style="margin:0.3em 0;padding-left:1.5em;">';
                        inNestedList = true;
                    }
                    listHtml += `<li style="margin:0.2em 0;">${lines[i].substring(4)}</li>`;

                    if (i === lines.length - 1 || !lines[i + 1] || !lines[i + 1].startsWith('  - ')) {
                        listHtml += '</ul>';
                        inNestedList = false;
                    }
                } else if (lines[i].startsWith('- ')) {
                    if (i > 0) {
                        listHtml += '</li>';
                    }
                    listHtml += `<li style="margin:0.3em 0;">${lines[i].substring(2)}`;
                }
            }

            listHtml += '</li></ul>';
            return listHtml;
        });

        // Preserve newlines after bold headings by marking them temporarily
        html = html.replace(/(\*[^*]+?\*)\n/g, '$1___NEWLINE___');

        // Bold text - convert *text* to <strong>
        html = html.replace(/\*([^*]+?)\*/g, '<strong>$1</strong>');

        // Restore marked newlines
        html = html.replace(/___NEWLINE___/g, '\n');

        // Paragraphs - handle double newlines first
        html = html.replace(/\n\n/g, '</p><p style="margin-bottom:0.5em;">');

        // Line breaks - add <br> for single newlines (but lists are already converted)
        html = html.replace(/\n/g, '<br>');

        // Wrap in paragraph tags
        html = '<p style="margin-bottom:0.5em;">' + html + '</p>';

        // Cleanup - remove paragraph tags around lists
        html = html.replace(/<p style="margin-bottom:0.5em;"><ul>/g, '<ul>');
        html = html.replace(/<\/ul><\/p>/g, '</ul>');

        // Remove any remaining <br> tags near list elements
        html = html.replace(/<br><\/li>/g, '</li>');
        html = html.replace(/<li[^>]*><br>/g, (match) => match.replace('<br>', ''));
        html = html.replace(/<br><ul/g, '<ul');
        html = html.replace(/<\/ul><br>/g, '</ul>');
        html = html.replace(/<\/li><br>/g, '</li>');

        return html;
    }

    useEffect(() => {
        setNotesContent("");
        const key = searchParams.get('key');
        if (!key) {
            navigate('/', { replace: true });
            return;
        }
        validateKey(key);

        fetchPublisherList();


    }, [])

    useEffect(() => {
        if (!frontRef.current) return;

        if (!notesContent) {
            frontRef.current.innerHTML = '<div style="text-align:center; padding: 20px;">Please select the publish year, class, subject, and chapter to access the skimcards.</div>';
        } else {
            const htmlContent = parseMarkdown(notesContent);
            frontRef.current.innerHTML = htmlContent;
        }

        function updateContainerHeight() {
            const frontEl = frontRef.current;
            const skimEl = skimRef.current;
            const containerEl = containerRef.current;
            if (!frontEl || !skimEl || !containerEl) return;

            const cardHeight = frontEl.offsetHeight + 60;
            skimEl.style.height = cardHeight + 'px';
            const totalHeight = cardHeight + 100;
            containerEl.style.minHeight = totalHeight + 'px';
        }

        // Small delay to allow fonts/images (if any) to settle
        const t = setTimeout(updateContainerHeight, 100);
        window.addEventListener('resize', updateContainerHeight);
        return () => {
            clearTimeout(t);
            window.removeEventListener('resize', updateContainerHeight);
        };
    }, [notesContent]);

    return (
        <div className="container-fluid" id="container" ref={containerRef}>
            <div className="filters-section">
                <div className="filter-group">
                    <label>Publisher</label>
                    <select name="publisher" onChange={handleChange} value={form.publisher_id}>
                        {
                            publisherList && publisherList.map((publisher) => <option key={publisher.id} value={publisher.id}>{publisher.title}</option>)
                        }
                    </select>
                </div>

                <div className="filter-group">
                    <label>Class</label>
                    <select name="class" onChange={handleChange} value={form.class_id}>
                        {
                            publisherClassList && publisherClassList.map((publisherClass) => <option key={publisherClass.id} value={publisherClass.id}>{publisherClass.title}</option>)
                        }
                    </select>
                </div>

                <div className="filter-group">
                    <label>Subject</label>
                    <select name="subject" onChange={handleChange} value={form.subject_id}>
                        <option value="">Select Subject</option>
                        {
                            subjectList && subjectList.map((subject) => <option key={subject.id} value={subject.id}>{subject.title}</option>)
                        }
                    </select>
                </div>

                <div className="filter-group">
                    <label>Chapter</label>
                    <select name="chapter" onChange={handleChange} value={form.chapter_id}>
                        <option value="">Select Chapter</option>
                        {
                            chapterList && chapterList.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)
                        }
                    </select>
                </div>
            </div>

            <div className="user-details">
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Skimcards</div>
                <div style={{ color: '#4b5563' }}>
                    {(() => {
                        const parts = [];
                        if (form.class_id) parts.push(`Class ${publisherClassList.find(i => i.id === form.class_id)?.title}`);
                        if (form.subject_id) parts.push(`Subject: ${subjectList.find(i => i.id === form.subject_id)?.title}`);
                        if (form.chapter_id) parts.push(`Chapter: ${chapterList.find(i => i.id === form.chapter_id)?.title}`);
                        return parts.length > 0 ? parts.join(' | ') : 'Select class, subject, and chapter';
                    })()}
                </div>
            </div>

            <div className="card-stage" id="cardStage">
                <div className="skimcard-3d" id="skimcard3d" ref={skimRef}>
                    <div className="card card-front">
                        <div className="card-body" id="frontContent" ref={frontRef}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skimcards;
