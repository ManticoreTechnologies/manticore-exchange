import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogPage.css'; // Make sure to create and link this CSS file

const BlogPage: React.FC = () => {
  const posts = [
    {
      title: 'Welcome to EVRMORE!',
      author: 'Manticore Technologies',
      date: 'August 24, 2024',
      summary: 'Learn about the EVRMORE blockchain, its features, and its advantages over other blockchains.',
      link: '/blog/evrmore-intro',
    },
    // Add more posts as needed
  ];

  return (
    <div className="blog-container">
      <div className="blog-buttons">
        <Link to="/blog/for-business" className="blog-button">For Business</Link>
        <Link to="/blog/for-developer" className="blog-button">For Developer</Link>
        <Link to="/blog/for-individual" className="blog-button">For Individual</Link>
      </div>
      {posts.map((post, index) => (
        <a href={post.link} key={index} className="blog-card">
          <h2>{post.title}</h2>
          <p className="author">By {post.author} on {post.date}</p>
          <p className="summary">{post.summary}</p>
        </a>
      ))}
    </div>
  );
};

export default BlogPage;




