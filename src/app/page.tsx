'use client';

import { useState } from 'react';
import { Box, Tabs, Tab, Container } from '@mui/material';
import WeightCalculator from '@/components/WeightCalculator';
import ExerciseDatabase from '@/components/ExerciseDatabase';
import WorkoutGenerator from '@/components/WorkoutGenerator';
import PageLayout from '@/components/PageLayout';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <WeightCalculator />;
      case 1:
        return <ExerciseDatabase />;
      case 2:
        return <WorkoutGenerator />;
      default:
        return null;
    }
  };

  return (
    <PageLayout withPaper={false}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Weight Calculator" />
          <Tab label="Exercise Database" />
          <Tab label="Workout Generator" />
        </Tabs>
      </Box>

      <Container maxWidth="xl" disableGutters>
        {renderTabContent()}
      </Container>
    </PageLayout>
  );
}
