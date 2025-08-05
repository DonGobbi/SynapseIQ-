'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface StyledMarkdownProps {
  content: string;
}

const StyledMarkdown: React.FC<StyledMarkdownProps> = ({ content }) => {
  return (
    <div className="styled-markdown">
      <style jsx global>{`
        .styled-markdown h1,
        .styled-markdown h2,
        .styled-markdown h3,
        .styled-markdown h4,
        .styled-markdown h5,
        .styled-markdown h6 {
          color: #111 !important;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }
        
        .styled-markdown h1 {
          font-size: 2rem;
        }
        
        .styled-markdown h2 {
          font-size: 1.75rem;
        }
        
        .styled-markdown h3 {
          font-size: 1.5rem;
        }
        
        .styled-markdown p,
        .styled-markdown li,
        .styled-markdown blockquote,
        .styled-markdown strong,
        .styled-markdown em,
        .styled-markdown ul,
        .styled-markdown ol {
          color: #333 !important;
          margin-bottom: 1rem;
        }
        
        .styled-markdown a {
          color: #3182ce !important;
          text-decoration: underline;
        }
        
        .styled-markdown blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
        }
        
        .styled-markdown ul, .styled-markdown ol {
          padding-left: 1.5rem;
        }
        
        .styled-markdown li {
          margin-bottom: 0.5rem;
        }
        
        .styled-markdown code {
          background-color: #f1f1f1;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          color: #333 !important;
        }
      `}</style>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default StyledMarkdown;
