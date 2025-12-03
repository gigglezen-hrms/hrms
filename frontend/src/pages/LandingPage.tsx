import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  HStack,
  VStack,
  SimpleGrid,
  Icon,
  useColorMode,
  useBreakpointValue,
  Divider,
  Avatar,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FeaturesSection from "./FeaturesPage";
import {
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiCreditCard,
  FiBarChart2,
  FiShield,
  FiCpu,
  FiFolder,
  FiHeadphones,
} from "react-icons/fi";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import PricingPage from "./PricingPage";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);
const MotionHStack = motion(HStack);
const MotionButton = motion(Button);
const MotionIcon = motion(Icon);
const MotionSpan = motion("span");
const MotionText = motion(Text);
const workflow = [
  {
    step: "01",
    title: "Onboard your team",
    body: "Import employees in bulk or add them in seconds. Set locations, departments, and managers.",
  },
  {
    step: "02",
    title: "Automate HR operations",
    body: "Let workflows handle attendance, leave, and approvals with minimal manual intervention.",
  },
  {
    step: "03",
    title: "Run payroll in hours",
    body: "Pull attendance, compute payouts, and generate payslips with a single flow.",
  },
];

const stats = [
  { label: "Reduction in HR Ops time", value: "40%" },
  { label: "Faster payroll processing", value: "3x" },
  { label: "Less manual errors", value: "60%" },
];

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Head of People, Fintech Co.",
    quote:
      "HRMS Pro helped us centralize attendance, leave, and payroll. Our HR team finally has time for people, not paperwork.",
  },
  {
    name: "Rahul Verma",
    role: "HR Manager, SaaS Startup",
    quote:
      "The dashboard gives me real-time visibility into headcount, leaves, and payroll. No more juggling spreadsheets.",
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const bg = "#050509";
  const cardBg =
    colorMode === "light" ? "rgba(15,15,20,0.9)" : "rgba(15,15,20,0.9)";
  const borderGold = "rgba(245,196,81,0.4)";
  const accentGold = "#F5C451";
  const mutedText = "gray.400";

  return (
    <Box bg={bg} color="white" minH="100vh">
      {/* Subtle gradient background overlay */}
      <Box
        position="fixed"
        inset={0}
        pointerEvents="none"
        bgGradient="radial(circle at top, rgba(245,196,81,0.18), transparent 60%)"
        opacity={0.9}
        zIndex={0}
      />

      {/* Navigation */}
      <Box
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
        position="sticky"
        top={0}
        zIndex={10}
        bg="rgba(5,5,9,0.95)"
        backdropFilter="blur(14px)"
      >
        <Container maxW="6xl" px={6} py={4}>
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Box
                w={8}
                h={8}
                borderRadius="full"
                bgGradient="conic-gradient(from 90deg, #F5C451, #FFFFFF, #F5C451)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 0 24px rgba(245,196,81,0.6)"
              >
                <Text fontWeight="bold" fontSize="sm" color="black">
                  GZ
                </Text>
              </Box>
              <Heading
                size="md"
                bgGradient="linear(to-r, #FFFFFF, #F5C451)"
                bgClip="text"
                letterSpacing="widest"
              >
                GiggleZen
              </Heading>
            </HStack>
            <MotionHStack
              gap={4}
              display={{ base: "none", md: "flex" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.15 }}
            >
              {/* Features */}
              <MotionButton
                variant="ghost"
                size="sm"
                color="whiteAlpha.700" // half white
                whileHover={{
                  scale: 1.1,
                  y: -3,
                  boxShadow: "0 0 12px 4px rgba(255, 215, 0, 0.8)", // golden glow
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
                _hover={{
                  bg: "whiteAlpha.100",
                  color: "white", // bright white on hover
                  boxShadow: "0 0 12px 4px rgba(255, 215, 0, 0.8)", // glow fallback
                }}
                onClick={() => {
                  const el = document.getElementById("features");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Features
              </MotionButton>

              {/* Pricing */}
              <MotionButton
                variant="ghost"
                size="sm"
                color="whiteAlpha.700" // half white
                whileHover={{
                  scale: 1.1,
                  y: -3,
                  boxShadow: "0 0 12px 4px rgba(255, 215, 0, 0.8)", // golden glow
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
                _hover={{
                  bg: "whiteAlpha.100",
                  color: "white",
                  boxShadow: "0 0 12px 4px rgba(255, 215, 0, 0.8)",
                }}
                onClick={() => navigate("/pricing")}
              >
                Pricing
              </MotionButton>

              {/* Register */}
              <MotionButton
                variant="outline"
                size="sm"
                borderColor={accentGold}
                color="whiteAlpha.700" // half white when normal
                whileHover={{
                  scale: 1.1,
                  y: -3,
                  boxShadow: "0px 0px 10px rgba(244,197,66,0.4)", // golden glow
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
                _hover={{
                  bg: "whiteAlpha.100",
                  color: "white", // full bright white on hover
                }}
                onClick={() => navigate("/register")}
              >
                Register
              </MotionButton>

              {/* Login */}
              <MotionButton
                size="sm"
                bg={accentGold}
                color="black"
                whileHover={{
                  scale: 1.12,
                  y: -3,
                  boxShadow: "0px 0px 12px rgba(244,197,66,0.6)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 200 }}
                _hover={{ bg: "#e5b842" }}
                onClick={() => navigate("/login")}
              >
                Login
              </MotionButton>
            </MotionHStack>
            {/* Mobile right slot */}
            <HStack gap={2} display={{ base: "flex", md: "none" }}>
              <Button
                size="xs"
                variant="outline"
                borderColor={accentGold}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
              <Button
                size="xs"
                bg={accentGold}
                color="black"
                _hover={{ bg: "#e5b842" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Content */}
      <Box position="relative" zIndex={1}>
        <Container maxW="6xl" px={6} py={{ base: 12, md: 20 }}>
          {/* Hero Section */}
          <MotionStack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 10, md: 16 }}
            align="center"
            justify="space-between"
            mb={{ base: 16, md: 20 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <VStack
              align="flex-start"
              spacing={6}
              maxW={{ base: "full", md: "lg" }}
            >
              <Badge
  px={3}
  py={1}
  borderRadius="full"
  bg="whiteAlpha.100"
  border="1px solid"
  borderColor="whiteAlpha.200"
  fontSize="xs"
  fontWeight="medium"
  textTransform="uppercase"
  letterSpacing="widest"
  color="whiteAlpha.700"            // half-white normal
  transition="all 0.2s ease"        // smooth hover
  _hover={{
    color: "white",                 // full bright white
    boxShadow: "0 0 10px rgba(244,197,66,0.6)", // golden glow
    borderColor: "rgba(244,197,66,0.6)",
  }}
>
  HR MANAGEMENT · ATTENDANCE · PAYROLL
</Badge>


              <Heading
                as="h1"
                fontSize={{ base: "2.4rem", md: "3.2rem" }}
                lineHeight="1.1"
              >
                All-in-one{" "}
                <Box
                  as="span"
                  bgGradient="linear(to-r, #FFFFFF, #F5C451)"
                  bgClip="text"
                >
                  HR management
                </Box>{" "}
                for modern teams.
              </Heading>

              <Text fontSize="md" color={mutedText} maxW="lg">
                Centralise employees, automate attendance, approve leave in one
                click, and run payroll in hours instead of days — with an
                interface your team will actually enjoy using.
              </Text>

              <HStack spacing={4} flexWrap="wrap">
                <Button
                  size="lg"
                  bg={accentGold}
                  color="black"
                  rightIcon={<ArrowForwardIcon />}
                  _hover={{ bg: "#e5b842", transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0px)" }}
                  onClick={() => navigate("/register")}
                >
                  Start free trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="whiteAlpha.400"
                  color={"whiteAlpha.700"}
                  _hover={{ bg: "whiteAlpha.100" }}
                  onClick={() => {
                    const el = document.getElementById("features");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  View features
                </Button>
              </HStack>

              <HStack spacing={8} pt={4} flexWrap="wrap">
                <HStack spacing={2}>
                  <Box w={2} h={2} borderRadius="full" bg={accentGold} />
                  <Text fontSize="xs" color={mutedText}>
                    No credit card required
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Box w={2} h={2} borderRadius="full" bg="green.400" />
                  <Text fontSize="xs" color={mutedText}>
                    Go live in under a week
                  </Text>
                </HStack>
              </HStack>
            </VStack>

            {/* Hero Dashboard Preview */}
            <MotionBox
              flex="1"
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              whileHover={{ translateY: -6 }}
            >
              <Box
                borderRadius="2xl"
                bg={cardBg}
                border="1px solid"
                borderColor={borderGold}
                boxShadow="0 24px 60px rgba(0,0,0,0.65)"
                p={5}
                position="relative"
                overflow="hidden"
              >
                {/* floating glow */}
                <Box
                  position="absolute"
                  inset={-40}
                  bgGradient="radial(circle at 0% 0%, rgba(245,196,81,0.18), transparent 55%)"
                  opacity={0.8}
                  pointerEvents="none"
                />

                <Stack spacing={4} position="relative">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={mutedText}>
                      Today&apos;s overview
                    </Text>
                    <Badge
                      bg="black"
                      border="1px solid"
                      borderColor={accentGold}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                    >
                      Live HR Snapshot
                    </Badge>
                  </HStack>

                  {/* Stats row */}
                  <SimpleGrid columns={3} spacing={3}>
                    {[
                      { label: "Active employees", value: "148" },
                      { label: "Present today", value: "132" },
                      { label: "Pending leaves", value: "9" },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        borderRadius="lg"
                        bg="whiteAlpha.50"
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                        p={3}
                      >
                        <Text fontSize="xs" color={mutedText}>
                          {item.label}
                        </Text>
                        <Text fontWeight="semibold" fontSize="lg">
                          {item.value}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>

                  {/* Attendance / Leave strip */}
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    spacing={3}
                    pt={2}
                    align={{ base: "stretch", sm: "center" }}
                  >
                    <Box
                      flex={1}
                      borderRadius="lg"
                      bgGradient="linear(to-r, rgba(245,196,81,0.12), transparent)"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      p={3}
                    >
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="xs" color={mutedText}>
                          Attendance
                        </Text>
                        <Text fontSize="xs" color={accentGold}>
                          Live
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Box
                          flex={1}
                          h={1.5}
                          borderRadius="full"
                          bg="green.400"
                        />
                        <Box
                          flex={0.5}
                          h={1.5}
                          borderRadius="full"
                          bg="yellow.400"
                        />
                        <Box
                          flex={0.7}
                          h={1.5}
                          borderRadius="full"
                          bg="red.400"
                        />
                      </HStack>
                    </Box>
                    <Box
                      flex={{ base: 1, sm: 0.9 }}
                      borderRadius="lg"
                      bg="whiteAlpha.50"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      p={3}
                    >
                      <Text fontSize="xs" color={mutedText}>
                        Next payroll
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        5 days left · Draft ready
                      </Text>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </MotionBox>
          </MotionStack>

          <FeaturesSection />
          {/* Workflow + Stats */}
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 10, md: 16 }}
            mb={{ base: 16, md: 20 }}
            align="flex-start"
          >
            {/* Workflow */}
            <MotionBox
              flex={1}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <Text
                fontSize="xs"
                textTransform="uppercase"
                color={mutedText}
                mb={1}
              >
                How it works
              </Text>
              <Heading size="md" mb={5}>
                Go live in three simple steps.
              </Heading>

              <VStack align="stretch" spacing={5}>
                {workflow.map((item) => (
                  <HStack key={item.step} align="flex-start" spacing={4}>
                    <Box
                      borderRadius="full"
                      border="1px solid"
                      borderColor={accentGold}
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="medium"
                      bg="black"
                    >
                      {item.step}
                    </Box>
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="semibold">{item.title}</Text>
                      <Text fontSize="sm" color={mutedText}>
                        {item.body}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </MotionBox>

            {/* Stats */}
            <MotionBox
              flex={1}
              borderRadius="2xl"
              bg={cardBg}
              border="1px solid"
              borderColor="whiteAlpha.100"
              boxShadow="0 18px 46px rgba(0,0,0,0.7)"
              p={6}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <Text
                fontSize="xs"
                textTransform="uppercase"
                color={mutedText}
                mb={1}
              >
                Outcomes
              </Text>
              <Heading size="sm" mb={4}>
                Designed for HR teams that do more with less.
              </Heading>

              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} mb={4}>
                {stats.map((item) => (
                  <Box key={item.label}>
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color={accentGold}
                    >
                      {item.value}
                    </Text>
                    <Text fontSize="xs" color={mutedText}>
                      {item.label}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>

              <Divider borderColor="whiteAlpha.200" my={4} />

              <Text fontSize="xs" color={mutedText}>
                Built for HR, finance, founders, and people managers to
                collaborate on one source of truth for your workforce.
              </Text>
            </MotionBox>
          </Stack>

          <PricingPage />

          {/* Testimonials */}
          <MotionBox
            mb={{ base: 16, md: 20 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <HStack
              justify="space-between"
              mb={6}
              align={{ base: "flex-start", md: "center" }}
            >
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="xs" textTransform="uppercase" color={mutedText}>
                  Teams that trust HRMS Pro
                </Text>
                <Heading size="md">
                  HR that people actually love to use.
                </Heading>
              </VStack>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {testimonials.map((t, idx) => (
                <MotionBox
                  key={t.name}
                  borderRadius="2xl"
                  bg={cardBg}
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  p={6}
                  boxShadow="0 16px 40px rgba(0,0,0,0.7)"
                  whileHover={{ translateY: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.08 * idx }}
                >
                  <Text fontSize="sm" color={mutedText} mb={4}>
                    “{t.quote}”
                  </Text>
                  <HStack spacing={3}>
                    <Avatar size="sm" name={t.name} />
                    <VStack align="flex-start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium">
                        {t.name}
                      </Text>
                      <Text fontSize="xs" color={mutedText}>
                        {t.role}
                      </Text>
                    </VStack>
                  </HStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
          {/* Final CTA */}
          <MotionHStack
            borderRadius="2xl"
            bgGradient="linear(to-r, rgba(245,196,81,0.16), transparent)"
            border="1px solid"
            borderColor={borderGold}
            p={{ base: 6, md: 8 }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            spacing={6}
            direction={{ base: "column", md: "row" } as any}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <VStack align="flex-start" spacing={2}>
              <Heading size="md">
                Ready to modernize your HR operations?
              </Heading>
              <Text fontSize="sm" color={mutedText}>
                Create your account in minutes, invite your team, and see how
                HRMS Pro simplifies attendance, leave, and payroll from day one.
              </Text>
            </VStack>
            <HStack spacing={3}>
              <Button
                size="md"
                bg="black"
                color={accentGold}
                border="1px solid"
                borderColor={accentGold}
                rightIcon={<ArrowForwardIcon />}
                _hover={{ bg: "whiteAlpha.100" }}
                onClick={() => navigate("/register")}
              >
                Register now
              </Button>
              <Button
                size="md"
                variant="ghost"
                _hover={{ bg: "whiteAlpha.100" }}
                onClick={() => navigate("/pricing")}
              >
                View pricing
              </Button>
            </HStack>
          </MotionHStack>
        </Container>
      </Box>
    </Box>
  );
};
