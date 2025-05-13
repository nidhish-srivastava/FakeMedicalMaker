'use client';

import { useState } from 'react';

export default function Home() {
  const templates = [
    {
      id: 1,
      name: 'template1',
      location: 'template1.pdf',
    },
  ];

  const [selectedTemplateLocation, setSelectedLocation] = useState('');
  const [disease, setDisease] = useState('');
  const [patientName, setPatientName] = useState('');
  const [days, setDays] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [date, setDate] = useState('');

  const selectedTemplateHandler = (e) => {
    const selectedTemplateName = e.target.value;
    const selectedTemplate = templates.find((template) => template.name === selectedTemplateName);
    setSelectedLocation(selectedTemplate?.location || '');
  };

  const createReportHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/create-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patientName,
          disease: disease,
          template: selectedTemplateLocation,
          days: days,
          fatherName: fatherName,
          date: date,
        }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Medical_Certificate.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Fake Medical Report Creator</h2>
      <form className="flex flex-col gap-6 items-center bg-white p-6 rounded-2xl shadow-md w-11/12 max-w-md">
        <div className="flex flex-col w-full">
          <label htmlFor="patientName" className="mb-2 font-medium text-gray-700">Enter Patient Name</label>
          <input
            type="text"
            id="patientName"
            placeholder="Enter your name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="fatherName" className="mb-2 font-medium text-gray-700">Enter Father's Name</label>
          <input
            type="text"
            id="fatherName"
            placeholder="Enter Father's Name"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="diseaseName" className="mb-2 font-medium text-gray-700">Enter Disease Name</label>
          <input
            type="text"
            id="diseaseName"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            placeholder="Enter Disease Name"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="days" className="mb-2 font-medium text-gray-700">Enter Number of Days</label>
          <input
            type="number"
            id="days"
            placeholder="Enter Number of Days"
            value={days}
            min={1}
            onChange={(e) => setDays(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="date" className="mb-2 font-medium text-gray-700">Enter Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex justify-between mb-2">
            <label htmlFor="template" className="font-medium text-gray-700">Choose Template</label>
            {selectedTemplateLocation && (
              <a
                href={`/${selectedTemplateLocation}`}
                download
                className="px-4 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                View Selected Template
              </a>
            )}
          </div>
          <select
            id="template"
            onChange={selectedTemplateHandler}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled selected>Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.name}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={createReportHandler}
          >
            Create Medical Report
          </button>
        </div>
      </form>
    </div>
  );
}
