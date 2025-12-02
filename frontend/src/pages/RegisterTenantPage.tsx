import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  VStack,
  SimpleGrid,
  Select,
  Textarea,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const COMPANY_SIZE_OPTIONS = [
  '1-24',
  '25-49',
  '50-99',
  '100-249',
  '250-599',
  '1000+',
] as const;

const SUBSCRIPTION_PLANS = ['Standard', 'Premium', 'Elite'] as const;

type CompanySize = (typeof COMPANY_SIZE_OPTIONS)[number];
type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

interface FormState {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  companyEmail: string;
  companyDomain: string;
  companySize: CompanySize | '';
  companyAddress: string;
  mobileNumber: string;
  companyMobileNumber: string;
  subscriptionPlan: SubscriptionPlan | '';
}

export const RegisterTenantPage = () => {
  const navigate = useNavigate();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentText = useColorModeValue('gray.600', 'gray.300');

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    companyEmail: '',
    companyDomain: '',
    companySize: '',
    companyAddress: '',
    mobileNumber: '',
    companyMobileNumber: '',
    subscriptionPlan: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Minimal client-side validation
    if (!form.companyName || !form.email) {
      alert('Please fill at least Company Name and Email.');
      return;
    }

    // TODO: Replace with API call
    console.log('Register payload:', form);
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={bg} display="flex" alignItems="center" justifyContent="center" py={12}>
      <MotionBox
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.32 }}
        w="full"
        maxW="container.md"
        px={4}
      >
        <Container maxW="container.md" p={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} alignItems="center">
            {/* Left / Brand panel */}
            <Box
              h="full"
              p={8}
              borderRadius="lg"
              bgGradient={useColorModeValue(
                'linear(to-br, purple.600, teal.400)',
                'linear(to-br, purple.700, teal.500)'
              )}
              color="white"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              boxShadow="lg"
            >
              <Heading size="lg" mb={3}>
                Welcome to HRMS
              </Heading>
              <Text mb={4} opacity={0.95}>
                Create your organization account and manage people, payroll and processes — all in one place.
              </Text>
              <VStack spacing={2} align="start" mt={4}>
                <Text fontSize="sm">Secure onboarding</Text>
                <Text fontSize="sm">30-day trial</Text>
                <Text fontSize="sm">No credit card required</Text>
              </VStack>
            </Box>

            {/* Right / Form panel */}
            <Box p={8} bg={cardBg} borderRadius="lg" boxShadow="0 8px 28px rgba(99, 102, 241, 0.08)">
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  <Box textAlign="center">
                    <Heading size="lg">Register Your Organization</Heading>
                    <Text mt={1} color={accentText} fontSize="sm">
                      Start your HRMS journey — add your admin details and company info.
                    </Text>
                  </Box>

                  {/* Name row */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl id="firstName">
                      <FormLabel>First name</FormLabel>
                      <Input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Jane"
                        autoComplete="given-name"
                      />
                    </FormControl>

                    <FormControl id="lastName">
                      <FormLabel>Last name</FormLabel>
                      <Input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        autoComplete="family-name"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl id="companyName">
                    <FormLabel>Company name</FormLabel>
                    <Input
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="Acme Ltd."
                    />
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl id="email">
                      <FormLabel>Your email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@personal.com"
                        autoComplete="email"
                      />
                    </FormControl>

                    <FormControl id="companyEmail">
                      <FormLabel>Company admin email</FormLabel>
                      <Input
                        name="companyEmail"
                        type="email"
                        value={form.companyEmail}
                        onChange={handleChange}
                        placeholder="admin@company.com"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl id="companyDomain">
                      <FormLabel>Company domain link</FormLabel>
                      <Input
                        name="companyDomain"
                        value={form.companyDomain}
                        onChange={handleChange}
                        placeholder="https://yourcompany.com"
                      />
                    </FormControl>

                    <FormControl id="companySize">
                      <FormLabel>Company size</FormLabel>
                      <Select
                        name="companySize"
                        value={form.companySize}
                        onChange={handleChange}
                        placeholder="Select size"
                      >
                        {COMPANY_SIZE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl id="companyAddress">
                    <FormLabel>Company address</FormLabel>
                    <Textarea
                      name="companyAddress"
                      value={form.companyAddress}
                      onChange={handleChange}
                      placeholder="Street, city, state, postcode, country"
                      rows={3}
                    />
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl id="mobileNumber">
                      <FormLabel>Mobile number (you)</FormLabel>
                      <Input
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        placeholder="+91 99999 99999"
                        inputMode="tel"
                      />
                    </FormControl>

                    <FormControl id="companyMobileNumber">
                      <FormLabel>Company mobile number</FormLabel>
                      <Input
                        name="companyMobileNumber"
                        value={form.companyMobileNumber}
                        onChange={handleChange}
                        placeholder="+1-555-0000"
                        inputMode="tel"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl id="subscriptionPlan">
                    <FormLabel>Subscription plan</FormLabel>
                    <Select
                      name="subscriptionPlan"
                      value={form.subscriptionPlan}
                      onChange={handleChange}
                      placeholder="Choose a plan"
                    >
                      {SUBSCRIPTION_PLANS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <HStack spacing={4}>
                    <Button
                      type="submit"
                      flex="1"
                      bgGradient="linear(90deg, #6C5CE7 0%, #00BFA6 100%)"
                      color="white"
                      _hover={{ opacity: 0.95 }}
                    >
                      Create Account
                    </Button>

                    <Button variant="outline" flex="1" onClick={() => navigate('/login')}>
                      Back to Login
                    </Button>
                  </HStack>

                  <Text fontSize="sm" color={accentText} textAlign="center" mt={2}>
                    By creating an account you agree to our Terms and Privacy Policy.
                  </Text>
                </VStack>
              </form>
            </Box>
          </SimpleGrid>
        </Container>
      </MotionBox>
    </Box>
  );
}
