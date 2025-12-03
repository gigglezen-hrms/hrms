import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, useColorMode } from '@chakra-ui/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { MeAttendanceTab } from './me/MeAttendanceTab';
import { MeLeavesTab } from './me/MeLeavesTab';
import { MePayrollTab } from './me/MePayrollTab';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const MePage = () => {
  const { colorMode } = useColorMode();

  return (
    <DashboardLayout>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs
          variant="soft-rounded"
          colorScheme="purple"
        >
          <TabList
            mb={6}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            p={4}
            borderRadius="lg"
            boxShadow="0 4px 16px rgba(0,0,0,0.08)"
          >
            <Tab _selected={{ bg: '#6C5CE7', color: 'white' }}>
              Attendance
            </Tab>
            <Tab _selected={{ bg: '#6C5CE7', color: 'white' }}>
              Leaves
            </Tab>
            <Tab _selected={{ bg: '#6C5CE7', color: 'white' }}>
              Payroll
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <MeAttendanceTab />
            </TabPanel>
            <TabPanel>
              <MeLeavesTab />
            </TabPanel>
            <TabPanel>
              <MePayrollTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </MotionBox>
    </DashboardLayout>
  );
};
