import React from 'react';
import '../styles/TestFlow.css';

interface TestStep {
    name: string;
    action: () => Promise<void>;
    isDisabled?: boolean;
}

interface TestFlowProps {
    steps: TestStep[];
}

const TestFlow: React.FC<TestFlowProps> = ({ steps }) => {
    return (
        <div className="test-flow-steps">
            {steps.map((step, index) => (
                <div key={step.name} className="test-flow-step">
                    <div className="step-number">{index + 1}</div>
                    <button 
                        onClick={() => step.action()}
                        disabled={step.isDisabled}
                    >
                        {step.name}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TestFlow; 