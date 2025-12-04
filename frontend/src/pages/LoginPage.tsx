// src/pages/LoginPage.tsx
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  HStack,
  FormErrorMessage,
  Checkbox,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useLogin } from '../api/auth';
import { loginSchema, LoginInput } from '../lib/validations/auth';

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

type LoginFormInputs = LoginInput & { remember?: boolean };

export const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  });

  useEffect(() => {
    // restore remembered email if any
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setValue('email', remembered);
      setValue('remember', true);
    }
  }, [setValue]);

  const onSubmit = (data: LoginFormInputs) => {
    const { remember, ...loginData } = data;
    
    loginMutation.mutate(loginData, {
      onSuccess: () => {
        console.log('Login successful, tokens stored');
        // save/clear remembered email
        if (remember) {
          localStorage.setItem('rememberedEmail', data.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        // Add a small delay to ensure state updates and then redirect
        setTimeout(() => {
          const token = localStorage.getItem('accessToken');
          console.log('Token exists:', !!token);
          navigate('/dashboard', { replace: true });
        }, 100);
      },
    });
  };

  const bg = '#050509';
  const cardBg = 'rgba(15,15,20,0.96)';
  const accentGold = '#F5C451';
  const mutedText = 'gray.400';

  return (
    <Box
      minH="100vh"
      bg={bg}
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={8}
    >
      <Box position="absolute" inset={0} bgGradient="radial(circle at top, rgba(245,196,81,0.16), transparent 55%)" opacity={0.9} pointerEvents="none" />
      <Box position="absolute" bottom={-120} right={-80} w="60vmin" h="60vmin" bgGradient="radial(circle, rgba(255,255,255,0.06), transparent 65%)" filter="blur(4px)" pointerEvents="none" />

      <MotionBox initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} w="100%" zIndex={1}>
        <Container maxW="sm">
          <VStack spacing={8}>
            <MotionStack spacing={2} textAlign="center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Box mx="auto" w={10} h={10} borderRadius="full" bgGradient="conic-gradient(from 90deg, #F5C451, #FFFFFF, #F5C451)" display="flex" alignItems="center" justifyContent="center" boxShadow="0 0 32px rgba(245,196,81,0.75)" mb={2}>
                <Text fontWeight="bold" fontSize="sm" color="black">GZ</Text>
              </Box>

              <Heading size="xl" bgGradient="linear(to-r, #FFFFFF, #F5C451)" bgClip="text"letterSpacing="wide" lineHeight="1.3" py="1"> GiggleZen
              </Heading>

              <Text fontSize="sm" color={mutedText}>Sign in to your workspace</Text>
            </MotionStack>

            <MotionBox w="100%" p={8} bg={cardBg} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.150" boxShadow="0 24px 60px rgba(0,0,0,0.8)" position="relative" overflow="hidden" whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 210, damping: 26 }}>
              <Box position="absolute" top={0} left="10%" right="10%" h="1px" bgGradient="linear(to-r, transparent, rgba(245,196,81,0.6), transparent)" />
              <Box position="absolute" inset={-40} bgGradient="radial(circle at top, rgba(245,196,81,0.2), transparent 55%)" opacity={0.4} pointerEvents="none" />

              <Box position="relative">
                {loginMutation.isError && (
                  <Box p={3} mb={5} bg="rgba(254, 178, 178, 0.12)" color="red.300" borderRadius="md" border="1px solid" borderColor="red.500" fontSize="sm">
                    {(loginMutation.error as any)?.response?.data?.message || 'Login failed. Please try again.'}
                  </Box>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel fontSize="sm" color="gray.200">Email Address</FormLabel>
                      <Input type="email" placeholder="admin@techinnovations.com" {...register('email')} bg="black" borderColor="whiteAlpha.200" _hover={{ borderColor: 'whiteAlpha.400' }} _focus={{ borderColor: accentGold, boxShadow: '0 0 0 1px rgba(245,196,81,0.8)' }} color="white" _placeholder={{ color: 'whiteAlpha.500' }} />
                      <FormErrorMessage fontSize="xs">{errors.email?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel fontSize="sm" color="gray.200">Password</FormLabel>
                      <Input type="password" placeholder="password" {...register('password')} bg="black" borderColor="whiteAlpha.200" _hover={{ borderColor: 'whiteAlpha.400' }} _focus={{ borderColor: accentGold, boxShadow: '0 0 0 1px rgba(245,196,81,0.8)' }} color="white" _placeholder={{ color: 'whiteAlpha.500' }} />
                      <FormErrorMessage fontSize="xs">{errors.password?.message}</FormErrorMessage>
                    </FormControl>

                    <HStack justify="space-between" align="center">
                      <Checkbox {...register('remember')} color="white" defaultChecked={false}>
                        <Text fontSize="sm" color="white">Remember me</Text>
                      </Checkbox>

                      <Box as={RouterLink} to="/forgot-password" fontSize="sm" fontWeight="600" bgGradient="linear(to-r, #FFFFFF, #F5C451)" bgClip="text">
                        Forgot password?
                      </Box>
                    </HStack>

                    <Button isLoading={loginMutation.isPending} loadingText="Signing in..." bg={accentGold} color="black" w="100%" type="submit" fontWeight="semibold" borderRadius="full" mt={2} _hover={{ bg: '#e5b842', transform: 'translateY(-1px)', boxShadow: '0 16px 32px rgba(0,0,0,0.7)' }} _active={{ transform: 'translateY(0px)', boxShadow: 'none' }} transition="all 0.18s ease-out">
                      Sign In
                    </Button>
                  </Stack>
                </form>
{/* 
                <Box mt={6} textAlign="center" fontSize="xs" color={mutedText}>
                  <Text mb={2} textTransform="uppercase" letterSpacing="widest">Demo credentials</Text>
                  <Text>Email: admin@example.com</Text>
                  <Text>Password: password</Text>
                </Box> */}
              </Box>
            </MotionBox>

            <HStack gap={2} fontSize="sm" color={mutedText}>
              <Text>Don&apos;t have an account?</Text>
              <Box as={RouterLink} to="/register" fontWeight="600" bgGradient="linear(to-r, #FFFFFF, #F5C451)" bgClip="text">Sign up</Box>
            </HStack>
          </VStack>
        </Container>
      </MotionBox>
    </Box>
  );
};
