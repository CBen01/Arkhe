import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Input, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { supabase } from "@/pages/api/supabase";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

function Signin() {
    const router = useRouter();
    const initialMode = router.query.mode || "login";
    const [mode, setMode] = useState(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMode(router.query.mode || "login");
    }, [router.query.mode]);

    const handleAuth = async () => {
        setLoading(true);
        setError("");
        if (mode === "signup") {
            if (!username) {
                setError("Username is required.");
                setLoading(false);
                return;
            }
            // Sign up user
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { user_name: username }
                }
            });
            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }
            // Insert profile row
            const userId = data?.user?.id;
            if (userId) {
                const { error: profileError } = await supabase
                    .from("Profiles")
                    .insert([{ user_id: userId, username, email }]);
                if (profileError) {
                    setError(profileError.message);
                    setLoading(false);
                    return;
                }
            }
            setError("");
            // Optionally redirect or show success
        } else {
            // Log in user
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (signInError) setError(signInError.message);
        }
        setLoading(false);
    };

    const handleModeToggle = () => {
        const newMode = mode === "signup" ? "login" : "signup";
        setMode(newMode);
        router.push(
            { pathname: "/signin", query: { mode: newMode } },
            undefined,
            { shallow: true, scroll: false }
        );
    };

    return (
        <Box position="relative" minH="100vh" w="100vw" overflowX="hidden">
            <Box
                position="fixed"
                top={0}
                left={0}
                w="100%"
                h="100%"
                zIndex={-2}
                backgroundImage="url('/bg.png')"
                backgroundSize="cover"
                backgroundPosition="center"
                filter="blur(0px) brightness(0.7)"
            />
            <Box
                position="fixed"
                inset={0}
                w="100%"
                h="100%"
                bg="rgba(0,0,0,0.4)"
                zIndex={-1}
            />
            <Flex minH="100vh" align="center" justify="center" direction="column" bg="transparent">
                <Text
                    mb="60px"
                    color="white"
                    fontFamily="'UnifrakturCook', cursive"
                    fontWeight="700"
                    fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                    textAlign="center"
                    letterSpacing="widest"
                    lineHeight="1.2"
                    textShadow="0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(255,255,255,0.2)"
                >
                    {mode === "signup" ? "Create an Account" : "Welcome Back"}
                </Text>
                <AnimatePresence mode="wait">
                    <MotionBox
                        key={mode}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        bg="rgba(255,255,255,0.08)"
                        boxShadow="0 8px 32px 0 rgba(31,38,135,0.37)"
                        backdropFilter="blur(12px)"
                        borderRadius="2xl"
                        p={8}
                        minW={{ base: "90vw", md: "320px" }}
                        maxW="360px"
                        color="white"
                        border="1.5px solid rgba(255,255,255,0.18)"
                    >
                        <Heading mb={6} textAlign="center" size="md">
                            {mode === "signup" ? "Sign Up" : "Log In"}
                        </Heading>
                        {mode === "signup" && (
                            <Input
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Username"
                                mb={4}
                                borderColor="gray.900"
                                borderWidth="1.5px"
                                color="white"
                            />
                        )}
                        <Input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                            mb={4}
                            borderColor="gray.900"
                            borderWidth="1.5px"
                            color="white"
                        />
                        <Input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                            type="password"
                            mb={4}
                            borderColor="gray.900"
                            borderWidth="1.5px"
                            color="white"
                        />
                        {error && (
                            <Text color="red.400" mb={2} textAlign="center">
                                {error}
                            </Text>
                        )}
                        <Button
                            colorScheme="teal"
                            w="100%"
                            onClick={handleAuth}
                            isLoading={loading}
                            mb={2}
                        >
                            {mode === "signup" ? "Sign Up" : "Log In"}
                        </Button>
                        <Button
                            variant="link"
                            color="blue.300"
                            w="100%"
                            onClick={handleModeToggle}
                        >
                            {mode === "signup" ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                        </Button>
                    </MotionBox>
                </AnimatePresence>
            </Flex>
        </Box>
    );
}

export default Signin;