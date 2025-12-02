import { Box, Heading, Link, VStack, Badge, useColorMode, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  SettingsIcon,
  EmailIcon,
  LockIcon,
  ExternalLinkIcon,
  TimeIcon,
  CalendarIcon,
  AttachmentIcon,
  ViewIcon,
} from '@chakra-ui/icons';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

interface SidebarItem {
  label: string;
  path: string;
  icon: any;
  badge?: string;
}

const getSidebarItems = (role: string): SidebarItem[] => {
  const roleUpper = role.toUpperCase();

  if (roleUpper === 'SUPER ADMIN') {
    return [
      { label: 'Dashboard', path: '/dashboard', icon: ViewIcon },
      { label: 'Tenants', path: '/tenants', icon: LockIcon },
    ];
  }

  if (roleUpper === 'TENANT ADMIN') {
    return [
      { label: 'Dashboard', path: '/dashboard', icon: ViewIcon },
      { label: 'Departments', path: '/departments', icon: EmailIcon },
      { label: 'Designations', path: '/designations', icon: SettingsIcon },
      { label: 'Policies', path: '/policies', icon: LockIcon },
      { label: 'Shifts', path: '/shifts', icon: TimeIcon },
      { label: 'Employees', path: '/employees', icon: AttachmentIcon },
      { label: 'Roles', path: '/roles', icon: LockIcon },
      { label: 'Settings', path: '/settings', icon: SettingsIcon },
      { label: 'ME', path: '/me', icon: ExternalLinkIcon, badge: 'SECTION' },
    ];
  }

  if (roleUpper === 'HR') {
    return [
      { label: 'Dashboard', path: '/dashboard', icon: ViewIcon },
      { label: 'Employees', path: '/employees', icon: AttachmentIcon },
      { label: 'Attendance', path: '/attendance', icon: CalendarIcon },
      { label: 'Leaves', path: '/leaves', icon: TimeIcon },
      { label: 'Approvals', path: '/approvals', icon: LockIcon },
      { label: 'ME', path: '/me', icon: ExternalLinkIcon, badge: 'SECTION' },
    ];
  }

  if (roleUpper === 'MANAGER') {
    return [
      { label: 'Dashboard', path: '/dashboard', icon: ViewIcon },
      { label: 'My Team', path: '/team', icon: AttachmentIcon },
      { label: 'Team Attendance', path: '/team-attendance', icon: CalendarIcon },
      { label: 'Team Leaves', path: '/team-leaves', icon: TimeIcon },
      { label: 'Approvals', path: '/approvals', icon: LockIcon },
      { label: 'ME', path: '/me', icon: ExternalLinkIcon, badge: 'SECTION' },
    ];
  }

  // Employee role
  return [
    { label: 'Dashboard', path: '/dashboard', icon: ViewIcon },
    { label: 'Attendance', path: '/attendance', icon: CalendarIcon },
    { label: 'Leaves', path: '/leaves', icon: TimeIcon },
    { label: 'Profile', path: '/profile', icon: AttachmentIcon },
    { label: 'Payroll', path: '/payroll', icon: LockIcon },
    { label: 'ME', path: '/me', icon: ExternalLinkIcon, badge: 'SECTION' },
  ];
};

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { colorMode } = useColorMode();

  if (!user) return null;

  const primaryRole = user.role || 'Employee';
  const items = getSidebarItems(primaryRole);

  return (
    <MotionBox
      as="aside"
      w="250px"
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRight="1px solid"
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      h="100vh"
      overflowY="auto"
      p={4}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      display={{ base: 'none', md: 'block' }}
    >
      <Heading size="lg" mb={8} bgGradient="linear(to-r, #6C5CE7, #00BFA6)" bgClip="text">
        HRMS
      </Heading>

      <Box mb={6} p={3} bg={colorMode === 'light' ? 'gray.50' : 'gray.700'} borderRadius="lg">
        <Heading size="xs" color="gray.600" mb={1}>
          Role
        </Heading>
        <Heading size="sm">{primaryRole}</Heading>
      </Box>

      <MotionVStack
        spacing={2}
        align="stretch"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, staggerChildren: 0.05 }}
      >
        {items.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div key={idx} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <Link
                as={RouterLink}
                to={item.path}
              >
              <HStack
                gap={3}
                display="flex"
                alignItems="center"
                px={4}
                py={3}
                borderRadius="lg"
                bg={isActive ? 'rgba(108, 92, 231, 0.1)' : 'transparent'}
                borderLeft="3px solid"
                borderColor={isActive ? '#6C5CE7' : 'transparent'}
                color={isActive ? '#6C5CE7' : colorMode === 'light' ? 'gray.600' : 'gray.300'}
                fontWeight={isActive ? '600' : '500'}
                _hover={{
                  bg: colorMode === 'light' ? 'gray.100' : 'gray.700',
                  textDecoration: 'none',
                }}
                transition="all 0.2s"
              >
                <item.icon />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge ml="auto" colorScheme="purple" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </HStack>
            </Link>
            </motion.div>
          );
        })}
      </MotionVStack>
    </MotionBox>
  );
};
