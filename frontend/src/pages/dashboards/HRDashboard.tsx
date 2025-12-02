import { Box, SimpleGrid, Heading, Stat, StatLabel, StatNumber, useColorMode, Table, Thead, Tbody, Tr, Th, Td, Badge, HStack, Progress, VStack } from '@chakra-ui/react';
import { DashboardLayout } from '../../components/DashboardLayout';
// Mock data removed - use API instead
const mockEmployees: any[] = [];
const mockLeaveRequests: any[] = [];
const mockAttendanceRegisters: any[] = [];
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const StatCard = ({ label, value, gradient }: { label: string; value: string | number; gradient: string }) => {
  const { colorMode } = useColorMode();
  return (
    <MotionBox
      p={6}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRadius="lg"
      boxShadow="0 4px 16px rgba(0,0,0,0.08)"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Stat>
        <StatLabel fontSize="sm" color="gray.600" mb={2}>
          {label}
        </StatLabel>
        <StatNumber
          fontSize="2xl"
          fontWeight="bold"
          bgGradient={gradient}
          bgClip="text"
        >
          {value}
        </StatNumber>
      </Stat>
    </MotionBox>
  );
};

export const HRDashboard = () => {
  const { colorMode } = useColorMode();
  const tenantId = 'tenant-001';

  const hrEmployees = mockEmployees.filter((e: any) => e.tenant_id === tenantId).length;
  const pendingLeaves = mockLeaveRequests.filter((l: any) => l.tenant_id === tenantId && l.status === 'pending').length;
  const presentToday = mockAttendanceRegisters.filter((a: any) => a.status === 'present').length;
  const newJoinees = mockEmployees.filter((e: any) => e.tenant_id === tenantId && new Date(e.join_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

  return (
    <DashboardLayout>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heading mb={6} size="lg">HR Dashboard</Heading>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <StatCard
            label="Total Employees"
            value={hrEmployees}
            gradient="linear(to-r, #6C5CE7, #00BFA6)"
          />
          <StatCard
            label="Pending Approvals"
            value={pendingLeaves}
            gradient="linear(to-r, #FF6B6B, #EE5A6F)"
          />
          <StatCard
            label="Present Today"
            value={presentToday}
            gradient="linear(to-r, #00BFA6, #00D7A3)"
          />
          <StatCard
            label="New This Month"
            value={newJoinees}
            gradient="linear(to-r, #FFD93D, #6BCF7F)"
          />
        </SimpleGrid>

        <MotionBox
          p={6}
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderRadius="lg"
          boxShadow="0 4px 16px rgba(0,0,0,0.08)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          mb={8}
        >
          <Heading size="md" mb={4}>Pending Leave Requests</Heading>
          <Box overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Employee</Th>
                  <Th>Type</Th>
                  <Th>Days</Th>
                  <Th>From Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockLeaveRequests.filter((l: any) => l.status === 'pending').map((leave: any) => (
                  <Tr key={leave.id}>
                    <Td fontWeight="600">{mockEmployees.find((e: any) => e.id === leave.employee_id)?.first_name}</Td>
                    <Td><Badge>Casual Leave</Badge></Td>
                    <Td>{leave.number_of_days}</Td>
                    <Td>{leave.from_date}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </MotionBox>

        <MotionBox
          p={6}
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderRadius="lg"
          boxShadow="0 4px 16px rgba(0,0,0,0.08)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Heading size="md" mb={4}>Department Performance</Heading>
          <VStack spacing={3} align="stretch">
            {['Engineering', 'Sales', 'HR', 'Finance', 'Marketing'].map((dept: string, idx: number) => (
              <Box key={idx}>
                <HStack justify="space-between" mb={2}>
                  <Heading size="sm">{dept}</Heading>
                  <Heading size="sm">{85 + (idx % 3) * 5}%</Heading>
                </HStack>
                <Progress value={85 + (idx % 3) * 5} colorScheme="purple" />
              </Box>
            ))}
          </VStack>
        </MotionBox>
      </MotionBox>
    </DashboardLayout>
  );
};
