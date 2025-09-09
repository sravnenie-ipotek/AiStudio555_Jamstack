'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::career-orientation-assessment-response.career-orientation-assessment-response', ({ strapi }) => ({
  // Service to get analytics for assessment responses
  async getAnalytics(filters = {}) {
    const responses = await strapi.db.query('api::career-orientation-assessment-response.career-orientation-assessment-response').findMany({
      where: filters,
      populate: {
        assessmentPage: true
      }
    });

    const analytics = {
      totalResponses: responses.length,
      completedResponses: responses.filter(r => r.completionStatus === 'completed').length,
      averageCompletionTime: 0,
      completionRate: 0,
      popularCareerPaths: [],
      responsesByDay: {}
    };

    // Calculate average completion time for completed responses
    const completedResponses = responses.filter(r => r.completionStatus === 'completed' && r.timeSpentSeconds);
    if (completedResponses.length > 0) {
      analytics.averageCompletionTime = Math.round(
        completedResponses.reduce((sum, r) => sum + r.timeSpentSeconds, 0) / completedResponses.length
      );
    }

    // Calculate completion rate
    analytics.completionRate = responses.length > 0 
      ? Math.round((analytics.completedResponses / analytics.totalResponses) * 100)
      : 0;

    // Aggregate popular career paths from recommendations
    const careerPathCounts = {};
    completedResponses.forEach(response => {
      if (response.recommendedCareerPaths) {
        response.recommendedCareerPaths.forEach(path => {
          careerPathCounts[path.title] = (careerPathCounts[path.title] || 0) + 1;
        });
      }
    });

    analytics.popularCareerPaths = Object.entries(careerPathCounts)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Group responses by day
    responses.forEach(response => {
      const date = new Date(response.createdAt).toISOString().split('T')[0];
      analytics.responsesByDay[date] = (analytics.responsesByDay[date] || 0) + 1;
    });

    return analytics;
  },

  // Service to export assessment data
  async exportResponses(format = 'json', filters = {}) {
    const responses = await strapi.db.query('api::career-orientation-assessment-response.career-orientation-assessment-response').findMany({
      where: filters,
      populate: {
        assessmentPage: true,
        user: {
          select: ['id', 'username', 'email']
        }
      }
    });

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeader = 'ID,Session ID,User Email,Completion Status,Completion %,Started At,Completed At,Time Spent (seconds)\n';
      const csvRows = responses.map(r => [
        r.id,
        r.sessionId,
        r.user?.email || 'Anonymous',
        r.completionStatus,
        r.completionPercentage,
        r.startedAt,
        r.completedAt || '',
        r.timeSpentSeconds || ''
      ].join(',')).join('\n');
      
      return csvHeader + csvRows;
    }

    return responses;
  }
}));