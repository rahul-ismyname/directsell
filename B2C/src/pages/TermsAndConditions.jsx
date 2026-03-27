import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="terms-page fade-in" style={{ padding: '120px 0 80px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 600, marginBottom: '24px', letterSpacing: '-0.02em', color: 'var(--primary-blue)' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '64px', lineHeight: 1.6 }}>
          Last Updated: March 27, 2026. Please read these terms carefully before participating in any manufacturing pool.
        </p>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>1. Platform Role & Identity</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '16px' }}>
            <strong>DirectBuyer (the "Platform")</strong> is a technology service provider that facilitates collective procurement. We act as a bridge connecting individual buyers ("Collectors") directly to manufacturers and large-scale suppliers ("Giants").
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-main)' }}>
            <strong>DirectBuyer is NOT a retailer, seller, or manufacturer.</strong> We do not take title to products, we do not store inventory, and we are not a party to the actual sales contract between the Buyer and the Supplier.
          </p>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>2. Limitation of Liability & Quality Disclaimer</h2>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255, 59, 48, 0.05)', borderRadius: '16px', border: '1px solid rgba(255, 59, 48, 0.1)', marginBottom: '16px' }}>
            <p style={{ fontWeight: 600, color: 'var(--system-red)', marginBottom: '12px' }}>CRITICAL DISCLAIMER:</p>
            <p style={{ lineHeight: 1.7, color: 'var(--text-main)', fontSize: '15px' }}>
              DirectBuyer assumes <strong>ZERO RESPONSIBILITY</strong> for the quality, safety, legality, or fitness for purpose of any product listed on the Platform. All manufacturing specifications and quality assurances are provided solely by the Supplier. Any disputes regarding manufacturing defects, non-conformance, or quality issues must be resolved directly with the Supplier.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>3. Collective Fulfillment (MOQ)</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '16px' }}>
            All orders on the Platform are contingent upon reaching the <strong>Minimum Order Quantity (MOQ)</strong> defined by the Supplier. 
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
            <li>If a pool fails to reach 100% capacity within the defined timeframe, the batch will be canceled and all escrowed funds will be returned to the buyers.</li>
            <li>Manufacturing only begins AFTER the pool is fully funded and verified.</li>
            <li>Timeline estimates (4-8 weeks) are non-binding and subject to global supply chain conditions.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>4. Escrow & Payment Protocol</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text-main)' }}>
            Payments are held in a secure **Digital Escrow Hub**. Funds are only released to the Supplier once the "Batch Shipped" status is verified through our logistics network or third-party audit partners. DirectBuyer reserves the right to withhold funds if a Supplier is found to be in violation of these terms.
          </p>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>5. User Conduct & Reporting</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text-main)' }}>
            Buyers are encouraged to use the **Report/Rate** system to maintain platform integrity. Malicious reporting or fraudulent behavior by buyers or sellers will result in permanent suspension of the account and forfeiture of any pending settlements.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '48px', marginTop: '64px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center' }}>
            By using DirectBuyer, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
