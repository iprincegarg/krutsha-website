import { useEffect, useState } from "react";
import "./AnswerPreview.css";
import { marked } from 'marked';

export default function AnswerPreview() {
    const [markdownHtml, setMarkdownHtml] = useState("");

    useEffect(()=>{
        const markdownString = `| Feature    | Description                    | Status |
|------------|--------------------------------|--------|
| Responsive | Works on all screen sizes      | ✅     |
| Borders    | Light and elegant              | ✅     |
| Style      | Clean, modern and professional | ✅     |

**How big are atoms?**  
Atoms are very small — they are smaller than anything that we can imagine or compare with. More than millions of atoms stacked together would make a layer barely as thick as this sheet of paper.`

        const html = marked.parse(markdownString);
        setMarkdownHtml(html);
    }, [])

    return (
        <div id="answer-preview">
            <div className="container">
                <div className="user-details">
                    <h2>Hi, Sumit</h2>
                    <p className="subject-details">Subject | Chapter | {new Date().toDateString()}</p>
                </div>
                <div id="preview" dangerouslySetInnerHTML={{ __html: markdownHtml }}></div>
            </div>
        </div>
    )
}