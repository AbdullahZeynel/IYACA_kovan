import React, { useState } from 'react';

export default function ProjectCard({ project, onViewProject }) {
  const [showDetails, setShowDetails] = useState(false);
  const completionRate = Math.round((project.stats.tasksCompleted / (project.stats.tasksCompleted + project.stats.tasksInProgress + project.stats.tasksTodo)) * 100) || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
      {/* Card Header - Gradient Background */}
      <div className={`bg-gradient-to-r ${project.cover} text-white p-6 relative`}>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            project.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
          }`}>
            {project.status === 'active' ? '🟢 Aktif' : '⏹️ Tamamlandı'}
          </span>
        </div>
        <div className="flex items-start gap-4 mb-4">
          <div className="text-5xl">{project.image}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-sm text-blue-100 mt-1">{project.category}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 mb-4 pb-4 border-b border-gray-200 text-center text-xs">
          <div>
            <p className="font-bold text-gray-900">{project.members.length}</p>
            <p className="text-gray-600">Üye</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">{project.volunteers}</p>
            <p className="text-gray-600">Volontör</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">{project.hoursLogged}h</p>
            <p className="text-gray-600">Saat</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">{completionRate}%</p>
            <p className="text-gray-600">İlerleme</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-700">Tamamlanma</span>
            <span className="text-xs font-bold text-blue-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Project Owner */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm">
            {project.owner.avatar}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">{project.owner.name}</p>
            <p className="text-xs text-gray-600">Proje Yöneticisi</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onViewProject}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition text-sm"
          >
            👁️ Detayları Gör
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-sm"
          >
            {showDetails ? '▲ Gizle' : '▼ Görevler'}
          </button>
        </div>

        {/* Tasks Preview */}
        {showDetails && project.tasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <p className="text-xs font-bold text-gray-900 mb-3">Son Görevler:</p>
            {project.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="text-xs p-2 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-start gap-2">
                  <span className={`${
                    task.status === 'completed' ? '✅' : 
                    task.status === 'in-progress' ? '🔵' : '⭕'
                  }`}></span>
                  <span className="text-gray-900 font-semibold flex-1">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
