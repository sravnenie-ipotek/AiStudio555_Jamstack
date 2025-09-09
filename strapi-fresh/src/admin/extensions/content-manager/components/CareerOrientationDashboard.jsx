import React, { useState, useEffect } from 'react';
import { Box, Flex, Typography, Card, CardBody, ProgressBar, Button, Grid, GridItem } from '@strapi/design-system';
import { CheckCircle, AlertCircle, TrendingUp, Users, FileText, MessageSquare } from 'lucide-react';

const CareerOrientationDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPages: 0,
    publishedPages: 0,
    totalResponses: 0,
    completedAssessments: 0,
    averageCompletionRate: 0,
    contentCompletionBySection: {},
    recentActivity: [],
    topCareerPaths: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch career orientation pages
      const pagesResponse = await fetch('/api/career-orientation-pages?populate=*');
      const pages = await pagesResponse.json();
      
      // Fetch assessment responses  
      const responsesResponse = await fetch('/api/career-orientation-assessment-responses');
      const responses = await responsesResponse.json();

      // Calculate metrics
      const totalPages = pages.data?.length || 0;
      const publishedPages = pages.data?.filter(page => page.attributes.publishedAt).length || 0;
      const totalResponses = responses.data?.length || 0;
      const completedAssessments = responses.data?.filter(r => r.attributes.completionStatus === 'completed').length || 0;
      
      // Content completion analysis
      const contentCompletion = analyzeContentCompletion(pages.data || []);
      
      setDashboardData({
        totalPages,
        publishedPages,
        totalResponses,
        completedAssessments,
        averageCompletionRate: totalResponses > 0 ? (completedAssessments / totalResponses) * 100 : 0,
        contentCompletionBySection: contentCompletion,
        recentActivity: generateRecentActivity(pages.data, responses.data),
        topCareerPaths: extractTopCareerPaths(responses.data || [])
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const analyzeContentCompletion = (pages) => {
    const sections = [
      'hero', 'problemsSection', 'solutionsSection', 'processSection',
      'careerPathsSection', 'expertSection', 'partnersSection', 
      'assessmentSection', 'footerSection'
    ];
    
    const completion = {};
    
    sections.forEach(section => {
      const completedPages = pages.filter(page => 
        page.attributes[section] && Object.keys(page.attributes[section]).length > 0
      ).length;
      completion[section] = pages.length > 0 ? (completedPages / pages.length) * 100 : 0;
    });
    
    return completion;
  };

  const generateRecentActivity = (pages, responses) => {
    const activities = [];
    
    // Recent page updates
    if (pages) {
      pages.slice(0, 3).forEach(page => {
        activities.push({
          type: 'page_update',
          title: `Updated: ${page.attributes.pageTitle}`,
          time: new Date(page.attributes.updatedAt).toLocaleDateString(),
          status: page.attributes.publishedAt ? 'published' : 'draft'
        });
      });
    }
    
    // Recent assessment responses
    if (responses) {
      responses.slice(0, 2).forEach(response => {
        activities.push({
          type: 'assessment',
          title: `New assessment ${response.attributes.completionStatus}`,
          time: new Date(response.attributes.createdAt).toLocaleDateString(),
          status: response.attributes.completionStatus
        });
      });
    }
    
    return activities.slice(0, 5);
  };

  const extractTopCareerPaths = (responses) => {
    const pathCounts = {};
    
    responses.forEach(response => {
      if (response.attributes.recommendedCareerPaths) {
        response.attributes.recommendedCareerPaths.forEach(path => {
          pathCounts[path.title] = (pathCounts[path.title] || 0) + 1;
        });
      }
    });
    
    return Object.entries(pathCounts)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getSectionIcon = (section) => {
    const icons = {
      hero: '🎯',
      problemsSection: '⚠️', 
      solutionsSection: '✅',
      processSection: '📋',
      careerPathsSection: '🛤️',
      expertSection: '👨‍💼',
      partnersSection: '🤝',
      assessmentSection: '📊',
      footerSection: '🔗'
    };
    return icons[section] || '📄';
  };

  const getSectionName = (section) => {
    const names = {
      hero: 'Hero Section',
      problemsSection: 'Problems Section',
      solutionsSection: 'Solutions Section', 
      processSection: 'Process Section',
      careerPathsSection: 'Career Paths Section',
      expertSection: 'Expert Section',
      partnersSection: 'Partners Section',
      assessmentSection: 'Assessment Section',
      footerSection: 'Footer Section'
    };
    return names[section] || section;
  };

  return (
    <Box padding={6}>
      <Typography variant="alpha" fontWeight="bold" textColor="neutral800">
        🚀 Career Orientation Content Dashboard
      </Typography>
      
      <Box paddingTop={4}>
        <Grid gap={4}>
          {/* Key Metrics Cards */}
          <GridItem col={3}>
            <Card>
              <CardBody>
                <Flex direction="column" alignItems="center">
                  <FileText size={32} color="#28a745" />
                  <Typography variant="beta" fontWeight="bold">{dashboardData.totalPages}</Typography>
                  <Typography variant="omega">Total Pages</Typography>
                  <Typography variant="pi" textColor="success600">
                    {dashboardData.publishedPages} Published
                  </Typography>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem col={3}>
            <Card>
              <CardBody>
                <Flex direction="column" alignItems="center">
                  <Users size={32} color="#007cba" />
                  <Typography variant="beta" fontWeight="bold">{dashboardData.totalResponses}</Typography>
                  <Typography variant="omega">Total Responses</Typography>
                  <Typography variant="pi" textColor="primary600">
                    {dashboardData.completedAssessments} Completed
                  </Typography>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem col={3}>
            <Card>
              <CardBody>
                <Flex direction="column" alignItems="center">
                  <TrendingUp size={32} color="#fd79a8" />
                  <Typography variant="beta" fontWeight="bold">
                    {Math.round(dashboardData.averageCompletionRate)}%
                  </Typography>
                  <Typography variant="omega">Completion Rate</Typography>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem col={3}>
            <Card>
              <CardBody>
                <Flex direction="column" alignItems="center">
                  <CheckCircle size={32} color="#2ed573" />
                  <Typography variant="beta" fontWeight="bold">163+</Typography>
                  <Typography variant="omega">Fields Managed</Typography>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>

      {/* Content Section Completion */}
      <Box paddingTop={6}>
        <Typography variant="beta" fontWeight="bold" paddingBottom={4}>
          📊 Content Section Completion
        </Typography>
        <Grid gap={3}>
          {Object.entries(dashboardData.contentCompletionBySection).map(([section, percentage]) => (
            <GridItem col={6} key={section}>
              <Card>
                <CardBody>
                  <Flex justifyContent="space-between" alignItems="center" paddingBottom={2}>
                    <Flex alignItems="center" gap={2}>
                      <Typography variant="omega">{getSectionIcon(section)}</Typography>
                      <Typography variant="omega">{getSectionName(section)}</Typography>
                    </Flex>
                    <Typography variant="pi" fontWeight="bold">
                      {Math.round(percentage)}%
                    </Typography>
                  </Flex>
                  <ProgressBar value={percentage} />
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Box>

      {/* Recent Activity and Top Career Paths */}
      <Box paddingTop={6}>
        <Grid gap={4}>
          <GridItem col={6}>
            <Card>
              <CardBody>
                <Typography variant="beta" fontWeight="bold" paddingBottom={4}>
                  📈 Recent Activity
                </Typography>
                {dashboardData.recentActivity.map((activity, index) => (
                  <Flex key={index} justifyContent="space-between" alignItems="center" paddingY={2}>
                    <Flex alignItems="center" gap={2}>
                      {activity.type === 'page_update' ? <FileText size={16} /> : <MessageSquare size={16} />}
                      <Typography variant="omega">{activity.title}</Typography>
                    </Flex>
                    <Flex alignItems="center" gap={2}>
                      <Typography variant="pi" textColor="neutral500">{activity.time}</Typography>
                      {activity.status === 'published' && <CheckCircle size={12} color="#28a745" />}
                      {activity.status === 'draft' && <AlertCircle size={12} color="#ffa502" />}
                    </Flex>
                  </Flex>
                ))}
              </CardBody>
            </Card>
          </GridItem>

          <GridItem col={6}>
            <Card>
              <CardBody>
                <Typography variant="beta" fontWeight="bold" paddingBottom={4}>
                  🏆 Top Career Path Recommendations
                </Typography>
                {dashboardData.topCareerPaths.map((path, index) => (
                  <Flex key={index} justifyContent="space-between" alignItems="center" paddingY={2}>
                    <Typography variant="omega">{path.title}</Typography>
                    <Typography variant="pi" fontWeight="bold" textColor="primary600">
                      {path.count} recommendations
                    </Typography>
                  </Flex>
                ))}
                {dashboardData.topCareerPaths.length === 0 && (
                  <Typography variant="pi" textColor="neutral500">
                    No career path data yet
                  </Typography>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>

      {/* Quick Actions */}
      <Box paddingTop={6}>
        <Typography variant="beta" fontWeight="bold" paddingBottom={4}>
          ⚡ Quick Actions
        </Typography>
        <Flex gap={3}>
          <Button 
            variant="default" 
            onClick={() => window.open('/admin/content-manager/collection-types/api::career-orientation-page.career-orientation-page', '_blank')}
          >
            📝 Manage Pages
          </Button>
          <Button 
            variant="secondary"
            onClick={() => window.open('/admin/content-manager/collection-types/api::career-orientation-assessment-response.career-orientation-assessment-response', '_blank')}
          >
            📊 View Responses
          </Button>
          <Button 
            variant="tertiary"
            onClick={fetchDashboardData}
          >
            🔄 Refresh Data
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default CareerOrientationDashboard;