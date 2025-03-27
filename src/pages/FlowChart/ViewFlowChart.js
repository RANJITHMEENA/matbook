import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FlowChart from './index';
import { SAMPLE_WORKFLOWS } from '../../data/sampleWorkflows';

const ViewFlowChart = () => {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch workflow data
    const loadWorkflow = () => {
      setLoading(true);
      try {
        const foundWorkflow = SAMPLE_WORKFLOWS.find(w => w.id === id);
        if (foundWorkflow) {
          setWorkflow(foundWorkflow);
          setError(null);
        } else {
          setError('Workflow not found');
        }
      } catch (err) {
        setError('Error loading workflow');
      } finally {
        setLoading(false);
      }
    };

    loadWorkflow();
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