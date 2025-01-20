import { useState } from 'react';
import './EditProfileModal.css';

const EditProfileModal = ({ accountInfo, onSave, onClose }: { accountInfo: any, onSave: (updatedInfo: any) => void, onClose: () => void }) => {
    const [username, setUsername] = useState(accountInfo.friendly_name || '');
    const [bio, setBio] = useState(accountInfo.bio || '');
    const [ipfsHash, setIpfsHash] = useState(accountInfo.profile_ipfs || '');

    const handleSave = () => {
        const updatedInfo = {
            friendlyUsername: username,
            bio,
            profile_ipfs: ipfsHash
        };
        onSave(updatedInfo);
        onClose();
    };

    return (
        <div className="tradex-profile-modal">
            <div className="tradex-profile-modal__content">
                <button className="tradex-profile-modal__close-button" onClick={onClose}>×</button>
                <h2>Edit Profile</h2>
                <label className="tradex-profile-modal__label">Username</label>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="tradex-profile-modal__input"
                />
                
                <label className="tradex-profile-modal__label">Bio</label>
                <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    className="tradex-profile-modal__textarea"
                />

                <label className="tradex-profile-modal__label">Profile Picture IPFS Hash</label>
                <input 
                    type="text" 
                    value={ipfsHash} 
                    onChange={(e) => setIpfsHash(e.target.value)} 
                    className="tradex-profile-modal__input"
                />

                <button onClick={handleSave} className="tradex-profile-modal__button">Save</button>
                <button onClick={onClose} className="tradex-profile-modal__button">Cancel</button>
            </div>
        </div>
    );
};

export default EditProfileModal;

