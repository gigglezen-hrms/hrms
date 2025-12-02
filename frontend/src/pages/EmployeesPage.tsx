import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, useColorMode, HStack, Input, InputGroup, InputLeftElement, Heading } from '@chakra-ui/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';
// Mock data removed - use API instead
const mockEmployees: any[] = [];
const mockDepartments: any[] = [];
const mockDesignations: any[] = [];
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const EmployeesPage = () => {
  const { colorMode } = useColorMode();

  return (
    <DashboardLayout>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <HStack justify="space-between" mb={6}>
          <Heading>Employees</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="purple">
            Add Employee
          </Button>
        </HStack>

        <Box
          p={6}
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderRadius="lg"
          boxShadow="0 4px 16px rgba(0,0,0,0.08)"
        >
          <InputGroup mb={6}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Search employees..." />
          </InputGroup>

          <Box overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Department</Th>
                  <Th>Designation</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockEmployees.slice(0, 10).map((emp) => (
                  <Tr key={emp.id}>
                    <Td fontWeight="600">{emp.first_name} {emp.last_name}</Td>
                    <Td>{emp.email}</Td>
                    <Td>{mockDepartments.find(d => d.id === emp.department_id)?.department_name}</Td>
                    <Td>{mockDesignations.find(d => d.id === emp.designation_id)?.designation_name}</Td>
                    <Td>
                      <Badge colorScheme={emp.status === 'active' ? 'green' : 'red'}>
                        {emp.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </MotionBox>
    </DashboardLayout>
  );
};
