import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiCreditCard,
  FiBarChart2,
  FiFolder,
} from "react-icons/fi";

const MotionBox = motion(Box);

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};

const features = [
  {
    icon: FiUsers,
    title: "Employee Management",
    desc: "A unified employee record system with profiles, roles, team structures, document vault, and complete lifecycle tracking.",
  },
  {
    icon: FiClock,
    title: "Attendance & Shift Intelligence",
    desc: "Smart attendance, automated shift handling, overtime logic, and real-time visibility.",
  },
  {
    icon: FiCheckCircle,
    title: "Leave & Holiday Management",
    desc: "Configurable leave policies, approval workflows, auto-accruals, and holiday calendars.",
  },
  {
    icon: FiCreditCard,
    title: "Payroll & Payout Automation",
    desc: "Run payroll in hours with automatic calculations, statutory deductions, and secure payout exports.",
  },
  {
    icon: FiBarChart2,
    title: "HR & Workforce Analytics",
    desc: "Advanced dashboards for workforce trends, attrition prediction, cost tracking, and more.",
  },
  {
    icon: FiFolder,
    title: "Document Management & e-Sign",
    desc: "A secure digital vault with e-signatures, version tracking, expiry alerts, and controlled access.",
  },
];

const FeaturesSection = () => {
  const { colorMode } = useColorMode();
  const cardBg = "rgba(15,15,20,0.9)";
  const borders = "rgba(245,196,81,0.35)";
  const accent = "#F5C451";
  const muted = "gray.400";

  return (
    <Box id="features" mb={{ base: 16, md: 24 }} position="relative">
      {/* Floating Particles */}
      <Box
        position="absolute"
        inset="0"
        pointerEvents="none"
        opacity={0.15}
        zIndex={0}
      >
        {[...Array(10)].map((_, i) => (
          <MotionBox
            key={i}
            position="absolute"
            w="6px"
            h="6px"
            borderRadius="full"
            bg="whiteAlpha.500"
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </Box>

      {/* Section Header */}
      <MotionBox {...fadeUp} position="relative" zIndex={2} mb={10}>
        <VStack align="flex-start" spacing={2}>
          <Text fontSize="xs" textTransform="uppercase" color={muted}>
            Platform Capabilities
          </Text>
          <Heading size="lg">Everything HR needs, all in one place.</Heading>
          <Text fontSize="sm" color={muted} maxW="lg">
            From onboarding to payroll and compliance — HR flows become smarter,
            faster, and more collaborative.
          </Text>
        </VStack>
      </MotionBox>

      {/* Feature Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={7} zIndex={2} position="relative">
        {features.map((feature, idx) => (
          <MotionBox
            key={feature.title}
            borderRadius="xl"
            bg={cardBg}
            border="1px solid"
            borderColor="whiteAlpha.150"
            p={6}
            shadow="0 10px 35px rgba(0,0,0,0.55)"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.07 * idx }}
            whileHover={{
              y: -8,
              borderColor: borders,
              shadow: "0 16px 45px rgba(0,0,0,0.75)",
            }}
          >
            <HStack mb={4} spacing={4}>
              <MotionBox
                borderRadius="lg"
                bg="blackAlpha.600"
                border="1px solid"
                borderColor="whiteAlpha.200"
                p={3}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.15, rotate: 360 }}
              >
                <Icon as={feature.icon} boxSize={6} color={accent} />
              </MotionBox>

              <Heading size="sm">{feature.title}</Heading>
            </HStack>

            <Text fontSize="sm" color={muted} lineHeight="1.55">
              {feature.desc}
            </Text>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default FeaturesSection;
