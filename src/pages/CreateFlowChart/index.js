import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '../../Assets/Img/saveIcon.png';
import Config from '../../Assets/Img/configuration.png';
import './CreateFlowChart.css';
import StartIcon from '../../Assets/Img/Start.png'; 
import EndIcon from '../../Assets/Img/End.png';
import PlusIcon from '../../Assets/Img/plus.png';
import SaveWorkflowModal from '../../components/SaveWorkflowModal/SaveWorkflowModal';
import DeleteIcon from '../../Assets/Img/Delete.png';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';







const CreateFlowChart = () => {
  const navigate = useNavigate();
  const [flowElements, setFlowElements] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  // Add new state for zoom and pan
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);

  const [showEmailCard, setShowEmailCard] = useState(false);
  const [showApiCard, setShowApiCard] = useState(false);
  const [showTextBoxCard, setShowTextBoxCard] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [apiValue, setApiValue] = useState('');
  const [textBoxValue, setTextBoxValue] = useState('');
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);
  const [selectedApiIndex, setSelectedApiIndex] = useState(null);
  const [selectedTextBoxIndex, setSelectedTextBoxIndex] = useState(null);

  // Add refs for the slide cards
  const emailCardRef = useRef(null);
  const apiCardRef = useRef(null);
  const textBoxCardRef = useRef(null);

  // Add new state for API form fields
  const [apiMethod, setApiMethod] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [apiHeaders, setApiHeaders] = useState('');
  const [apiBody, setApiBody] = useState('');

  // Handle mouse wheel for zooming
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.1;
    const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
    const newScale = Math.min(Math.max(scale + delta, 0.5), 2); // Limit zoom between 0.5x and 2x
    setScale(newScale);
  };

  // Handle mouse down for panning
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleSave = async (data, updatedElements) => {
  
    try {


      // Format elements to match the desired structure
      const formattedElements = updatedElements.map((element, index) => {
        let config = {};
        
        if (element.type === 'apiCall') {
          config = {
            method: element.value?.method || '',
            url: element.value?.url || '',
            headers: element.value?.headers || '',
            body: element.value?.body || ''
          };
        } else if (element.type === 'email' || element.type === 'textBox') {
          config = {
            value: element.value || ''
          };
        }

        return {
          id: element.id,
          type: element.type,
          position: index + 1,
          config: config
        };
      });

      // Construct workflow object
      const workflowData = {
        title: data.name,
        description: data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        elements: formattedElements,
        createdBy: 'User', // You can replace with actual user data
        pinned: false
      };

      // Save to Firebase
      const workflowRef = await addDoc(collection(db, 'workflows'), workflowData);
      
      // Navigate to list page
      navigate('/list', { 
        state: { 
          message: 'Workflow saved successfully!',
          workflowId: workflowRef.id 
        }
      });
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };

  // Handle mouse move for panning
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // Handle mouse up to stop panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        container.removeEventListener('wheel', handleWheel);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, dragStart, position]);

  // Add useEffect for handling click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if clicking outside email card
      if (emailCardRef.current && !emailCardRef.current.contains(event.target)) {
        setShowEmailCard(false);
        setEmailValue('');
        setSelectedEmailIndex(null);
      }
      // Check if clicking outside API card
      if (apiCardRef.current && !apiCardRef.current.contains(event.target)) {
        setShowApiCard(false);
        setApiValue('');
        setSelectedApiIndex(null);
      }
      // Check if clicking outside text box card
      if (textBoxCardRef.current && !textBoxCardRef.current.contains(event.target)) {
        setShowTextBoxCard(false);
        setTextBoxValue('');
        setSelectedTextBoxIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePlusClick = (index) => {
    setTooltipPosition(index);
    setShowTooltip(!showTooltip);
  };

  const handleEmailClick = () => {
    const newElement = {
      type: 'email',
      value: '',
      id: Date.now()
    };
    
    const position = tooltipPosition === null ? 0 : tooltipPosition + 1;
    const newElements = [...flowElements];    
    newElements.splice(position, 0, newElement);
    setFlowElements(newElements);
    setShowTooltip(false);
    setSelectedEmailIndex(position);
    setShowEmailCard(true);
  };

  const handleEmailDivClick = (index) => {
    setSelectedEmailIndex(index);
    const currentEmail = flowElements[index].value;
    setEmailValue(currentEmail);
    setShowEmailCard(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (emailValue.trim()) {
      const newElements = [...flowElements];
      if (selectedEmailIndex !== null) {
        newElements[selectedEmailIndex].value = emailValue;
        setFlowElements(newElements);
      }
      setEmailValue('');
      setShowEmailCard(false);
      setSelectedEmailIndex(null);
    }
  };

  const handleEmailChange = (index, value) => {
    const newElements = [...flowElements];
    newElements[index].value = value;
    setFlowElements(newElements);
  };

  const handleDeleteClick = (index) => {
    const newElements = [...flowElements];
    newElements.splice(index, 1);
    setFlowElements(newElements);
  };

  const handleApiClick = () => {
    const newElement = {
      type: 'apiCall',
      value: '',
      id: Date.now()
    };
    
    const position = tooltipPosition === null ? 0 : tooltipPosition + 1;
    const newElements = [...flowElements];
    newElements.splice(position, 0, newElement);
    setFlowElements(newElements);
    setShowTooltip(false);
    setSelectedApiIndex(position);
    setShowApiCard(true);
  };

  const handleTextBoxClick = () => {
    const newElement = {
      type: 'textBox',
      value: '',
      id: Date.now()
    };
    
    const position = tooltipPosition === null ? 0 : tooltipPosition + 1;
    const newElements = [...flowElements];
    newElements.splice(position, 0, newElement);
    setFlowElements(newElements);
    setShowTooltip(false);
    setSelectedTextBoxIndex(position);
    setShowTextBoxCard(true);
  };

  const handleApiDivClick = (index) => {
    setSelectedApiIndex(index);
    const currentApi = flowElements[index].value;
    if (typeof currentApi === 'object') {
      setApiMethod(currentApi.method || '');
      setApiUrl(currentApi.url || '');
      setApiHeaders(currentApi.headers || '');
      setApiBody(currentApi.body || '');
    }
    setShowApiCard(true);
  };

  const handleTextBoxDivClick = (index) => {
    setSelectedTextBoxIndex(index);
    const currentTextBox = flowElements[index].value;
    setTextBoxValue(currentTextBox);
    setShowTextBoxCard(true);
  };

  const handleApiSubmit = (e) => {
    e.preventDefault();
    if (apiUrl.trim()) {
      const newElements = [...flowElements];
      if (selectedApiIndex !== null) {
        newElements[selectedApiIndex].value = {
          method: apiMethod,
          url: apiUrl,
          headers: apiHeaders,
          body: apiBody
        };
        setFlowElements(newElements);
      }
      setApiMethod('');
      setApiUrl('');
      setApiHeaders('');
      setApiBody('');
      setShowApiCard(false);
      setSelectedApiIndex(null);
    }
  };

  const handleTextBoxSubmit = (e) => {
    e.preventDefault();
    if (textBoxValue.trim()) {
      const newElements = [...flowElements];
      if (selectedTextBoxIndex !== null) {
        newElements[selectedTextBoxIndex].value = textBoxValue;
        setFlowElements(newElements);
      }
      setTextBoxValue('');
      setShowTextBoxCard(false);
      setSelectedTextBoxIndex(null);
    }
  };


  const renderFlowElements = () => {
    if (flowElements.length === 0) {
      return (
        <button 
          className="plus-button" 
          onClick={() => handlePlusClick(null)}
        >
          <img src={PlusIcon} alt="Add" style={{ width: '20px', height: '20px' }} />
        </button>
      );
    }

    return (
      <div className="flow-elements">
        {flowElements.map((element, index) => (
          <React.Fragment key={element.id}>
            <div className="flow-element">
              {element.type === 'email' && (
                <div className="input-wrapper">
                  <div 
                    className="email-text" 
                    onClick={() => handleEmailDivClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {element.value || 'Email'}
                  </div>
                  <div 
                    className="delete-button"
                    onClick={() => handleDeleteClick(index)}
                  >
                    <img src={DeleteIcon} alt="Delete" style={{ width: '20px', height: '20px' }} />
                  </div>
                </div>
              )}
              {element.type === 'apiCall' && (
                <div className="input-wrapper">
                  <div 
                    className="email-text" 
                    onClick={() => handleApiDivClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {element.value?.url || 'API Call'}
                  </div>
                  <div 
                    className="delete-button"
                    onClick={() => handleDeleteClick(index)}
                  >
                    <img src={DeleteIcon} alt="Delete" />
                  </div>
                </div>
              )}
              {element.type === 'textBox' && (
                <div className="input-wrapper">
                  <div 
                    className="email-text" 
                    onClick={() => handleTextBoxDivClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {element.value || 'Text Box'}
                  </div>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(index)}
                  >
                    <img src={DeleteIcon} alt="Delete"  />
                  </button>
                </div>
              )}
            </div>
            <button 
              className="plus-button" 
              onClick={() => handlePlusClick(index)}
            >
              <img src={PlusIcon} alt="Add"  />
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Add backdrop overlay */}
      {(showEmailCard || showApiCard || showTextBoxCard) && (
        <div className="backdrop-overlay" />
      )}
      <div className="nav-box">
        <button className="back-button" onClick={() => navigate('/list')}>
          <span className="arrow-left">←</span>
          Go Back
        </button>
    <p style={{fontSize: '14 px',fontWeight: 600}}>Untitled</p>
    <div style={{cursor: 'pointer'}} onClick={() => setShowSaveModal(true)}>
      <img src={SaveIcon} alt="Save" />
      </div>
    </div>
      
      <div 
        className="flowchart-container"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div className="node start"><img src={StartIcon} alt="Start" /></div>
        <div className="arrow-container">
          <div className="arrow"></div>
          {renderFlowElements()}
          {showTooltip && (
            <div className="tooltip">
              <div className="tooltip-row">
                <button className="tooltip-button" onClick={handleApiClick}>
                  API Call
                </button>
                <button className="tooltip-button" onClick={handleEmailClick}>
                  Email
                </button>
              </div>
              <button className="tooltip-button" onClick={handleTextBoxClick}>
                Text Box
              </button>
            </div>
          )}
            </div>
            <div className="node end"><img src={EndIcon} alt="Stat" /></div>
      </div>
      {showEmailCard && (
        <div className="slide-card-wrapper">
          <img src={Config} alt="Config" />
          <div 
            ref={emailCardRef}
            className="email-slide-card"
          >
            <h3>Email</h3>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="text"
                className="email-input-field"
                placeholder="Type here..."
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        </div>
      )}
      {showApiCard && (
        <div className="slide-card-wrapper">
          <img src={Config} alt="Config" />
          <div 
            ref={apiCardRef}
            className="api-slide-card"
          >
            <form onSubmit={handleApiSubmit}>
              <div className="api-form-group">
                <label>Method</label>
                <div className="method-input">
                  <input
                    type="text"
                    placeholder="Type here..."
                    value={apiMethod}
                    onChange={(e) => setApiMethod(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="api-form-group">
                <label>URL</label>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
              </div>
              <div className="api-form-group">
                <label>Headers</label>
                <input
                  type="text"
                  placeholder="Header Name"
                  value={apiHeaders}
                  onChange={(e) => setApiHeaders(e.target.value)}
                />
              </div>
              <div className="api-form-group">
                <label>Body</label>
                <textarea
                  placeholder="Enter Descriptions..."
                  value={apiBody}
                  onChange={(e) => setApiBody(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      )}
      {showTextBoxCard && (
        <div className="slide-card-wrapper">
          <img src={Config} alt="Config" />
          <div 
            ref={textBoxCardRef}
            className="email-slide-card"
          >
            <h3>Text Box</h3>
            <form onSubmit={handleTextBoxSubmit}>
              <input
                type="text"
                className="email-input-field"
                placeholder="Enter text..."
                value={textBoxValue}
                onChange={(e) => setTextBoxValue(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        </div>
      )}
            {showSaveModal && (
        <SaveWorkflowModal
          onClose={() => setShowSaveModal(false)}
          onSave={handleSave}
          flowElements={flowElements}
        />
      )}
    </div>
  );
};

export default CreateFlowChart; 
