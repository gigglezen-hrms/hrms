import { Box, SimpleGrid, Heading, Stat, StatLabel, StatNumber, useColorMode, Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';
import { DashboardLayout } from '../../components/DashboardLayout';
// Mock data removed - use API instead
const mockTenants: any[] = [];
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

export const SuperAdminDashboard = () => {
  const { colorMode } = useColorMode();
  const activeTenants = mockTenants.filter((t: any) => t.status === 'active').length;
  const suspendedTenants = mockTenants.filter((t: any) => t.status === 'suspended').length;

  const planDistribution = {
    starter: mockTenants.filter((t: any) => t.plan === 'starter').length,
    professional: mockTenants.filter((t: any) => t.plan === 'professional').length,
    enterprise: mockTenants.filter((t: any) => t.plan === 'enterprise').length,
  };

  return (
    <DashboardLayout>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heading mb={6} size="lg">Super Admin Dashboard</Heading>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <StatCard
            label="Total Tenants"
            value={mockTenants.length}
            gradient="linear(to-r, #6C5CE7, #00BFA6)"
          />
          <StatCard
            label="Active Tenants"
            value={activeTenants}
            gradient="linear(to-r, #00BFA6, #00D7A3)"
          />
          <StatCard
            label="Suspended"
            value={suspendedTenants}
            gradient="linear(to-r, #FF6B6B, #EE5A6F)"
          />
          <StatCard
            label="Total Revenue"
            value="$150K"
            gradient="linear(to-r, #FFD93D, #6BCF7F)"
          />
        </SimpleGrid>

        <MotionBox
          p={6}
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderRadius="lg"
          boxShadow="0 4px 16px rgba(0,0,0,0.08)"
          mb={8}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Heading size="md" mb={4}>Plan Distribution</Heading>
          <SimpleGrid columns={{ base: 3 }} spacing={4}>
              <Stat>
                <StatLabel fontSize="sm">Starter Plans</StatLabel>
                <StatNumber fontSize="2xl" color="#3B82F6">{planDistribution.starter}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="sm">Professional Plans</StatLabel>
                <StatNumber fontSize="2xl" color="#8B5CF6">{planDistribution.professional}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="sm">Enterprise Plans</StatLabel>
                <StatNumber fontSize="2xl" color="#00BFA6">{planDistribution.enterprise}</StatNumber>
              </Stat>
          </SimpleGrid>
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
          <Heading size="md" mb={4}>Tenants Overview</Heading>
          <Box overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Company</Th>
                  <Th>Plan</Th>
                  <Th>Employees</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockTenants.map((tenant: any) => (
                  <Tr key={tenant.id}>
                    <Td fontWeight="600">{tenant.company_name}</Td>
                    <Td><Badge colorScheme="purple">{tenant.plan}</Badge></Td>
                    <Td>{tenant.employee_count}</Td>
                    <Td>
                      <Badge colorScheme={tenant.status === 'active' ? 'green' : 'red'}>
                        {tenant.status}
                      </Badge>
                    </Td>
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
