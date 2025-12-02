// src/pages/ForgotPasswordPage.tsx
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
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword, forgotSchema, ForgotPasswordInput } from '../api/auth';

const MotionBox = motion(Box);

type EmailForm = ForgotPasswordInput;

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<EmailForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = (data: EmailForm) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        // Success - show confirmation message and simulate button
      },
    });
  };

  const bg = '#050509';
  const cardBg = 'rgba(15,15,20,0.96)';
  const accentGold = '#F5C451';
  const mutedText = 'gray.400';

  return (
    <Box minH="100vh" bg={bg} display="flex" alignItems="center" justifyContent="center" py={8}>
      <MotionBox initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} w="100%">
        <Container maxW="sm">
          <VStack spacing={8}>
            <Box textAlign="center">
              <Heading size="lg" bgGradient="linear(to-r, #FFFFFF, #F5C451)" bgClip="text">Reset your password</Heading>
              <Text mt={2} color={mutedText} fontSize="sm">Enter the email associated with your account. We'll send a link to reset your password.</Text>
            </Box>

            <Box w="100%" p={8} bg={cardBg} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
              {forgotPasswordMutation.isError && (
                <Box mb={4} color="red.300">
                  {(forgotPasswordMutation.error as any)?.response?.data?.message || 'Unable to send reset link'}
                </Box>
              )}
              {forgotPasswordMutation.isSuccess ? (
                <>
                  <Box mb={4} color="green.200">If an account with that email exists, a reset link has been sent.</Box>
                  {/* <Text fontSize="sm" color={mutedText} mb={4}>For demo/testing you can simulate the reset link by clicking the button below (it will open the Reset Password page with a mock token).</Text>
                  <Button w="full" onClick={() => navigate('/reset-password?token=demo-token')} bg={accentGold} color="black">Open reset page (simulate link)</Button> */}
                </>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel fontSize="sm" color="gray.200">Email address</FormLabel>
                      <Input type="email" placeholder="you@example.com" {...register('email')} bg="black" color="white" _placeholder={{ color: 'whiteAlpha.500' }} />
                      <FormErrorMessage fontSize="xs">{errors.email?.message}</FormErrorMessage>
                    </FormControl>

                    <Button isLoading={forgotPasswordMutation.isPending} type="submit" bg={accentGold} color="black" borderRadius="full">Send reset link</Button>
                  </Stack>
                </form>
              )}
            </Box>

            <Text fontSize="sm" color={mutedText}>Remembered your password? <Box as="span" color="white" cursor="pointer" onClick={() => navigate('/login')}>Sign in</Box></Text>
          </VStack>
        </Container>
      </MotionBox>
    </Box>
  );
};
