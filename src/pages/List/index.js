import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SAMPLE_WORKFLOWS } from '../../data/sampleWorkflows';
import Pinned from '../../Assets/Img/pinned.png';
import UnPinned from '../../Assets/Img/Unpinned.png';
import './List.css';

const List = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [workflows, setWorkflows] = useState(SAMPLE_WORKFLOWS);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState(null);
  const [workflowToExecute, setWorkflowToExecute] = useState(null);

  const handlePinToggle = (workflowId, e) => {
    e.stopPropagation(); // Prevent row click when clicking pin
    setWorkflows(prevWorkflows =>
      prevWorkflows.map(workflow =>
        workflow.id === workflowId
          ? { ...workflow, pinned: !workflow.pinned }
          : workflow
      )
    );
  };

  const handleMoreClick = (e, workflowId) => {
    e.stopPropagation();
    setActiveTooltip(activeTooltip === workflowId ? null : workflowId);
  };

  const handleDeleteClick = (e, workflow) => {
    e.stopPropagation();
    setWorkflowToDelete(workflow);
    setShowDeleteModal(true);
    setActiveTooltip(null);
  };

  const confirmDelete = () => {
    if (workflowToDelete) {
      setWorkflows(prevWorkflows => 
        prevWorkflows.filter(workflow => workflow.id !== workflowToDelete.id)
      );
      setShowDeleteModal(false);
      setWorkflowToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setWorkflowToDelete(null);
  };

  const handleExecuteClick = (e, workflow) => {
    e.stopPropagation();
    setWorkflowToExecute(workflow);
    setShowExecuteModal(true);
  };

  const confirmExecute = () => {
    if (workflowToExecute) {
      // Add your execute logic here
      console.log('Executing workflow:', workflowToExecute.id);
      setShowExecuteModal(false);
      setWorkflowToExecute(null);
    }
  };

  const cancelExecute = () => {
    setShowExecuteModal(false);
    setWorkflowToExecute(null);
  };

  // Close tooltip when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.more-button') && !event.target.closest('.tooltip')) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const filteredWorkflows = workflows
    .sort((a, b) => {
      // Sort by pinned status first (pinned items at top)
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then sort by updated date
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    })
    .filter(workflow =>
      workflow.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleWorkflowClick = (workflowId) => {
    navigate(`/flowchart/${workflowId}`);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#10B981' : '#6B7280';
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>Workflow Builder</h1>
        <button 
          className="create-button"
          onClick={() => navigate('/flowchart/create')}
        >
          + Create New Process
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search By Workflow Name/ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="workflows-list">
        <div className="list-headers">
          <div>Workflow Name</div>
          <div>ID</div>
          <div>Last Edited On</div>
          <div>Description</div>
          <div>Actions</div>
        </div>

        {filteredWorkflows.map(workflow => (
          <div 
            key={workflow.id} 
            className="workflow-item"
            onClick={() => handleWorkflowClick(workflow.id)}
          >
            <div className="workflow-name">{workflow.title}</div>
            <div className="workflow-id">#{workflow.id.split('-')[1]}</div>
            <div className="workflow-edited">
              {workflow.createdBy} | {new Date(workflow.updatedAt).toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })} IST - {new Date(workflow.updatedAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit'
              })}
            </div>
            <div className="workflow-description">
              {workflow.description}
            </div>
            <div className="workflow-actions" onClick={(e) => e.stopPropagation()}>
              <div
                className="star-button"
                onClick={(e) => handlePinToggle(workflow.id, e)}
              >
                {workflow.pinned ? <img style={{width: '20px', height: '20px'}} src={Pinned} alt="Pinned" /> : <img style={{width: '20px', height: '20px'}} src={UnPinned} alt="Unpinned" />}
              </div>
              <button 
                className="execute-button"
                onClick={(e) => handleExecuteClick(e, workflow)}
              >
                Execute
              </button>
              <button 
                className="edit-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/flowchart/${workflow.id}?mode=edit`);
                }}
              >
                Edit
              </button>
              <div className="more-button-container">
                <span
                  className="more-button"
                  style={{
                    cursor: 'pointer',
                    width: '20px',
                    height: '20px',
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '20px'
                  }}
                  onClick={(e) => handleMoreClick(e, workflow.id)}
                >⋮</span>
                {activeTooltip === workflow.id && (
                  <div className="tooltip" style={{height: '22px'}}>
                    <button 
                      className="delete-option"
                      onClick={(e) => handleDeleteClick(e, workflow)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <button className="download-button">↓</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && workflowToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h2>Are You Sure You Want To Delete '{workflowToDelete.title}'?</h2>
              <button className="close-button" onClick={cancelDelete}>×</button>
            </div>
            <div className="">
              <p className="warning-text">You Cannot Undo This Step</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={cancelDelete}>No</button>
              <button className="confirm-button" onClick={confirmDelete}>Yes</button>
            </div>
          </div>
        </div>
      )}

      {/* Execute Confirmation Modal */}
      {showExecuteModal && workflowToExecute && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h2>Are You Sure You Want To Execute The Process '{workflowToExecute.title}'?</h2>
              <button className="close-button" onClick={cancelExecute}>×</button>
            </div>
            <div className="">
              <p className="warning-text">You Cannot Undo This Step</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={cancelExecute}>No</button>
              <button className="confirm-button" onClick={confirmExecute}>Yes</button>
            </div>
          </div>
        </div>
      )}

      <div className="pagination">
        <button className="page-button prev">←</button>
        <div className="page-numbers">
          <button className="page-button active">1</button>
          <button className="page-button">2</button>
          <button className="page-button">3</button>
          <span className="ellipsis">...</span>
          <button className="page-button">15</button>
        </div>
        <button className="page-button next">→</button>
      </div>
    </div>
  );
};

export default List; 