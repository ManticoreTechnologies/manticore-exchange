import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogPage.css'; // Make sure to create and link this CSS file

const BlogPage: React.FC = () => {
  const posts = [
    {
      title: 'P2SH Asset Swap Tutorial',
      author: 'John Doe',
      date: 'April 25, 2024',
      summary: 'Learn how to execute a P2SH asset swap using the Evrmore platform.',
      link: '/blog/p2sh-asset-swap-tutorial'
    },
    {
      title: 'Understanding P2SH in Blockchain',
      author: 'Jane Smith',
      date: 'May 1, 2024',
      summary: 'A comprehensive guide to understanding P2SH in blockchain technology.',
      link: '/blog/understanding-p2sh-in-blockchain'
    },
    {
      title: 'Using Evr Crypto Assets for Banks',
      author: 'Alice Johnson',
      date: 'May 5, 2024',
      summary: 'How banks can leverage Evr crypto assets for secure and efficient transactions.',
      link: '/blog/evr-crypto-assets-for-banks'
    },
    {
      title: 'ZIP Compression and Encryption Techniques',
      author: 'Bob Brown',
      date: 'May 10, 2024',
      summary: 'Exploring advanced ZIP compression and encryption techniques for data security.',
      link: '/blog/zip-compression-encryption'
    },
    {
      title: 'Introduction to Split Learning',
      author: 'Carol White',
      date: 'May 15, 2024',
      summary: 'An introduction to split learning and its applications in AI and data privacy.',
      link: '/blog/introduction-to-split-learning'
    },
    {
      title: 'AI Graph Flows Explained',
      author: 'David Green',
      date: 'May 20, 2024',
      summary: 'Understanding AI graph flows and their impact on machine learning models.',
      link: '/blog/ai-graph-flows-explained'
    },
    {
      title: '.sli File Systems Overview',
      author: 'Eve Black',
      date: 'May 25, 2024',
      summary: 'An overview of .sli file systems and their benefits for data storage and management.',
      link: '/blog/sli-file-systems-overview'
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




