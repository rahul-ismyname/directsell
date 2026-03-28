import React, { useState } from 'react';
import { useProduct } from '../context/ProductContext';

const ReviewActionModal = ({ isOpen, onClose, order }) => {
  const { submitReview, submitReport, distributor } = useProduct();
  const [tab, setTab] = useState('rate'); // 'rate', 'report', 'distributor'
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reason, setReason] = useState('Quality issue');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleRate = async (e) => {
    e.preventDefault();
    await submitReview({
      sellerId: order.supplier_id,
      productId: order.product_id,
      rating,
      comment
    });
    onClose();
  };

  const handleDistributorRate = async (e) => {
    e.preventDefault();
    await distributor.submitReview({
      distributorId: order.distributor_id,
      productId: order.product_id,
      rating,
      comment,
      isAnonymous
    });
    onClose();
  };

  const handleReport = async (e) => {
    e.preventDefault();
    await submitReport({
      sellerId: order.supplier_id,
      reason,
      description
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '440px', padding: '32px', backgroundColor: 'white', borderRadius: '24px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', overflowX: 'auto' }}>
           <button onClick={() => setTab('rate')} style={{ padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'rate' ? '2px solid var(--accent-blue)' : 'none', color: tab === 'rate' ? 'var(--accent-blue)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Rate Seller</button>
           {order.distributor_id && (
             <button onClick={() => setTab('distributor')} style={{ padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'distributor' ? '2px solid var(--primary-blue)' : 'none', color: tab === 'distributor' ? 'var(--primary-blue)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Rate Distributor</button>
           )}
           <button onClick={() => setTab('report')} style={{ padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'report' ? '2px solid var(--system-red)' : 'none', color: tab === 'report' ? 'var(--system-red)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Report Issue</button>
        </div>

        {tab === 'rate' && (
          <form onSubmit={handleRate}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Rate your experience with {order.name}</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: star <= rating ? '#FFD700' : '#E0E0E0' }}>★</button>
              ))}
            </div>
            <textarea placeholder="Write a comment..." value={comment} onChange={e => setComment(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', minHeight: '100px', marginBottom: '16px' }} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Submit Review</button>
          </form>
        )}

        {tab === 'distributor' && (
          <form onSubmit={handleDistributorRate}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Rate Distribution Leader</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>How was the local pickup experience for {order.name}?</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: star <= rating ? '#FFD700' : '#E0E0E0' }}>★</button>
              ))}
            </div>
            <textarea placeholder="Was the pickup smooth? Was the distributor professional?" value={comment} onChange={e => setComment(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', minHeight: '100px', marginBottom: '16px' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
               <input type="checkbox" id="anon" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
               <label htmlFor="anon" style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}>Submit Anonymously</label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', backgroundColor: 'var(--primary-blue)' }}>Submit Distributor Review</button>
          </form>
        )}

        {tab === 'report' && (
          <form onSubmit={handleReport}>
             <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--system-red)' }}>Report Seller</h3>
             <select value={reason} onChange={e => setReason(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', marginBottom: '16px' }}>
                <option value="Quality issue">Quality issue</option>
                <option value="Damaged product">Damaged product</option>
                <option value="Did not arrive">Did not arrive</option>
                <option value="Counterfeit">Counterfeit</option>
                <option value="Other">Other</option>
             </select>
             <textarea placeholder="Describe the issue..." value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', minHeight: '100px', marginBottom: '24px' }} />
             <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', backgroundColor: 'var(--system-red)' }}>Submit Report</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewActionModal;
