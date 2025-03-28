import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FlowChart from './index';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ViewFlowChart = () => {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWorkflow = async () => {
      setLoading(true);
      try {
        // Get document reference using the workflow ID
        const workflowRef = doc(db, 'workflows', id);
        
        // Fetch the document
        const workflowDoc = await getDoc(workflowRef);
        
        if (workflowDoc.exists()) {
          // Convert the document to data and include the ID
          const workflowData = {
            id: workflowDoc.id,
            ...workflowDoc.data()
          };
          setWorkflow(workflowData);
          setError(null);
        } else {
          setError('Workflow not found');
        }
      } catch (err) {
        console.error('Error loading workflow:', err);
        setError('Error loading workflow: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadWorkflow();
    }
  }, [id]);

  if (loading) {
    return <div className="loading">Loading workflow...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <FlowChart 
      mode="view"
      initialData={workflow}
    />
  );
};

export default ViewFlowChart; 