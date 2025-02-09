import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import './Blog.css'; // Fix CSS import path

// Import blog posts
import WelcomeToEvrmore from './posts/WelcomeToEvrmore';
import EvrmoreSocialCommerce from './posts/EvrmoreSocialCommerce';
import WalletBasedAuthEvrmore from './posts/WalletBasedAuthEvrmore';
import ExploringEvrmoreAssets from './posts/ExploringEvrmoreAssets';

const posts = [
  {
    title: 'Welcome to EVRMORE!',
    author: 'Manticore Technologies',
    date: 'August 24, 2024',
    summary: 'Learn about the EVRMORE blockchain, its features, and its advantages over other blockchains.',
    link: '/blog/WelcomeToEvrmore',
    component: WelcomeToEvrmore
  },
  {
    title: 'EVRMORE and the Future of Social Commerce',
    author: 'Manticore Technologies',
    date: 'August 27, 2024',
    summary: 'Discover how the EVRMORE Blockchain will revolutionize the future of social commerce.',
    link: '/blog/EvrmoreSocialCommerce',
    component: EvrmoreSocialCommerce
  },
  {
    title: 'Wallet-Based Authentication on EVRMORE',
    author: 'Manticore Technologies',
    date: 'September 29, 2024',
    summary: 'Learn how EVRMORE implements wallet-based authentication for secure transactions.',
    link: '/blog/WalletBasedAuthEvrmore',
    component: WalletBasedAuthEvrmore
  },
  {
    title: 'Exploring Evrmore Assets',
    author: 'Manticore Technologies',
    date: 'November 13, 2024',
    summary: 'Uncover the potential of Evrmore assets and how they redefine digital value and social commerce.',
    link: '/blog/ExploringEvrmoreAssets',
    component: ExploringEvrmoreAssets
  },
];

const BlogListing: React.FC = () => (
  <div className="blog-container">
    {posts.map((post) => (
      <NavLink key={post.link} to={post.link.replace('/blog/', '')} className="blog-card">
        <h2>{post.title}</h2>
        <p className="author">By {post.author} • {post.date}</p>
        <p className="summary">{post.summary}</p>
      </NavLink>
    ))}
  </div>
);

const BlogPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BlogListing />} />
      {posts.map((post) => (
        <Route
          key={post.link}
          path={post.link.replace('/blog/', '')}
          element={<post.component />}
        />
      ))}
    </Routes>
  );
};

export default BlogPage;
