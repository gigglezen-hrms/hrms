// import {
//   Box,
//   Button,
//   Heading,
//   HStack,
//   SimpleGrid,
//   Text,
//   VStack,
//   Icon,
//   Badge,
// } from "@chakra-ui/react";
// import { FiCheckCircle } from "react-icons/fi";
// import { ArrowForwardIcon } from "@chakra-ui/icons";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const MotionBox = motion(Box);

// const cardBg = "rgba(15,15,20,0.85)";
// const accentGold = "rgb(245, 196, 81)";
// const mutedText = "gray.400";

// const glowHover = {
//   scale: 1.04,
//   translateY: -12,
//   boxShadow: `
//     0 0 22px rgba(245,196,81,0.65),
//     0 0 40px rgba(245,196,81,0.35),
//     0 0 70px rgba(245,196,81,0.25)
//   `,
//   borderColor: accentGold,
// };

// export const PricingPage = () => {
//   const navigate = useNavigate();

//   return (
//     <Box bg="#050509" minH="100vh" color="white" py={20} px={6}>
//       <Box maxW="6xl" mx="auto">
//         {/* Header */}
//         <VStack align="center" spacing={4} mb={16}>
//           <Text fontSize="xs" textTransform="uppercase" color={mutedText}>
//             Simple & Transparent
//           </Text>
//           <Heading size="2xl">Pricing Plans</Heading>
//           <Text fontSize="md" color={mutedText} maxW="lg" textAlign="center">
//             Whether you're a startup or a 10,000-employee enterprise, HRMS Pro
//             scales with you.
//           </Text>
//         </VStack>

//         {/* Pricing Grid */}
//         <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
//           {/* STARTER */}
//           <MotionBox
//             p={8}
//             borderRadius="2xl"
//             bg={cardBg}
//             border="1px solid"
//             borderColor="whiteAlpha.200"
//             boxShadow="0 10px 25px rgba(0,0,0,0.55)"
//             whileHover={glowHover}
//             transition={{ duration: 0.35 }}
//           >
//             <Heading size="lg">Starter</Heading>
//             <Text fontSize="sm" color={mutedText} mb={6}>
//               Best for small teams just getting started.
//             </Text>

//             <HStack spacing={2} mb={6}>
//               <Heading size="2xl">₹99</Heading>
//               <Text color={mutedText}>/month</Text>
//             </HStack>

//             <VStack align="flex-start" spacing={3} mb={8}>
//               {[
//                 "Up to 25 employees",
//                 "Basic attendance",
//                 "Leave management",
//                 "Email support",
//               ].map((item) => (
//                 <HStack key={item} spacing={2}>
//                   <Icon as={FiCheckCircle} color={accentGold} />
//                   <Text>{item}</Text>
//                 </HStack>
//               ))}
//             </VStack>

//             <Button
//               w="full"
//               bg="black"
//               border="1px solid"
//               borderColor={accentGold}
//               color={accentGold}
//               _hover={{ bg: "whiteAlpha.200" }}
//               onClick={() => navigate("/register")}
//             >
//               Get Started
//             </Button>
//           </MotionBox>

//           {/* PREMIUM (MOST POPULAR) */}
//           <MotionBox
//             p={8}
//             position="relative"
//             borderRadius="2xl"
//             border="1px solid"
//             borderColor={accentGold}
//             bgGradient="linear(to-b, rgba(245,196,81,0.18), rgba(15,15,20,0.9))"
//             boxShadow="0 12px 30px rgba(0,0,0,0.65)"
//             whileHover={glowHover}
//             transition={{ duration: 0.35 }}
//           >
//             <Badge
//               position="absolute"
//               top={-3}
//               left="50%"
//               transform="translateX(-50%)"
//               bg={accentGold}
//               color="black"
//               px={3}
//               py={1}
//               borderRadius="full"
//             >
//               Most Popular
//             </Badge>

//             <Heading size="lg">Premium</Heading>
//             <Text fontSize="sm" color={mutedText} mb={6}>
//               Ideal for growing companies with real HR complexity.
//             </Text>

//             <HStack spacing={2} mb={6}>
//               <Heading size="2xl">₹299</Heading>
//               <Text color={mutedText}>/month</Text>
//             </HStack>

//             <VStack align="flex-start" spacing={3} mb={8}>
//               {[
//                 "Up to 500 employees",
//                 "Geo attendance tracking",
//                 "Full payroll automation",
//                 "Priority support",
//                 "Custom analytics",
//               ].map((item) => (
//                 <HStack key={item} spacing={2}>
//                   <Icon as={FiCheckCircle} color={accentGold} />
//                   <Text>{item}</Text>
//                 </HStack>
//               ))}
//             </VStack>

//             <Button
//               w="full"
//               bg={accentGold}
//               color="black"
//               rightIcon={<ArrowForwardIcon />}
//               _hover={{ bg: "#e5b842" }}
//               onClick={() => navigate("/register")}
//             >
//               Start Free Trial
//             </Button>
//           </MotionBox>

//           {/* ENTERPRISE */}
//           <MotionBox
//             p={8}
//             borderRadius="2xl"
//             bg={cardBg}
//             border="1px solid"
//             borderColor="whiteAlpha.200"
//             boxShadow="0 10px 25px rgba(0,0,0,0.55)"
//             whileHover={glowHover}
//             transition={{ duration: 0.35 }}
//           >
//             <Heading size="lg">Elite</Heading>
//             <Text fontSize="sm" color={mutedText} mb={6}>
//               Tailored for large organizations.
//             </Text>

//             <HStack spacing={2} mb={6}>
//               <Heading size="2xl">Custom</Heading>
//               <Text color={mutedText}>/month</Text>
//             </HStack>

//             <VStack align="flex-start" spacing={3} mb={8}>
//               {[
//                 "Unlimited employees",
//                 "Multi-location support",
//                 "Dedicated account manager",
//                 "Custom workflows",
//                 "Advanced compliance & audits",
//               ].map((item) => (
//                 <HStack key={item} spacing={2}>
//                   <Icon as={FiCheckCircle} color={accentGold} />
//                   <Text>{item}</Text>
//                 </HStack>
//               ))}
//             </VStack>

//             <Button
//               w="full"
//               variant="outline"
//               borderColor={accentGold}
//               color={accentGold}
//               _hover={{ bg: "whiteAlpha.100" }}
//               onClick={() => navigate("/register")}
//             >
//               Contact Sales
//             </Button>
//           </MotionBox>
//         </SimpleGrid>
//       </Box>
//     </Box>
//   );
// };

// export default PricingPage;

import {
  Box,
  Button,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const cardBg = "rgba(15,15,20,0.85)";
const accentGold = "rgb(245, 196, 81)";
const mutedText = "gray.400";

const glowHover = {
  scale: 1.04,
  translateY: -12,
  boxShadow: `
    0 0 22px rgba(245,196,81,0.65),
    0 0 40px rgba(245,196,81,0.35),
    0 0 70px rgba(245,196,81,0.25)
  `,
  borderColor: accentGold,
};

export const PricingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✔ Show Back button only when page is opened via route (ex: /pricing)
  const showBackButton = location.pathname === "/pricing";

  return (
    <Box bg="#050509" minH="100vh" color="white" py={20} px={6}>
      <Box maxW="6xl" mx="auto">

        {/* Back Button — Only visible on /pricing */}
        {showBackButton && (
          <Button
            mb={8}
            variant="outline"
            borderColor={accentGold}
            color={accentGold}
            size="sm"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
        )}

        {/* Header */}
        <VStack align="center" spacing={4} mb={16}>
          <Text fontSize="xs" textTransform="uppercase" color={mutedText}>
            Simple & Transparent
          </Text>
          <Heading size="2xl">Pricing Plans</Heading>
          <Text fontSize="md" color={mutedText} maxW="lg" textAlign="center">
            Whether you're a startup or a 10,000-employee enterprise, HRMS Pro
            scales with you.
          </Text>
        </VStack>

        {/* Pricing Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>

          {/* STARTER PLAN */}
          <MotionBox
            p={8}
            borderRadius="2xl"
            bg={cardBg}
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="0 10px 25px rgba(0,0,0,0.55)"
            whileHover={glowHover}
            transition={{ duration: 0.35 }}
          >
            <Heading size="lg">Starter</Heading>
            <Text fontSize="sm" color={mutedText} mb={6}>
              Best for small teams just getting started.
            </Text>

            <HStack spacing={2} mb={6}>
              <Heading size="2xl">₹99</Heading>
              <Text color={mutedText}>/month</Text>
            </HStack>

            <VStack align="flex-start" spacing={3} mb={8}>
              {[
                "Up to 25 employees",
                "Basic attendance",
                "Leave management",
                "Email support",
              ].map((item) => (
                <HStack key={item} spacing={2}>
                  <Icon as={FiCheckCircle} color={accentGold} />
                  <Text>{item}</Text>
                </HStack>
              ))}
            </VStack>

            <Button
              w="full"
              bg="black"
              border="1px solid"
              borderColor={accentGold}
              color={accentGold}
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
          </MotionBox>

          {/* PREMIUM PLAN (Most Popular) */}
          <MotionBox
            p={8}
            position="relative"
            borderRadius="2xl"
            border="1px solid"
            borderColor={accentGold}
            bgGradient="linear(to-b, rgba(245,196,81,0.18), rgba(15,15,20,0.9))"
            boxShadow="0 12px 30px rgba(0,0,0,0.65)"
            whileHover={glowHover}
            transition={{ duration: 0.35 }}
          >
            <Badge
              position="absolute"
              top={-3}
              left="50%"
              transform="translateX(-50%)"
              bg={accentGold}
              color="black"
              px={3}
              py={1}
              borderRadius="full"
            >
              Most Popular
            </Badge>

            <Heading size="lg">Premium</Heading>
            <Text fontSize="sm" color={mutedText} mb={6}>
              Ideal for growing companies with real HR complexity.
            </Text>

            <HStack spacing={2} mb={6}>
              <Heading size="2xl">₹299</Heading>
              <Text color={mutedText}>/month</Text>
            </HStack>

            <VStack align="flex-start" spacing={3} mb={8}>
              {[
                "Up to 500 employees",
                "Geo attendance tracking",
                "Full payroll automation",
                "Priority support",
                "Custom analytics",
              ].map((item) => (
                <HStack key={item} spacing={2}>
                  <Icon as={FiCheckCircle} color={accentGold} />
                  <Text>{item}</Text>
                </HStack>
              ))}
            </VStack>

            <Button
              w="full"
              bg={accentGold}
              color="black"
              rightIcon={<ArrowForwardIcon />}
              _hover={{ bg: "#e5b842" }}
              onClick={() => navigate("/register")}
            >
              Start Free Trial
            </Button>
          </MotionBox>

          {/* ENTERPRISE PLAN */}
          <MotionBox
            p={8}
            borderRadius="2xl"
            bg={cardBg}
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="0 10px 25px rgba(0,0,0,0.55)"
            whileHover={glowHover}
            transition={{ duration: 0.35 }}
          >
            <Heading size="lg">Elite</Heading>
            <Text fontSize="sm" color={mutedText} mb={6}>
              Tailored for large organizations.
            </Text>

            <HStack spacing={2} mb={6}>
              <Heading size="2xl">Custom</Heading>
              <Text color={mutedText}>/month</Text>
            </HStack>

            <VStack align="flex-start" spacing={3} mb={8}>
              {[
                "Unlimited employees",
                "Multi-location support",
                "Dedicated account manager",
                "Custom workflows",
                "Advanced compliance & audits",
              ].map((item) => (
                <HStack key={item} spacing={2}>
                  <Icon as={FiCheckCircle} color={accentGold} />
                  <Text>{item}</Text>
                </HStack>
              ))}
            </VStack>

            <Button
              w="full"
              variant="outline"
              borderColor={accentGold}
              color={accentGold}
              _hover={{ bg: "whiteAlpha.100" }}
              onClick={() => navigate("/register")}
            >
              Contact Sales
            </Button>
          </MotionBox>

        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default PricingPage;
