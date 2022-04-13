import Tooltip from 'components/Tooltip';
import React from 'react';
import guidelines from './guidelines.json';

const Guidelines: React.FC = () => {
    return (
        <ul>
            {guidelines.map((guideline: any) => (
                <li key={guideline.text}>
                    {guideline.text}
                    {guideline.tooltip.trim() !== '' && (
                        <Tooltip overlay={<span>{guideline.tooltip}</span>} iconFontSize={18} marginLeft={4} top={0} />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default Guidelines;
