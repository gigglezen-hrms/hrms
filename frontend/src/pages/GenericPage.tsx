import { Box, SimpleGrid, Heading, useColorMode } from '@chakra-ui/react';
import { DashboardLayout } from '../components/DashboardLayout';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PlaceholderCard = ({ title }: { title: string }) => {
  const { colorMode } = useColorMode();
  return (
    <MotionBox
      p={8}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRadius="lg"
      boxShadow="0 4px 16px rgba(0,0,0,0.08)"
      textAlign="center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Heading size="md" color="gray.500">{title}</Heading>
      <Box mt={4} fontSize="sm" color="gray.400">Module Content</Box>
    </MotionBox>
  );
};

export const GenericPage = ({ title }: { title: string }) => {
  return (
    <DashboardLayout>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heading mb={6}>{title}</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <PlaceholderCard title={title} />
          <PlaceholderCard title={title} />
        </SimpleGrid>
      </MotionBox>
    </DashboardLayout>
  );
};
