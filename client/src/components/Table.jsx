import React, { useState, useEffect } from 'react';
import { FaFile, FaFolder, FaEllipsisV, FaUserCircle } from 'react-icons/fa';
import { getAllFlowcharts } from '../api/flowcharts';

function Table() {
  const [flowcharts, setFlowcharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlowcharts = async () => {
      try {
        const data = await getAllFlowcharts();
        setFlowcharts(data);
      } catch (err) {
        setError("Failed to fetch flowcharts.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlowcharts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col mt-10">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Type</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">File/Folder Name</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Author</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Created</th>
                  <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {flowcharts.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                      {item.type === "folder" ? (
                        <FaFolder className="text-primary text-lg" />
                      ) : (
                        <FaFile className="text-primary text-lg" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                      <a href={`/canvas/${item.flowchart._id}`} target='_blank'>{item.flowchart.title}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 flex items-center gap-x-2">
                      <FaUserCircle className="text-primary text-lg" />
                      {item.flowchart?.owner?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                      {new Date(item.flowchart.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <FaEllipsisV className="text-gray-500 dark:text-neutral-500 cursor-pointer" />
                    </td>
                  </tr>
                ))}
                {flowcharts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No flowcharts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
