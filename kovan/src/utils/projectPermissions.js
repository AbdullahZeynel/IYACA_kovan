// Rol tabanlı erişim kontrolü (RBAC) sistemi
export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    canEditProject: true,
    canDeleteProject: true,
    canManageMembers: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canViewBudget: true,
    canEditBudget: true,
    canPublish: true,
    canViewAll: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canChangeMemberRole: true,
    canAccessAnalytics: true
  },
  [ROLES.MEMBER]: {
    canEditProject: false,
    canDeleteProject: false,
    canManageMembers: false,
    canEditTasks: true, // Kendi görevlerini düzenleyebilir
    canDeleteTasks: false,
    canViewBudget: true, // Sadece okuyabilir
    canEditBudget: false,
    canPublish: false,
    canViewAll: true,
    canCreateTasks: true, // Yeni görev önerebilir
    canAssignTasks: false,
    canChangeMemberRole: false,
    canAccessAnalytics: false
  },
  [ROLES.VIEWER]: {
    canEditProject: false,
    canDeleteProject: false,
    canManageMembers: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canViewBudget: false,
    canEditBudget: false,
    canPublish: false,
    canViewAll: true,
    canCreateTasks: false,
    canAssignTasks: false,
    canChangeMemberRole: false,
    canAccessAnalytics: false
  }
};

export const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.[permission] ?? false;
};

export const getRoleLabel = (role) => {
  const labels = {
    admin: 'Yönetici',
    member: 'Üye',
    viewer: 'Görüntüleyici'
  };
  return labels[role] || role;
};

export const getTaskStatus = (status) => {
  const statuses = {
    todo: { label: 'Yapılacak', color: 'bg-gray-100 text-gray-800', icon: '⭕' },
    'in-progress': { label: 'Devam Ediyor', color: 'bg-blue-100 text-blue-800', icon: '🔵' },
    completed: { label: 'Tamamlandı', color: 'bg-green-100 text-green-800', icon: '✅' },
    blocked: { label: 'Engellendi', color: 'bg-red-100 text-red-800', icon: '🚫' }
  };
  return statuses[status] || statuses.todo;
};

export const getPriorityLabel = (priority) => {
  const priorities = {
    low: { label: 'Düşük', color: 'bg-green-100 text-green-800', icon: '⬇️' },
    medium: { label: 'Orta', color: 'bg-yellow-100 text-yellow-800', icon: '➡️' },
    high: { label: 'Yüksek', color: 'bg-red-100 text-red-800', icon: '⬆️' }
  };
  return priorities[priority] || priorities.medium;
};

export const getProjectStats = (project) => {
  return {
    completionRate: Math.round((project.stats.tasksCompleted / (project.stats.tasksCompleted + project.stats.tasksInProgress + project.stats.tasksTodo)) * 100) || 0,
    budgetUsage: Math.round((project.budget.spent / project.budget.total) * 100),
    memberCount: project.members.length,
    totalHours: project.hoursLogged
  };
};
