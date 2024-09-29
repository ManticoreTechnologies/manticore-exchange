import React from 'react';
import { NavLink } from 'react-router-dom';
import './BlogPage.css'; // Make sure to create and link this CSS file

const BlogPage: React.FC = () => {
  const posts = [
    {
      title: 'Welcome to EVRMORE!',
      author: 'Manticore Technologies',
      date: 'August 24, 2024',
      summary: 'Learn about the EVRMORE blockchain, its features, and its advantages over other blockchains.',
      link: '/blog/WelcomeToEvrmore',
    },
    {
      title: 'EVRMORE and the Future of Social Commerce',
      author: 'Manticore Technologies',
      date: 'August 27, 2024',
      summary: 'Discover how the EVRMORE Blockchain will revolutionize the f  uture of social commerce',
      link: '/blog/EvrmoreSocialCommerce',
    },
    {
      title: 'Wallet-Based Authentication on EVRMORE',
      author: 'Manticore Technologies',
      date: 'August 28, 2024',
      summary: 'Learn how to implement wallet-based authentication on the EVRMORE blockchain',
      link: '/blog/WalletBasedAuthEvrmore',
    }
    // Add more posts as needed
  ];

  return (
    <div className="blog-container">
      <div className="blog-buttons">
        
      </div>
      {posts.map((post, index) => (
        <NavLink to={post.link} key={index} className="blog-card">
          <h2>{post.title}</h2>
          <p className="author">By {post.author} on {post.date}</p>
          <p className="summary">{post.summary}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default BlogPage;

/*
<NavLink to="/blog/for-business" className="blog-button">For Business</NavLink>
<NavLink to="/blog/for-developer" className="blog-button">For Developer</NavLink>
<NavLink to="/blog/for-individual" className="blog-button">For Individual</NavLink>
*/

