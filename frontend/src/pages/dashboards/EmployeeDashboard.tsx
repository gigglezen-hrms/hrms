import { Box, SimpleGrid, Heading, Stat, StatLabel, StatNumber, useColorMode, Badge, HStack, VStack, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { DashboardLayout } from '../../components/DashboardLayout';
// Mock data removed - use API instead
const mockEmployees: any[] = [];
const mockAttendanceRegisters: any[] = [];
const mockLeaveBalances: any[] = [];
const mockPayslips: any[] = [];
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

export const EmployeeDashboard = () => {
  const { colorMode } = useColorMode();
  const employeeId = 'emp-001';

  const employee = mockEmployees.find((e: any) => e.id === employeeId);
  const todayAttendance = mockAttendanceRegisters.find((a: any) => a.employee_id === employeeId && a.attendance_date === new Date().toISOString().split('T')[0]);
  const leaveBalance = mockLeaveBalances.filter((l: any) => l.employee_id === employeeId);
  const lastPayslip = mockPayslips.filter((p: any) => p.employee_id === employeeId).sort((a: any, b: any) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())[0];

  const totalBalance = leaveBalance.reduce((sum: number, l: any) => sum + l.balance_days, 0);

  return (
    <DashboardLayout>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heading mb={6} size="lg">My Dashboard</Heading>

        <MotionBox
          p={6}
          mb={8}
          bg="linear-gradient(90deg, #6C5CE7 0%, #00BFA6 100%)"
          color="white"
          borderRadius="lg"
          boxShadow="0 4px 16px rgba(0,0,0,0.15)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Heading size="lg" mb={2}>Welcome, {employee?.first_name}!</Heading>
          <Box fontSize="md">You have {totalBalance} leaves remaining this year</Box>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <StatCard
            label="Today Status"
            value={todayAttendance?.status === 'present' ? 'Present' : 'Absent'}
            gradient="linear(to-r, #6C5CE7, #00BFA6)"
          />
          <StatCard
            label="Total Leave Balance"
            value={totalBalance}
            gradient="linear(to-r, #FF6B6B, #EE5A6F)"
          />
          <StatCard
            label="Check-in Time"
            value={todayAttendance?.check_in_time || '---'}
            gradient="linear(to-r, #00BFA6, #00D7A3)"
          />
          <StatCard
            label="Last Salary"
            value={lastPayslip ? `$${lastPayslip.net_salary}` : '---'}
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
            <Heading size="md" mb={4}>Leave Balance</Heading>
            <VStack spacing={3} align="stretch">
              {leaveBalance.slice(0, 3).map((balance: any, idx: number) => (
                <HStack key={idx} justify="space-between" p={3} bg={colorMode === 'light' ? 'gray.50' : 'gray.700'} borderRadius="md">
                  <Box>
                    <Heading size="sm">Leave Type {idx + 1}</Heading>
                    <Box fontSize="xs" color="gray.500">{balance.allocated_days} allocated</Box>
                  </Box>
                  <Box textAlign="right">
                    <Heading size="sm" color="#00BFA6">{balance.balance_days}</Heading>
                    <Box fontSize="xs" color="gray.500">remaining</Box>
                  </Box>
                </HStack>
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
            <Heading size="md" mb={4}>Recent Attendance</Heading>
            <Box overflowX="auto">
              <Table>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mockAttendanceRegisters.filter((a: any) => a.employee_id === employeeId).slice(0, 4).map((att: any) => (
                    <Tr key={att.id}>
                      <Td fontSize="sm">{att.attendance_date}</Td>
                      <Td>
                        <Badge colorScheme={att.status === 'present' ? 'green' : att.status === 'absent' ? 'red' : 'yellow'}>
                          {att.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </MotionBox>
    </DashboardLayout>
  );
};
