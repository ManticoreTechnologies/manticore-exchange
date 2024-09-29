import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import './BlogPost.css';

const MarkdownLoader: React.FC = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/content.md')
      .then((response) => response.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
  );
};

export default MarkdownLoader;