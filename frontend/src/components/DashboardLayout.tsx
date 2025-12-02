import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { colorMode } = useColorMode();

  return (
    <Flex h="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Sidebar />
      <Flex direction="column" flex={1} overflow="hidden">
        <TopNav />
        <MotionBox
          as="main"
          flex={1}
          overflowY="auto"
          px={{ base: 4, md: 8 }}
          py={6}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </MotionBox>
      </Flex>
    </Flex>
  );
};
