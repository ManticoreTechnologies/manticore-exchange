import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface BlogPostLayoutProps {
  title: string;
  author: string;
  date: string;
  children: ReactNode;
}

const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({
  title,
  author,
  date,
  children
}) => {
  return (
    <div className="blog-container">
      <Link to="/blog" className="blog-back-button">← Back to Blog</Link>
      <header className="blog-header">
        <h1>{title}</h1>
        <p className="author">By {author} • {date}</p>
      </header>
      <div className="blog-content">
        <article className="blog-post">
          {children}
        </article>
      </div>
    </div>
  );
};

export default BlogPostLayout; 