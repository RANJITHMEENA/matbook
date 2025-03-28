import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SAMPLE_WORKFLOWS } from '../../data/sampleWorkflows';
import Pinned from '../../Assets/Img/pinned.png';
import UnPinned from '../../Assets/Img/Unpinned.png';
import './List.css';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';

const List = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To access navigation state
  const [searchTerm, setSearchTerm] = useState('');
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState(null);
  const [workflowToExecute, setWorkflowToExecute] = useState(null);
  const [message, setMessage] = useState(null);
  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const workflowsRef = collection(db, 'workflows');
      const q = query(workflowsRef, 
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const workflowData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format dates for display
        createdAt: new Date(doc.data().createdAt).toLocaleDateString(),
        updatedAt: new Date(doc.data().updatedAt).toLocaleDateString()
      }));
      
      setWorkflows(workflowData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch workflows: ' + err.message);
      console.error('Error fetching workflows:', err);
    } finally {
      setLoading(false);
    }
  };
  console.log(workflows,"workflows");
  
  useEffect(() => {


    fetchWorkflows();

    // Show success message if available
    if (location.state?.message) {
      // You can implement a toast/notification system here
      console.log(location.state.message);
    }
  }, [location]);

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

  const handleDeleteClick = async (e, workflow) => {
    e.stopPropagation();
    setWorkflowToDelete(workflow);
    setShowDeleteModal(true);
    setActiveTooltip(null);
  };

  const confirmDelete = async () => {
    if (workflowToDelete) {
      try {
        setLoading(true); // Show loading state while deleting
        // Delete the document from Firebase
        const workflowRef = doc(db, 'workflows', workflowToDelete.id);
        await deleteDoc(workflowRef);
        
        // Fetch the updated list
        await fetchWorkflows();
        
        // Reset states
        setShowDeleteModal(false);
        setWorkflowToDelete(null);
        setError(null);
      } catch (err) {
        console.error('Error deleting workflow:', err);
        setError('Failed to delete workflow. Please try again.');
      } finally {
        setLoading(false);
      }
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

  const confirmExecute = async () => {
    if (workflowToExecute) {
      try {
        // Update workflow status in Firebase
        const workflowRef = doc(db, 'workflows', workflowToExecute.id);
        await updateDoc(workflowRef, {
          status: 'passed',
          executedAt: new Date().toISOString()
        });

        // Update local state
        setWorkflows(prevWorkflows => 
          prevWorkflows.map(workflow => 
            workflow.id === workflowToExecute.id 
              ? { ...workflow, status: 'passed' } 
              : workflow
          )
        );

        // Close modal and reset state
        setShowExecuteModal(false);
        setWorkflowToExecute(null);

        // Optional: Show success message
        setMessage('Workflow executed successfully!');
      } catch (error) {
        console.error('Error executing workflow:', error);
        setError('Failed to execute workflow: ' + error.message);
      }
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
    .filter(workflow =>
      workflow.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <div className="loading">Loading workflows...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="list-container" style={{marginTop: '3rem'}}>
      <div className="list-header">
        <h1>Workflow Builder</h1>
        <div className="button-container" style={{display: 'flex', gap: '1rem'}}>
          <button 
            className="create-button"
            onClick={() => navigate('/flowchart/create')}
          >
            + Create New Process
          </button>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
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
          >
            <div className="workflow-name">{workflow.title}</div>
            <div className="workflow-id">
              #{workflow.id.substring(0, 5)}
            </div>
            <div className="workflow-edited">
              {workflow.updatedAt} 
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
                style={{cursor: 'pointer'}}
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