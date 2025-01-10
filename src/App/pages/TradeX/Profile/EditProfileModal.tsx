import  { useState } from 'react';
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
        <div className="edit-profile-modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Edit Profile</h2>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                
                <label>Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

                <label>Profile Picture IPFS Hash</label>
                <input type="text" value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} />

                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default EditProfileModal;

