import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, useColorMode, VStack, HStack, Heading, FormControl, FormLabel, Input, Textarea, Select, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Progress } from '@chakra-ui/react';
import { motion } from 'framer-motion';
// Mock data removed - use API instead
const mockLeaveRequests: any[] = [];
const mockLeaveBalances: any[] = [];
const mockLeaveTypes: any[] = [];

const MotionBox = motion(Box);

export const MeLeavesTab = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const employeeId = 'emp-001';
  
  const leaveRequests = mockLeaveRequests.filter(r => r.employee_id === employeeId);
  const leaveBalances = mockLeaveBalances.filter(l => l.employee_id === employeeId);
  const pendingLeaves = leaveRequests.filter(r => r.status === 'pending').length;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Leave Balance Overview */}
      <MotionBox
        p={6}
        mb={6}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="lg"
        boxShadow="0 4px 16px rgba(0,0,0,0.08)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Heading size="md" mb={4}>Leave Balance</Heading>
        <VStack spacing={4} align="stretch">
          {leaveBalances.map((balance, idx) => (
            <Box key={idx} p={4} bg={colorMode === 'light' ? 'gray.50' : 'gray.700'} borderRadius="md">
              <HStack justify="space-between" mb={2}>
                <Heading size="sm">{mockLeaveTypes.find(lt => lt.id === balance.leave_type_id)?.leave_type_name || 'Leave Type'}</Heading>
                <Heading size="sm" color="#00BFA6">{balance.balance_days} days</Heading>
              </HStack>
              <Progress value={(balance.balance_days / balance.allocated_days) * 100} colorScheme="cyan" />
              <Box fontSize="xs" color="gray.500" mt={2}>
                {balance.used_days} used, {balance.pending_days} pending of {balance.allocated_days} allocated
              </Box>
            </Box>
          ))}
        </VStack>
      </MotionBox>

      {/* Apply Leave Button */}
      <MotionBox
        mb={6}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          w="100%"
          size="lg"
          bgGradient="linear(90deg, #6C5CE7 0%, #00BFA6 100%)"
          color="white"
          onClick={onOpen}
          _hover={{ opacity: 0.9 }}
        >
          Apply for Leave
        </Button>
      </MotionBox>

      {/* Leave Requests History */}
      <MotionBox
        p={6}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="lg"
        boxShadow="0 4px 16px rgba(0,0,0,0.08)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <HStack justify="space-between" mb={4}>
          <Heading size="md">My Leave Requests</Heading>
          {pendingLeaves > 0 && (
            <Badge colorScheme="yellow" fontSize="md">{pendingLeaves} Pending</Badge>
          )}
        </HStack>

        {leaveRequests.length > 0 ? (
          <Box overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>From Date</Th>
                  <Th>To Date</Th>
                  <Th>Days</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {leaveRequests.map((leave) => (
                  <Tr key={leave.id}>
                    <Td>{leave.from_date}</Td>
                    <Td>{leave.to_date}</Td>
                    <Td>{leave.number_of_days}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          leave.status === 'approved' ? 'green' :
                          leave.status === 'rejected' ? 'red' :
                          leave.status === 'cancelled' ? 'gray' :
                          'yellow'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </Td>
                    <Td>
                      {leave.status === 'pending' && (
                        <Button size="sm" colorScheme="red" variant="ghost">
                          Cancel
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box textAlign="center" py={8} color="gray.500">
            No leave requests yet
          </Box>
        )}
      </MotionBox>

      {/* Apply Leave Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apply for Leave</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Leave Type</FormLabel>
                <Select placeholder="Select leave type">
                  {mockLeaveTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.leave_type_name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>From Date</FormLabel>
                <Input type="date" />
              </FormControl>
              <FormControl>
                <FormLabel>To Date</FormLabel>
                <Input type="date" />
              </FormControl>
              <FormControl>
                <FormLabel>Reason</FormLabel>
                <Textarea placeholder="Provide a reason for your leave..." />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="purple">
              Submit Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
};
