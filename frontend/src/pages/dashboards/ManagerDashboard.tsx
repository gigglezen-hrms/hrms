import { Box, SimpleGrid, Heading, Stat, StatLabel, StatNumber, useColorMode, Table, Thead, Tbody, Tr, Th, Td, Badge, HStack, Progress, VStack } from '@chakra-ui/react';
import { DashboardLayout } from '../../components/DashboardLayout';
// Mock data removed - use API instead
const mockEmployees: any[] = [];
const mockTeamMembers: any[] = [];
const mockTeams: any[] = [];
const mockLeaveRequests: any[] = [];
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

export const ManagerDashboard = () => {
  const { colorMode } = useColorMode();
  const managerId = 'emp-002';

  const teamMembers = mockTeamMembers.filter((m: any) => 
    mockTeams.find((t: any) => t.id === m.team_id && t.manager_id === managerId)
  ).length;

  const teamLeaveRequests = mockLeaveRequests.filter((l: any) => 
    mockEmployees.find((e: any) => e.id === l.employee_id && e.manager_id === managerId) && l.status === 'pending'
  ).length;

  const directReports = mockEmployees.filter((e: any) => e.manager_id === managerId).length;

  return (
    <DashboardLayout>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heading mb={6} size="lg">Manager Dashboard</Heading>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <StatCard
            label="Team Members"
            value={teamMembers}
            gradient="linear(to-r, #6C5CE7, #00BFA6)"
          />
          <StatCard
            label="Direct Reports"
            value={directReports}
            gradient="linear(to-r, #00BFA6, #00D7A3)"
          />
          <StatCard
            label="Pending Approvals"
            value={teamLeaveRequests}
            gradient="linear(to-r, #FF6B6B, #EE5A6F)"
          />
          <StatCard
            label="Team Attendance"
            value="95%"
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
          <Heading size="md" mb={4}>Team Structure</Heading>
          <Box overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Designation</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockEmployees.filter((e: any) => e.manager_id === managerId).map((emp: any) => (
                  <Tr key={emp.id}>
                    <Td fontWeight="600">{emp.first_name} {emp.last_name}</Td>
                    <Td>{emp.employment_type}</Td>
                    <Td><Badge colorScheme={emp.status === 'active' ? 'green' : 'red'}>{emp.status}</Badge></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <MotionBox
            p={6}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="lg"
            boxShadow="0 4px 16px rgba(0,0,0,0.08)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Heading size="md" mb={4}>Team Attendance This Week</Heading>
            <VStack spacing={3} align="stretch">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day: string, idx: number) => (
                <Box key={idx}>
                  <HStack justify="space-between" mb={2}>
                    <Heading size="sm">{day}</Heading>
                    <Heading size="sm" color="#00BFA6">100%</Heading>
                  </HStack>
                  <Progress value={95 + idx} colorScheme="cyan" />
                </Box>
              ))}
            </VStack>
          </MotionBox>

          <MotionBox
            p={6}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="lg"
            boxShadow="0 4px 16px rgba(0,0,0,0.08)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Heading size="md" mb={4}>Team Leave Requests</Heading>
            <VStack spacing={2} align="stretch">
              {mockLeaveRequests.filter((l: any) => 
                mockEmployees.find((e: any) => e.id === l.employee_id && e.manager_id === managerId)
              ).slice(0, 4).map((leave: any) => (
                <HStack key={leave.id} justify="space-between" p={2} bg={colorMode === 'light' ? 'gray.50' : 'gray.700'} borderRadius="md">
                  <Box>
                    <Heading size="sm">{mockEmployees.find((e: any) => e.id === leave.employee_id)?.first_name}</Heading>
                    <Box fontSize="xs" color="gray.500">{leave.from_date} - {leave.to_date}</Box>
                  </Box>
                  <Badge colorScheme={leave.status === 'pending' ? 'yellow' : leave.status === 'approved' ? 'green' : 'red'}>
                    {leave.status}
                  </Badge>
                </HStack>
              ))}
            </VStack>
          </MotionBox>
        </SimpleGrid>
      </MotionBox>
    </DashboardLayout>
  );
};
