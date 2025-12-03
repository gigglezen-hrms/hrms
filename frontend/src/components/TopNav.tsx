import { Box, Flex, Avatar, Menu, MenuButton, MenuList, MenuItem, Heading, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon, BellIcon, SearchIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPrimaryRole = () => {
    if (!user) return '';
    return user.role;
  };

  return (
    <MotionBox
      as={Flex}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderBottom="1px solid"
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      px={6}
      py={4}
      align="center"
      justify="space-between"
      boxShadow="0 4px 16px rgba(0,0,0,0.08)"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Flex align="center" gap={3}>
        <SearchIcon w={5} h={5} color="gray.500" />
        <Heading size="sm" color="gray.600">
          Search...
        </Heading>
      </Flex>

      <Flex align="center" gap={4}>
        <BellIcon w={5} h={5} color="gray.600" cursor="pointer" />
        <Box
          as="button"
          onClick={toggleColorMode}
          p={2}
          borderRadius="md"
          _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
        >
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Box>

        <Menu>
          <MenuButton
            as={Box}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
          >
            <Flex align="center" gap={3}>
              <Avatar
                size="md"
                name={user?.name}
              />
              <Box textAlign="left" display={{ base: 'none', md: 'block' }}>
                <Heading size="sm">{user?.name}</Heading>
                <Box fontSize="xs" color="gray.500">
                  {getPrimaryRole()}
                </Box>
              </Box>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate('/me/profile')}>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} color="red.500">
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </MotionBox>
  );
};
