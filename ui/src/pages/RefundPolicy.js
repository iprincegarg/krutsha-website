import React from 'react';
import './PageStyles.css';

const RefundPolicy = () => {
  return (
    <div className="page-container">
      <h1>Refund Policy</h1>
      <p>
        If you are not satisfied with your purchase, we offer refunds subject to the following conditions.
      </p>
      <h2>1. Eligibility for Refunds</h2>
      <p>
        Refunds are available within 14 days of purchase for unused products.
      </p>
      <h2>2. Process</h2>
      <p>
        To request a refund, please contact our customer service with proof of purchase.
      </p>
      <h2>3. Exceptions</h2>
      <p>
        Certain items may not be eligible for refunds, including digital downloads and services already rendered.
      </p>
    </div>
  );
};

export default RefundPolicy;
