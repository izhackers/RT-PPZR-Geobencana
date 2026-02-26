
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

interface ChartData {
  type: 'bar' | 'line' | 'area' | 'pie';
  data: any[];
  title: string;
}

// Updated palette based on requested colors #2F5D50 (Green) and #D9C5A0 (Brown)
const GEO_PALETTE = ['#2F5D50', '#D9C5A0', '#4A7C6D', '#B8A686', '#1A332C', '#F2E8D5'];

export const ChartRenderer: React.FC<{ chart: ChartData }> = ({ chart }) => {
  if (!chart || !chart.data) return null;

  const renderChart = () => {
    switch (chart.type) {
      case 'line':
        return (
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
            <XAxis dataKey="label" stroke="#D9C5A0" fontSize={9} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
            <YAxis stroke="#D9C5A0" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A332C', borderRadius: '12px', border: '1px solid #D9C5A0', color: '#D9C5A0', fontSize: '11px' }}
              itemStyle={{ color: '#D9C5A0' }}
            />
            <Line type="monotone" dataKey="value" stroke="#D9C5A0" strokeWidth={3} dot={{ r: 4, fill: '#D9C5A0', strokeWidth: 2, stroke: '#2F5D50' }} activeDot={{ r: 6, stroke: '#fff' }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chart.data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
            >
              {chart.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={GEO_PALETTE[index % GEO_PALETTE.length]} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1A332C', borderRadius: '12px', border: '1px solid #D9C5A0', color: '#D9C5A0' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#D9C5A0', fontWeight: 'bold' }} />
          </PieChart>
        );
      default: // bar
        return (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
            <XAxis dataKey="label" stroke="#D9C5A0" fontSize={9} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
            <YAxis stroke="#D9C5A0" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(217, 197, 160, 0.1)' }}
              contentStyle={{ backgroundColor: '#1A332C', borderRadius: '12px', border: '1px solid #D9C5A0', color: '#D9C5A0' }} 
            />
            <Bar dataKey="value" fill="#2F5D50" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};
