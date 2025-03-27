import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SAMPLE_WORKFLOWS } from '../../data/sampleWorkflows';
import Config from '../../Assets/Img/configuration.png';
import SaveIcon from '../../Assets/Img/saveIcon.png';
import DeleteIcon from '../../Assets/Img/Delete.png';
import './FlowChart.css';

const FlowChart = ({ initialData = null }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || (id ? 'view' : 'create');
  const navigate = useNavigate();
  const [flowElements, setFlowElements] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const loadWorkflowData = () => {
      setLoading(true);
      try {
        // If initialData is provided, use it
        if (initialData) {
          loadWorkflow(initialData);
        } 
        // If we have an ID, fetch from SAMPLE_WORKFLOWS
        else if (id) {
          const foundWorkflow = SAMPLE_WORKFLOWS.find(w => w.id === id);
          if (foundWorkflow) {
            loadWorkflow(foundWorkflow);
          } else {
            setError('Workflow not found');
          }
        } 
        // If in create mode, start with empty state
        else {
          setTitle('');
          setFlowElements([]);
        }
      } catch (err) {
        setError('Error loading workflow');
      } finally {
        setLoading(false);
      }
    };

    loadWorkflowData();
  }, [initialData, id]);

  const loadWorkflow = (workflowData) => {
    if (!workflowData) return;

    setTitle(workflowData.title || '');
    
    // Sort elements by position and convert to flowElements format
    const sortedElements = [...workflowData.elements].sort((a, b) => a.position - b.position);
    
    const newFlowElements = sortedElements.map(element => ({
      id: element.id,
      type: element.type,
      value: element.type === 'apiCall' 
        ? {
            method: element.config?.method || '',
            url: element.config?.url || '',
            headers: element.config?.headers || '',
            body: element.config?.body || ''
          }
        : element.config?.value || ''
    }));

    setFlowElements(newFlowElements);
  };

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

  const handleSave = async () => {
    try {
      if (!title.trim()) {
        setError('Please fill in the title');
        return;
      }

      const workflowData = {
        id: mode === 'create' ? Date.now().toString() : initialData?.id,
        title: title.trim(),
        nodes: [
          {
            id: 'start',
            type: 'start',
            position: 0,
            next: flowElements.length > 0 ? flowElements[0].id : 'end'
          },
          {
            id: 'end',
            type: 'end',
            position: -1,
            next: null
          }
        ],
        elements: flowElements.map((element, index) => ({
          id: element.id,
          type: element.type,
          position: index + 1,
          next: index === flowElements.length - 1 ? 'end' : flowElements[index + 1].id,
          config: {
            ...(element.type === 'email' && {
              value: element.value
            }),
            ...(element.type === 'apiCall' && {
              method: element.value?.method || '',
              url: element.value?.url || '',
              headers: element.value?.headers || '',
              body: element.value?.body || ''
            }),
            ...(element.type === 'textBox' && {
              value: element.value
            })
          }
        }))
      };

      navigate('/list');
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };

  const renderFlowElements = () => {
    if (flowElements.length === 0) {
      return (
        <button 
          className="plus-button" 
          onClick={() => handlePlusClick(null)}
        >+</button>
      );
    }

    return (
      <div className="flow-elements">
        {flowElements.map((element, index) => (
          <React.Fragment key={element.id}>
            <div className="flow-element">
              {element.type === 'apiCall' && (
                <div className="input-wrapper">
                  <div 
                    className="api-call-display" 
                    onClick={() => handleApiDivClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="element-badge badge-api">API</span>
                    <span className="api-call-method">{element.value?.method || 'GET'}</span>
                    <span className="api-call-url">{element.value?.url || 'API Call'}</span>
                  </div>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(index)}
                  >
                  <img src={DeleteIcon} alt="Delete" />

                  </button>
                </div>
              )}
              {element.type === 'email' && (
                <div className="input-wrapper">
                  <div 
                    className="email-text" 
                    onClick={() => handleEmailDivClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="element-badge badge-email">Email</span>
                    {element.value || 'Enter email'}
                  </div>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(index)}
                  >
                 <img src={DeleteIcon} alt="Delete" />
                  </button>
                </div>
              )}
              {element.type === 'textBox' && (
                <div className="input-wrapper">
                  <div 
                    className="email-text" 
                    onClick={() => handleTextBoxDivClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="element-badge badge-text">Text</span>
                    {element.value || 'Enter text'}
                  </div>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(index)}
                  >
                                  <img src={DeleteIcon} alt="Delete" />

                  </button>
                </div>
              )}
            </div>
            <button 
              className="plus-button" 
              onClick={() => handlePlusClick(index)}
            >+</button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Update the nav box to show different buttons based on mode
  const renderNavBox = () => (
    <div className="nav-box">
      <button className="back-button" onClick={() => navigate('/list')}>
        <span className="arrow-left">←</span>
        Go Back
      </button>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        readOnly={mode === 'view'}
      />
    
        <div onClick={handleSave}>
          <img src={SaveIcon} alt="Save" />
        </div>
    
    </div>
  );

  return (
    <div className="page-container">
      {(showEmailCard || showApiCard || showTextBoxCard) && (
        <div className="backdrop-overlay" />
      )}
      {renderNavBox()}
      
      <div 
        className="flowchart-container"
        ref={containerRef}
        onMouseDown={mode !== 'view' ? handleMouseDown : undefined}
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          cursor: mode === 'view' ? 'default' : (isDragging ? 'grabbing' : 'grab')
        }}
      >
        <div className="node start">Start</div>
        <div className="arrow-container">
          <div className="arrow"></div>
          {renderFlowElements()}
          {showTooltip  && (
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
        <div className="node end">End</div>
      </div>

     
        <>
          {showEmailCard && (
            <div className="slide-card-wrapper">
              <img src={Config} alt="Config" />
              <div ref={emailCardRef} className="email-slide-card">
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
              <div ref={apiCardRef} className="api-slide-card">
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
              <div ref={textBoxCardRef} className="email-slide-card">
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
        </>
   
    </div>
  );
};

export default FlowChart; 