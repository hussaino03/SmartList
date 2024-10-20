import React, { useEffect } from 'react';

const LevelUpModal = ({ show, onClose, level }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className='modal-content elementToFadeInAndOut' id='level-up' style={{ display: 'block' }}>
      <p style={{ fontSize: '20px', color: 'black', margin: 'auto', textAlign: 'center', padding: '10px', fontWeight: 'bold' }}>
        Level up! You are now level {level}!
      </p>
    </div>
  );
};

export default LevelUpModal;