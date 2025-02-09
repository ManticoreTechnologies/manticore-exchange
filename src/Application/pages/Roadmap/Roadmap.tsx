// src/pages/Roadmap.tsx


import React, { useEffect } from "react";
import "./Roadmap.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faWallet, faChartLine, faLeaf } from '@fortawesome/free-solid-svg-icons';

const Roadmap: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll('.roadmap-section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="roadmap-container">
      <h1>Asset Exchange Project Roadmap</h1>

      <section className="roadmap-section">
        <h2>
          <FontAwesomeIcon icon={faRocket} className="section-icon" />
          Phase 1: Initial Launch
        </h2>
        <ul>
          <li><strong>Asset Exchange (Swaps):</strong> Enable users to exchange various crypto assets. Provide a user-friendly interface for seamless asset swaps.</li>
          <li><strong>View Assets:</strong> Allow users to view their current holdings and asset balances. Include support for multiple cryptocurrencies.</li>
          <li><strong>View Transactions:</strong> Display a detailed history of all transactions. Include filters and search functionality for easy navigation.</li>
          <li><strong>Make Transactions:</strong> Enable users to send and receive crypto assets. Implement secure and efficient transaction processing.</li>
        </ul>
      </section>

      <section className="roadmap-section">
        <h2>
          <FontAwesomeIcon icon={faWallet} className="section-icon" />
          Phase 2: Wallet Integration
        </h2>
        <p>Current Development Focus:</p>
        <ul>
          <li><strong>Full-Featured Wallets:</strong> Develop wallets that integrate with the Manticore asset exchange and EVRmore blockchain. Ensure compatibility and seamless integration with the exchange platform.</li>
          <li><strong>Wallet Availability:</strong> 
            <ul>
              <li><strong>Chrome Extension:</strong> Develop a browser extension for easy access and management of wallets.</li>
              <li><strong>Mobile App:</strong> Create a mobile application for both iOS and Android platforms to manage wallets on the go.</li>
              <li><strong>Desktop App:</strong> Develop a desktop application for comprehensive wallet management on Windows, macOS, and Linux.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="roadmap-section">
        <h2>
          <FontAwesomeIcon icon={faChartLine} className="section-icon" />
          Phase 3: Advanced Asset Analytics
        </h2>
        <p>Upcoming Development Focus:</p>
        <ul>
          <li><strong>Data Collection and Aggregation:</strong> Collect and aggregate data from various sources to provide comprehensive asset analytics. Ensure data accuracy and real-time updates.</li>
          <li><strong>Analytics Features:</strong> Provide advanced analytics tools for users to analyze their asset performance. Include features such as historical data analysis, trend analysis, and predictive modeling.</li>
          <li><strong>User Interface:</strong> Design an intuitive and user-friendly interface for analytics tools. Ensure that analytics data is presented clearly and can be easily interpreted by users.</li>
          <li><strong>Reporting and Insights:</strong> Generate detailed reports and insights based on asset analytics. Allow users to customize and export reports for their needs.</li>
        </ul>
      </section>

      <section className="roadmap-section">
        <h2>
          <FontAwesomeIcon icon={faLeaf} className="section-icon" />
          Phase 4: Ecosystem Development
        </h2>
        <p>Final Major Milestone:</p>
        <ul>
          <li><strong>Suite of Products Built on EVR Assets:</strong> Develop a range of products and services leveraging EVR assets. Ensure these products provide significant value and utility to users.</li>
          <li><strong>Third-Party App Ecosystem:</strong> Enable third-party developers to create applications that benefit from EVR assets. Provide robust APIs and developer tools to support the integration of EVR assets.</li>
          <li><strong>Partnerships and Collaborations:</strong> Establish partnerships with other companies and developers to expand the ecosystem. Promote collaboration and innovation within the community to drive the adoption of EVR assets.</li>
          <li><strong>Continuous Improvement:</strong> Continuously improve and expand the Manticore asset exchange and related products. Gather user feedback and implement updates to meet evolving needs and market trends.</li>
        </ul>
      </section>
    </div>
  );
};

export default Roadmap;
