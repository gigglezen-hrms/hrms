import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, useColorMode, VStack, HStack, Heading, Divider, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
// Mock data removed - use API instead
const mockPayslips: any[] = [];
const mockPayrollComponents: any[] = [];
const mockPayrollEmployeeComponents: any[] = [];
import { DownloadIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);

export const MePayrollTab = () => {
  const { colorMode } = useColorMode();
  const employeeId = 'emp-001';
  
  const payslips = mockPayslips.filter(p => p.employee_id === employeeId);
  const recentPayslip = payslips[0];
  const employeeComponents = mockPayrollEmployeeComponents.filter(c => c.employee_id === employeeId);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Recent Payslip Summary */}
      {recentPayslip && (
        <MotionBox
          p={6}
          mb={6}
          bg="linear-gradient(90deg, #6C5CE7 0%, #00BFA6 100%)"
          color="white"
          borderRadius="lg"
          boxShadow="0 4px 16px rgba(0,0,0,0.15)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HStack justify="space-between" align="start" mb={4}>
            <Box>
              <Heading size="lg">{recentPayslip.month} {recentPayslip.year}</Heading>
              <Box fontSize="sm" opacity={0.9}>Latest Payslip</Box>
            </Box>
            <Button
              bg="white"
              color="#6C5CE7"
              size="sm"
              leftIcon={<DownloadIcon />}
              _hover={{ opacity: 0.9 }}
            >
              Download
            </Button>
          </HStack>

          <Divider borderColor="rgba(255,255,255,0.3)" mb={4} />

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box>
              <Box fontSize="sm" opacity={0.8} mb={1}>Gross Salary</Box>
              <Heading size="lg">${recentPayslip.gross_salary}</Heading>
            </Box>
            <Box>
              <Box fontSize="sm" opacity={0.8} mb={1}>Deductions</Box>
              <Heading size="lg">-${recentPayslip.total_deductions}</Heading>
            </Box>
            <Box>
              <Box fontSize="sm" opacity={0.8} mb={1}>Net Salary</Box>
              <Heading size="lg">${recentPayslip.net_salary}</Heading>
            </Box>
          </SimpleGrid>
        </MotionBox>
      )}

      {/* Salary Components */}
      <MotionBox
        p={6}
        mb={6}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="lg"
        boxShadow="0 4px 16px rgba(0,0,0,0.08)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Heading size="md" mb={4}>Salary Components</Heading>
        <VStack spacing={3} align="stretch">
          {employeeComponents.map((comp, idx) => {
            const componentInfo = mockPayrollComponents.find(c => c.id === comp.payroll_component_id);
            return (
              <HStack
                key={idx}
                justify="space-between"
                p={3}
                bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
                borderRadius="md"
              >
                <Box>
                  <Heading size="sm">{componentInfo?.component_name}</Heading>
                  <Box fontSize="xs" color="gray.500">
                    <Badge size="sm" colorScheme={componentInfo?.component_type === 'earnings' ? 'green' : 'red'} mr={2}>
                      {componentInfo?.component_type}
                    </Badge>
                    {componentInfo?.is_taxable && <Badge size="sm">Taxable</Badge>}
                  </Box>
                </Box>
                <Heading size="sm">${comp.value}</Heading>
              </HStack>
            );
          })}
        </VStack>
      </MotionBox>

      {/* Payslips History */}
      <MotionBox
        p={6}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="lg"
        boxShadow="0 4px 16px rgba(0,0,0,0.08)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Heading size="md" mb={4}>Payslip History</Heading>
        {payslips.length > 0 ? (
          <Box overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Month/Year</Th>
                  <Th>Gross</Th>
                  <Th>Deductions</Th>
                  <Th>Net</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payslips.map((slip) => (
                  <Tr key={slip.id}>
                    <Td fontWeight="600">{slip.month} {slip.year}</Td>
                    <Td>${slip.gross_salary}</Td>
                    <Td>${slip.total_deductions}</Td>
                    <Td fontWeight="600" color="#00BFA6">${slip.net_salary}</Td>
                    <Td>
                      <Button size="sm" variant="ghost" leftIcon={<DownloadIcon />}>
                        Download
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box textAlign="center" py={8} color="gray.500">
            No payslips available
          </Box>
        )}
      </MotionBox>
    </MotionBox>
  );
};
