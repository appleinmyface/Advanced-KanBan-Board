import React from 'react';

const Log = ({ logs }) => (
  <div className="bg-white p-6 rounded-md shadow-lg mt-6">
    <h2 className="text-xl font-bold mb-4 text-gray-700">Activity Log</h2>
    <ul className="space-y-2">
      {logs.map(log => (
        <li key={log.id} className="text-gray-600">{log.message}</li>
      ))}
    </ul>
  </div>
);

export default Log;
