import React, { useState } from 'react';
import './SaveWorkflowModal.css';

const SaveWorkflowModal = ({ onClose, onSave,flowElements }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const updatedElements = flowElements.length > 0 && flowElements.map((element, index) => ({
    ...element,         // Spread the existing properties of the element
    position: index + 1 // Add position, starting from 1
}));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData,updatedElements);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Save your workflow</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name here"
              value={formData.name}
              style={{width: '90%'}}
              onChange={handleChange}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Write here.."
              value={formData.description}
              style={{width: '90%'}}
              onChange={handleChange}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-button" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveWorkflowModal; 