'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::career-orientation-assessment-response.career-orientation-assessment-response', ({ strapi }) => ({
  // Custom endpoint to submit assessment responses
  async submit(ctx) {
    const { data } = ctx.request.body;
    
    try {
      // Validate required fields
      if (!data.sessionId || !data.responses) {
        return ctx.badRequest('Missing required fields: sessionId and responses');
      }

      // Calculate completion percentage based on responses
      const responseCount = Object.keys(data.responses).length;
      // You would get the total questions from the assessment page
      const completionPercentage = Math.min(100, (responseCount / 10) * 100); // Assuming 10 questions for now

      // Set completion status
      const completionStatus = completionPercentage === 100 ? 'completed' : 'in_progress';
      const completedAt = completionStatus === 'completed' ? new Date() : null;

      // Add metadata
      const enrichedData = {
        ...data,
        completionPercentage,
        completionStatus,
        startedAt: data.startedAt || new Date(),
        completedAt,
        userAgent: ctx.request.headers['user-agent'],
        ipAddress: ctx.request.ip,
        pageReferrer: ctx.request.headers.referer
      };

      // Create or update response
      let response = await strapi.db.query('api::career-orientation-assessment-response.career-orientation-assessment-response').findOne({
        where: { sessionId: data.sessionId }
      });

      if (response) {
        // Update existing response
        response = await strapi.db.query('api::career-orientation-assessment-response.career-orientation-assessment-response').update({
          where: { id: response.id },
          data: enrichedData
        });
      } else {
        // Create new response
        response = await strapi.db.query('api::career-orientation-assessment-response.career-orientation-assessment-response').create({
          data: enrichedData
        });
      }

      // If completed, calculate recommendations
      if (completionStatus === 'completed') {
        const recommendations = await this.calculateRecommendations(data.responses);
        
        await strapi.db.query('api::career-orientation-assessment-response.career-orientation-assessment-response').update({
          where: { id: response.id },
          data: {
            assessmentResults: recommendations.results,
            recommendedCareerPaths: recommendations.careerPaths
          }
        });
      }

      ctx.body = {
        data: response,
        message: completionStatus === 'completed' ? 'Assessment completed successfully!' : 'Assessment progress saved.'
      };

    } catch (error) {
      strapi.log.error('Assessment submission error:', error);
      return ctx.internalServerError('Failed to submit assessment');
    }
  },

  // Get assessment response by session ID
  async getBySession(ctx) {
    const { sessionId } = ctx.params;
    
    try {
      const response = await strapi.db.query('api::career-orientation-assessment-response.career-orientation-assessment-response').findOne({
        where: { sessionId },
        populate: {
          assessmentPage: true,
          user: true
        }
      });

      if (!response) {
        return ctx.notFound('Assessment response not found');
      }

      ctx.body = { data: response };
    } catch (error) {
      strapi.log.error('Get assessment response error:', error);
      return ctx.internalServerError('Failed to retrieve assessment response');
    }
  },

  // Helper method to calculate career recommendations
  async calculateRecommendations(responses) {
    // This is a simplified recommendation engine
    // In a real implementation, you'd have more sophisticated logic
    
    const results = {
      primaryInterest: 'AI/Machine Learning',
      skillLevel: 'Intermediate',
      preferredWorkStyle: 'Remote',
      careerReadiness: 85
    };

    const careerPaths = [
      {
        title: 'AI Research Scientist',
        match: 92,
        reason: 'Strong analytical skills and research interest'
      },
      {
        title: 'Machine Learning Engineer',
        match: 88,
        reason: 'Technical skills and implementation focus'
      },
      {
        title: 'Data Scientist',
        match: 85,
        reason: 'Data analysis expertise and business acumen'
      }
    ];

    return { results, careerPaths };
  }
}));