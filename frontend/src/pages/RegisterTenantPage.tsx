// src/pages/RegisterTenantPage.tsx
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
  VStack,
  Select,
  Textarea,
  HStack,
  Grid,
  GridItem,
  useColorModeValue,
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

  const bg = '#050509';
  const cardBg = 'rgba(15,15,20,0.96)';
  const accentGold = '#F5C451';
  const mutedText = useColorModeValue('gray.400', 'gray.400');

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
    if (!form.companyName || !form.email) {
      alert('Please fill at least Company Name and Email.');
      return;
    }

    console.log('Register payload:', form);
    // TODO: call your API
    navigate('/login');
  };

  return (
    <Box
      minH="100vh"
      bg={bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={12}
      position="relative"
      overflow="hidden"
    >
      {/* soft radial background glow */}
      <Box
        position="absolute"
        top={-120}
        left={-80}
        w="48vmin"
        h="48vmin"
        bgGradient="radial(circle at center, rgba(245,196,81,0.06), transparent 55%)"
        filter="blur(42px)"
        pointerEvents="none"
        opacity={0.7}
      />

      <MotionBox
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        w="full"
        maxW="container.xl"
        px={{ base: 4, md: 8 }}
        zIndex={1}
      >
        <Container maxW="container.xl" p={0}>
          <Box
            bg={cardBg}
            p={{ base: 6, md: 10 }}
            borderRadius="2xl"
            border="1px solid"
            borderColor="whiteAlpha.100"
            boxShadow="0 30px 80px rgba(2,6,23,0.7)"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              left="12%"
              right="12%"
              h="1px"
              bgGradient={`linear(to-r, transparent, ${accentGold}, transparent)`}
              opacity={0.9}
            />

            <VStack spacing={6} align="stretch">
              {/* Header */}
              <VStack spacing={1} textAlign="center">
                <Box
                  mx="auto"
                  w={12}
                  h={12}
                  borderRadius="full"
                  bgGradient="conic-gradient(from 90deg, #F5C451, #FFFFFF, #F5C451)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow={`${accentGold}55 0px 0px 32px`}
                >
                  <Text fontWeight="bold" fontSize="sm" color="black">
                    GZ
                  </Text>
                </Box>

                <Heading
                  size="lg"
                  bgGradient="linear(to-r, #FFFFFF, #F5C451)"
                  bgClip="text"
                  letterSpacing="wide"
                >
                  Create Organization
                </Heading>
                <Text fontSize="sm" color={mutedText}>
                  Add admin & company details to start your free trial.
                </Text>
              </VStack>

              {/* Responsive Grid form: base 1, md 2, lg 3 columns */}
              <Box as="form" onSubmit={handleSubmit}>
                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                  gap={{ base: 4, md: 5, lg: 6 }}
                  alignItems="start"
                >
                  {/* Row 1: firstName, lastName, companyName */}
                  <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
                    <FormControl id="firstName">
                      <FormLabel fontSize="sm" color="gray.200">First name</FormLabel>
                      <Input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Giggle"
                        bg="rgba(255,255,255,0.03)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
                    <FormControl id="lastName">
                      <FormLabel fontSize="sm" color="gray.200">Last name</FormLabel>
                      <Input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Zen"
                        bg="rgba(255,255,255,0.03)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                      />
                    </FormControl>
                  </GridItem>

                  {/* companyName gets its own column on large screens */}
                  <GridItem colSpan={{ base: 1, md: 2, lg: 1 }}>
                    <FormControl id="companyName">
                      <FormLabel fontSize="sm" color="gray.200">Company name</FormLabel>
                      <Input
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="GiggleZen Ltd."
                        bg="rgba(255,255,255,0.03)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                      />
                    </FormControl>
                  </GridItem>

                  {/* Row 2: email, companyEmail, companyDomain */}
                  <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
                    <FormControl id="email">
                      <FormLabel fontSize="sm" color="gray.200">Your email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@personal.com"
                        bg="rgba(255,255,255,0.03)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
                    <FormControl id="companyEmail">
                      <FormLabel fontSize="sm" color="gray.200">Company admin email</FormLabel>
                      <Input
                        name="companyEmail"
                        type="email"
                        value={form.companyEmail}
                        onChange={handleChange}
                        placeholder="admin@company.com"
                        bg="rgba(255,255,255,0.03)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={{ base: 1, md: 2, lg: 1 }}>
                    <FormControl id="companyDomain">
                      <FormLabel fontSize="sm" color="gray.200">Company website</FormLabel>
                      <Input
                        name="companyDomain"
                        value={form.companyDomain}
                        onChange={handleChange}
                        placeholder="https://yourcompany.com"
                        bg="rgba(255,255,255,0.03)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                      />
                    </FormControl>
                  </GridItem>

                  {/* Row 3: companySize (1 col), subscriptionPlan (1 col), mobile (1 col) */}
                  <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
                    <FormControl id="companySize">
                      <FormLabel fontSize="sm" color="gray.200">Company size</FormLabel>
                      <Select
                        name="companySize"
                        value={form.companySize}
                        onChange={handleChange}
                        bg="rgba(255,255,255,0.02)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                        placeholder="Select size"
                      >
                        {COMPANY_SIZE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
                    <FormControl id="subscriptionPlan">
                      <FormLabel fontSize="sm" color="gray.200">Subscription plan</FormLabel>
                      <Select
                        name="subscriptionPlan"
                        value={form.subscriptionPlan}
                        onChange={handleChange}
                        bg="rgba(255,255,255,0.02)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                        placeholder="Choose a plan"
                      >
                        {SUBSCRIPTION_PLANS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
                    <FormControl id="mobileNumber">
                      <FormLabel fontSize="sm" color="gray.200">Mobile number (you)</FormLabel>
                      <Input
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        placeholder="+91 99999 99999"
                        inputMode="tel"
                        bg="rgba(255,255,255,0.03)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                      />
                    </FormControl>
                  </GridItem>

                  {/* Row 4: company phone (span two columns on md, 1 on lg) */}
                  <GridItem colSpan={{ base: 1, md: 2, lg: 2 }}>
                    <FormControl id="companyMobileNumber">
                      <FormLabel fontSize="sm" color="gray.200">Company phone</FormLabel>
                      <Input
                        name="companyMobileNumber"
                        value={form.companyMobileNumber}
                        onChange={handleChange}
                        placeholder="+1-555-0000"
                        inputMode="tel"
                        bg="rgba(255,255,255,0.03)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                      />
                    </FormControl>
                  </GridItem>

                  {/* companyAddress full width */}
                  <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
                    <FormControl id="companyAddress">
                      <FormLabel fontSize="sm" color="gray.200">Company address</FormLabel>
                      <Textarea
                        name="companyAddress"
                        value={form.companyAddress}
                        onChange={handleChange}
                        placeholder="Street, city, state, postcode, country"
                        rows={3}
                        bg="rgba(255,255,255,0.03)"
                        borderColor="whiteAlpha.200"
                        _focus={{ boxShadow: `0 0 0 1px ${accentGold}66`, borderColor: accentGold }}
                        color="white"
                      />
                    </FormControl>
                  </GridItem>

                  {/* Buttons full width (span all columns) */}
                  <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
                    <HStack spacing={4} pt={2}>
                      <Button
                        flex="1"
                        borderRadius="full"
                        borderColor="whiteAlpha.200"
                        onClick={() => navigate('/login')}
                      >
                        Back to Login
                      </Button>

                      <Button
                        type="submit"
                        flex="1"
                        bg={accentGold}
                        color="black"
                        fontWeight="semibold"
                        borderRadius="full"
                        _hover={{ transform: 'translateY(-1px)', boxShadow: '0 16px 32px rgba(0,0,0,0.6)' }}
                      >
                        Create Account
                      </Button>
                    </HStack>

                    <Text fontSize="xs" color={mutedText} textAlign="center" mt={4}>
                      By creating an account you agree to our Terms and Privacy Policy.
                    </Text>
                  </GridItem>
                </Grid>
              </Box>
            </VStack>
          </Box>
        </Container>
      </MotionBox>
    </Box>
  );
};
