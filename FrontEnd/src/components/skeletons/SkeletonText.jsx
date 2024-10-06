import React from 'react';
import './skeleton.css';

const SkeletonText = ({ lines = 3, lineHeight = '1.2em', gap = '0.5em' }) => {
  return (
    <div>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="skeleton"
          style={{
            height: lineHeight,
            width: '100%',
            marginBottom: index < lines - 1 ? gap : 0,
          }}
        ></div>
      ))}
    </div>
  );
};

export default SkeletonText;