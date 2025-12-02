import { Box, SimpleGrid, Heading, Stat, StatLabel, StatNumber, useColorMode, Table, Thead, Tbody, Tr, Th, Td, Badge, HStack, Progress, VStack } from '@chakra-ui/react';
import { DashboardLayout } from '../../components/DashboardLayout';
// Mock data removed - use API instead
const mockEmployees: any[] = [];
const mockDepartments: any[] = [];
const mockLeaveRequests: any[] = [];
const mockAttendanceRequests: any[] = [];
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

export const TenantAdminDashboard = () => {
  const { colorMode } = useColorMode();
  const tenantId = 'tenant-001';

  const employeeCount = mockEmployees.filter((e: any) => e.tenant_id === tenantId).length;
  const departmentCount = mockDepartments.filter((d: any) => d.tenant_id === tenantId).length;
  const pendingLeaves = mockLeaveRequests.filter((l: any) => l.tenant_id === tenantId && l.status === 'pending').length;
  const pendingCorrections = mockAttendanceRequests.filter((a: any) => a.tenant_id === tenantId && a.status === 'pending').length;

  return (
    <DashboardLayout>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heading mb={6} size="lg">Admin Dashboard</Heading>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <StatCard
            label="Total Employees"
            value={employeeCount}
            gradient="linear(to-r, #6C5CE7, #00BFA6)"
          />
          <StatCard
            label="Departments"
            value={departmentCount}
            gradient="linear(to-r, #00BFA6, #00D7A3)"
          />
          <StatCard
            label="Pending Leaves"
            value={pendingLeaves}
            gradient="linear(to-r, #FF6B6B, #EE5A6F)"
          />
          <StatCard
            label="Attendance Issues"
            value={pendingCorrections}
            gradient="linear(to-r, #FFD93D, #6BCF7F)"
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <MotionBox
            p={6}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="lg"
            boxShadow="0 4px 16px rgba(0,0,0,0.08)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Heading size="md" mb={4}>Attendance Trends (This Month)</Heading>
            <VStack spacing={3} align="stretch">
              {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week: string, idx: number) => (
                <Box key={idx}>
                  <HStack justify="space-between" mb={2}>
                    <Heading size="sm">{week}</Heading>
                    <Heading size="sm" color="#00BFA6">{92 + idx}%</Heading>
                  </HStack>
                  <Progress value={92 + idx} colorScheme="cyan" />
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
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Heading size="md" mb={4}>Leave Distribution</Heading>
            <VStack spacing={3} align="stretch">
              {['Casual Leave', 'Sick Leave', 'Annual Leave'].map((leave: string, idx: number) => (
                <Box key={idx}>
                  <HStack justify="space-between" mb={2}>
                    <Heading size="sm">{leave}</Heading>
                    <Heading size="sm">{45 - idx * 10} used</Heading>
                  </HStack>
                  <Progress value={50 + idx * 10} colorScheme="purple" />
                </Box>
              ))}
            </VStack>
          </MotionBox>
        </SimpleGrid>

        <MotionBox
          mt={8}
          p={6}
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderRadius="lg"
          boxShadow="0 4px 16px rgba(0,0,0,0.08)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Heading size="md" mb={4}>Recent Employees</Heading>
          <Box overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Department</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockEmployees.slice(0, 5).map((emp: any) => (
                  <Tr key={emp.id}>
                    <Td fontWeight="600">{emp.first_name} {emp.last_name}</Td>
                    <Td>{mockDepartments.find((d: any) => d.id === emp.department_id)?.department_name}</Td>
                    <Td><Badge colorScheme={emp.status === 'active' ? 'green' : 'red'}>{emp.status}</Badge></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </MotionBox>
      </MotionBox>
    </DashboardLayout>
  );
};
