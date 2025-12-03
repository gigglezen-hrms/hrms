import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, useColorMode, VStack, HStack, Heading, FormControl, FormLabel, Input, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
// Mock data removed - use API instead
const mockAttendanceRegisters: any[] = [];
const mockAttendanceRequests: any[] = [];
const mockShifts: any[] = [];

const MotionBox = motion(Box);

export const MeAttendanceTab = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const employeeId = 'emp-001';
  
  const attendance = mockAttendanceRegisters.filter(a => a.employee_id === employeeId);
  const todayAttendance = attendance.find(a => a.attendance_date === new Date().toISOString().split('T')[0]);
  const currentShift = mockShifts.find(s => s.id === (attendance[0]?.shift_id || 'shift-001'));

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Check-in/out Card */}
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
        <Heading size="lg" mb={4}>Today's Shift</Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Box>
            <Heading size="sm" opacity={0.8} mb={1}>Shift</Heading>
            <Heading size="md">{currentShift?.shift_name || 'Morning Shift'}</Heading>
          </Box>
          <Box>
            <Heading size="sm" opacity={0.8} mb={1}>Start Time</Heading>
            <Heading size="md">{currentShift?.start_time || '09:00'}</Heading>
          </Box>
          <Box>
            <Heading size="sm" opacity={0.8} mb={1}>End Time</Heading>
            <Heading size="md">{currentShift?.end_time || '17:00'}</Heading>
          </Box>
          <Box>
            <Heading size="sm" opacity={0.8} mb={1}>Status</Heading>
            <Badge colorScheme={todayAttendance?.status === 'present' ? 'green' : 'gray'} fontSize="md" p={2}>
              {todayAttendance?.status === 'present' ? 'Checked In' : 'Not Checked In'}
            </Badge>
          </Box>
        </SimpleGrid>

        <HStack spacing={4} mt={6}>
          <Button bg="white" color="#6C5CE7" _hover={{ opacity: 0.9 }}>
            Check In
          </Button>
          <Button bg="rgba(255,255,255,0.2)" _hover={{ bg: 'rgba(255,255,255,0.3)' }}>
            Check Out
          </Button>
        </HStack>
      </MotionBox>

      {/* Attendance History */}
      <MotionBox
        p={6}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="lg"
        boxShadow="0 4px 16px rgba(0,0,0,0.08)"
        mb={6}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Heading size="md" mb={4}>Attendance History</Heading>
        <Box overflowX="auto">
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Check In</Th>
                <Th>Check Out</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {attendance.slice(0, 10).map((att) => (
                <Tr key={att.id}>
                  <Td>{att.attendance_date}</Td>
                  <Td>{att.check_in_time || '-'}</Td>
                  <Td>{att.check_out_time || '-'}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        att.status === 'present' ? 'green' :
                        att.status === 'absent' ? 'red' :
                        'yellow'
                      }
                    >
                      {att.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </MotionBox>

      {/* Request Correction */}
      <MotionBox
        p={6}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="lg"
        boxShadow="0 4px 16px rgba(0,0,0,0.08)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Heading size="md" mb={4}>Request Correction</Heading>
        {mockAttendanceRequests.filter(r => r.employee_id === employeeId).length > 0 ? (
          <Box overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Reason</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockAttendanceRequests.filter(r => r.employee_id === employeeId).map((req) => (
                  <Tr key={req.id}>
                    <Td>{req.attendance_date}</Td>
                    <Td>{req.request_type}</Td>
                    <Td>
                      <Badge colorScheme={req.status === 'pending' ? 'yellow' : req.status === 'approved' ? 'green' : 'red'}>
                        {req.status}
                      </Badge>
                    </Td>
                    <Td fontSize="sm">{req.reason}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Button onClick={onOpen} colorScheme="purple" w="100%">
            Request Attendance Correction
          </Button>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Request Attendance Correction</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input type="date" />
                </FormControl>
                <FormControl>
                  <FormLabel>Check In Time</FormLabel>
                  <Input type="time" />
                </FormControl>
                <FormControl>
                  <FormLabel>Check Out Time</FormLabel>
                  <Input type="time" />
                </FormControl>
                <FormControl>
                  <FormLabel>Reason</FormLabel>
                  <Textarea placeholder="Explain why you need this correction..." />
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
    </MotionBox>
  );
};
