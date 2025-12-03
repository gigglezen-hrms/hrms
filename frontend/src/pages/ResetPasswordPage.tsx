// src/pages/ResetPasswordPage.tsx
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
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResetPassword, resetSchema, ResetPasswordInput } from '../api/auth';

const MotionBox = motion(Box);

type ResetForm = ResetPasswordInput & { token: string };

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { token: tokenFromQuery },
  });

  const onSubmit = (data: ResetForm) => {
    const { token, ...resetData } = data;
    resetPasswordMutation.mutate({ token, ...resetData }, {
      onSuccess: () => {
        setTimeout(() => navigate('/login'), 1200);
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
              <Heading size="lg" bgGradient="linear(to-r, #FFFFFF, #F5C451)" bgClip="text">Create a new password</Heading>
              <Text mt={2} color={mutedText} fontSize="sm">Set your new password below.</Text>
            </Box>

            <Box w="100%" p={8} bg={cardBg} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
              {resetPasswordMutation.isError && (
                <Box mb={4} color="red.300">
                  {(resetPasswordMutation.error as any)?.response?.data?.message || 'Unable to reset password'}
                </Box>
              )}
              {resetPasswordMutation.isSuccess ? (
                <Box color="green.200">Password reset successfully. You can now sign in with your new password.</Box>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel fontSize="sm" color="gray.200">New password</FormLabel>
                      <Input type="password" placeholder="New password" {...register('password')} bg="black" color="white" />
                      <FormErrorMessage fontSize="xs">{errors.password?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirmPassword}>
                      <FormLabel fontSize="sm" color="gray.200">Confirm password</FormLabel>
                      <Input type="password" placeholder="Confirm password" {...register('confirmPassword')} bg="black" color="white" />
                      <FormErrorMessage fontSize="xs">{errors.confirmPassword?.message}</FormErrorMessage>
                    </FormControl>

                    <Input type="hidden" {...register('token')} />
                    <Button isLoading={resetPasswordMutation.isPending} type="submit" bg={accentGold} color="black" borderRadius="full">Reset password</Button>
                  </Stack>
                </form>
              )}
            </Box>

            <Text fontSize="sm" color={mutedText}>If you didn't request a password reset, ignore this message or contact support.</Text>
          </VStack>
        </Container>
      </MotionBox>
    </Box>
  );
};
