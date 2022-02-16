import React from 'react';
import { editIconWidth, editIconHeight, editIconColor, rectHeight, rectWidth } from './constants';

//双向箭头
const DoubleArrow = (
  <svg style={{ width: editIconWidth, height: editIconHeight }} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect style={{ width: rectWidth, height: rectHeight, fill: 'none' }} x={-1} y={-1} />
      <path
        style={{ strokeWidth: 0, fill: editIconColor }}
        d="m1.06204,11.58766l8.18428,-3.58766l0,2.61941l13.44529,0l0,-2.61941l8.30839,3.58766l-8.30839,3.41234l0,-2.44409l-13.44529,0l0,2.4-8.2,-3.4z"
      />
    </g>
  </svg>
);

export default DoubleArrow;
