import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  useColorMode,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const plans = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'Perfect for small teams',
    features: [
      'Up to 25 employees',
      'Basic attendance tracking',
      'Leave management',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Up to 500 employees',
      'Advanced attendance with location',
      'Complete leave & payroll',
      'Priority support',
      'Custom reports',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '/month',
    description: 'For large organizations',
    features: [
      'Unlimited employees',
      'Full HR suite',
      'Multi-location support',
      'Dedicated account manager',
      'Custom integrations',
    ],
  },
];

export const PricingPage = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  return (
    <Box bg={colorMode === 'light' ? 'white' : 'gray.900'} minH="100vh" py={20}>
      <Container maxW="6xl" px={6}>
        <MotionBox
          textAlign="center"
          mb={12}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading size="2xl" mb={4}>
            Simple, Transparent Pricing
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Choose the plan that fits your organization
          </Text>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {plans.map((plan, idx) => (
            <MotionBox
              key={idx}
              p={8}
              bg={colorMode === 'light' ? (plan.popular ? 'gray.50' : 'white') : 'gray.800'}
              borderRadius="lg"
              borderWidth="2px"
              borderColor={plan.popular ? '#6C5CE7' : colorMode === 'light' ? 'gray.200' : 'gray.700'}
              position="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              _hover={{ boxShadow: 'lg' }}
            >
              {plan.popular && (
                <Badge
                  colorScheme="purple"
                  position="absolute"
                  top={-3}
                  left="50%"
                  transform="translateX(-50%)"
                >
                  Most Popular
                </Badge>
              )}

              <Heading size="lg" mb={2}>
                {plan.name}
              </Heading>
              <Text color="gray.600" mb={4}>
                {plan.description}
              </Text>

              <VStack align="stretch" mb={6}>
                <HStack>
                  <Heading size="xl">{plan.price}</Heading>
                  <Text color="gray.600">{plan.period}</Text>
                </HStack>
              </VStack>

              <VStack align="stretch" spacing={3} mb={6}>
                {plan.features.map((feature, fidx) => (
                  <HStack key={fidx}>
                    <CheckIcon color="#00BFA6" />
                    <Text>{feature}</Text>
                  </HStack>
                ))}
              </VStack>

              <Button
                w="100%"
                bgGradient={plan.popular ? 'linear(90deg, #6C5CE7 0%, #00BFA6 100%)' : undefined}
                variant={plan.popular ? undefined : 'outline'}
                color={plan.popular ? 'white' : undefined}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
