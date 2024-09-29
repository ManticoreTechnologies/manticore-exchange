// src/components/RegisterUserModal.tsx

import React from 'react';
import Modal from 'react-modal';
import RegisterUser from './RegisterUser';
import '../styles/RegisterUserModal.css'; // Ensure to create this file for styling the modal

Modal.setAppElement('#root'); // This is important for screen readers

interface RegisterUserModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const RegisterUserModal: React.FC<RegisterUserModalProps> = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Register User"
      className="register-user-modal"
      overlayClassName="register-user-overlay"
    >
      <button className="close-button" onClick={onRequestClose}>Close</button>
      <RegisterUser />
    </Modal>
  );
};

export default RegisterUserModal;

