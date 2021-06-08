import React from 'react';
import { Shape } from '../types/Shape';

interface InspectorProps {
    selectedShapes: Shape[]
}

const Inspector: React.FC<InspectorProps> = ({ selectedShapes }) => (
    <div className="inspector rounded">

    </div>
);

export default Inspector;
