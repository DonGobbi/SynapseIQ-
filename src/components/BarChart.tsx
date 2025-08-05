import React, { useEffect, useRef } from 'react';

interface BarChartItemProps {
  value: number;
  maxValue: number;
  label: string;
  color: string;
  index: number;
}

/**
 * A single bar in a bar chart that uses DOM manipulation to set height
 * instead of inline styles
 */
const BarChartItem: React.FC<BarChartItemProps> = ({ 
  value, 
  maxValue, 
  label, 
  color,
  index
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  
  // Calculate height percentage based on value and maxValue
  const heightPercentage = (value / maxValue) * 100;
  
  // Set height via DOM to avoid inline styles in JSX
  useEffect(() => {
    const bar = barRef.current;
    if (bar) {
      bar.style.height = `${heightPercentage}%`;
    }
  }, [heightPercentage]);

  return (
    <div className="flex flex-col items-center flex-1">
      <div className="w-full h-full relative flex items-end">
        <div 
          ref={barRef}
          className={`w-full rounded-t ${color} min-h-[4px] transition-all duration-500`}
          role="graphics-symbol"
          aria-label={`${label}: ${value}`}
          data-value={value}
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {label}
      </div>
    </div>
  );
};

interface BarChartProps {
  data: Array<{
    value: number;
    month: string;
  }>;
  maxValue?: number;
  color: string;
  title?: string;
}

/**
 * A bar chart component that displays multiple bars without using inline styles
 */
const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  maxValue: propMaxValue, 
  color,
  title
}) => {
  // Calculate max value if not provided
  const maxValue = propMaxValue || Math.max(...data.map(item => item.value)) * 1.2;

  return (
    <div className="h-64 flex items-end space-x-2 relative">
      {/* Add y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
        <span>{maxValue}</span>
        <span>{Math.round(maxValue/2)}</span>
        <span>0</span>
      </div>
      
      {/* Chart content with left padding for y-axis */}
      <div className="flex-1 flex items-end space-x-2 pl-8">
        {data.map((item, index) => (
          <BarChartItem
            key={index}
            index={index}
            value={item.value}
            maxValue={maxValue}
            label={item.month}
            color={color}
          />
        ))}
      </div>
    </div>
  );
};

export default BarChart;
