import React from 'react';
import { NavLink } from 'react-router-dom';
import './BlogPage.css'; // Make sure to cr

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
      summary: 'Discover how the EVRMORE Blockchain will revolutionize the future of social commerce.',
      link: '/blog/EvrmoreSocialCommerce',
    },
    {
      title: 'Wallet-Based Authentication on EVRMORE',
      author: 'Manticore Technologies',
      date: 'September 29, 2024',
      summary: 'Learn how EVRMORE implements wallet-based authentication for secure transactions.',
      link: '/blog/WalletBasedAuthEvrmore',
    },
    {
      title: 'Exploring Evrmore Assets',
      author: 'Manticore Technologies',
      date: 'November 13, 2024',
      summary: 'Uncover the potential of Evrmore assets and how they redefine digital value and social commerce.',
      link: '/blog/ExploringEvrmoreAssets',
    },
    {
      title: 'The Greatest Bitcoin Explainer Ever Written',
      author: 'Manticore Technologies',
      date: 'November 13, 2024',
      summary: 'Break down the essence of Bitcoin and explore what makes it revolutionary.',
      link: '/blog/BitcoinExplainer',
    },
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

