import React, { useState } from "react";

export default function SaveModal({ isOpen, onClose, title, nodes, edges, onSave }) {
  const [inputTitle, setInputTitle] = useState(title || "");

  const handleSave = () => {
    if (!inputTitle.trim()) {
      alert("Title is required.");
      return;
    }
    onSave(inputTitle, nodes, edges);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Save Canvas</h2>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter title"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
