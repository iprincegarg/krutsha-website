import { useEffect, useState } from "react";
import "./AnswerPreview.css";
import { marked } from 'marked';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AnswerPreview() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const VALIDATE_KEY_URL = 'https://krutsha.ireavaschool.in/validate-answer-preview-key';
    const [markdownHtml, setMarkdownHtml] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [userData, setUserData] = useState({});


    async function validateKey(key) {
        if (!key) return null;
        try {
            setLoading(true);
            const { data } = await axios.get(`${VALIDATE_KEY_URL}?key=${encodeURIComponent(key)}`, {
                // withCredentials: true, // uncomment if backend uses cookies
            });

            console.log("data:: ", data);


            if (!data || !data.success) {
                setMessage(data.message);
                return;
            }

            // assume `data.data.data` contains user info (as in your existing code)
            const user = data.data || {};
            setUserData(user);
            console.log("user:: ", user);

            setMarkdownHtml(marked.parse(user?.content));

        } catch (error) {
            console.error("error in validate key:: ", error);
            // setLoading(false);
        } finally {
            setLoading(false);
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
        validateKey(key);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, navigate]);

//     useEffect(() => {
//         const markdownString = `| Feature    | Description                    | Status |
// |------------|--------------------------------|--------|
// | Responsive | Works on all screen sizes      | ✅     |
// | Borders    | Light and elegant              | ✅     |
// | Style      | Clean, modern and professional | ✅     |

// **How big are atoms?**  
// Atoms are very small — they are smaller than anything that we can imagine or compare with. More than millions of atoms stacked together would make a layer barely as thick as this sheet of paper.`

//         const html = marked.parse(markdownString);
//         setMarkdownHtml(html);
//     }, [])

    return (
        <div id="answer-preview">
            <div className="container">
                {
                    loading ?
                        <p style={{ textAlign: "center", margin: "auto" }}>Loading ....</p>
                        :
                        <>
                            {
                                message ?
                                    <p style={{textAlign: "center", margin: "auto"}} >{message}</p>
                                    :
                                    <>
                                        <div className="user-details">
                                            <h2>{userData?.type?.toUpperCase()}</h2>
                                            <p className="subject-details">{userData?.class_name} | {userData?.subject_name} | {userData?.chapter_name}</p>
                                        </div>
                                        <div id="preview" dangerouslySetInnerHTML={{ __html: markdownHtml }}></div>
                                    </>
                            }
                        </>
                }
            </div>
        </div>
    )
}