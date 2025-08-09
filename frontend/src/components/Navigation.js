import React, { useEffect, useState } from "react";
                                import {
                                    Button,
                                    Stack,
                                    Flex,
                                    Text,
                                    Menu,
                                    MenuButton,
                                    MenuList,
                                    MenuItem,
                                } from "@chakra-ui/react";
                                import Link from "next/link";
                                import { ChevronDownIcon } from "@chakra-ui/icons";
                                import { useRouter } from "next/router";
                                import { supabase } from "@/pages/api/supabase";

                                function Navigation() {
                                    const [user, setUser] = useState(null);
                                    const router = useRouter();

                                    useEffect(() => {
                                        supabase.auth.getUser().then(({ data }) => setUser(data?.user));
                                        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
                                            setUser(session?.user || null);
                                        });
                                        return () => listener?.subscription.unsubscribe();
                                    }, []);

                                    const handleLogout = async () => {
                                        await supabase.auth.signOut();
                                        setUser(null);
                                        router.push("/");
                                    };

                                    return (
                                        <Flex
                                            position="relative"
                                            align="center"
                                            mb={6}
                                            bg="rgba(255,255,255,0.01)"
                                            backdropFilter="blur(10px)"
                                            borderRadius="md"
                                            boxShadow="sm"
                                            p={4}
                                            border="0.1px solid rgba(255,255,255,0.1)"
                                        >
                                            <Flex flex="1" justify="center">
                                                <Stack direction="row" spacing={6}>
                                                    <Button as={Link} href="/" colorScheme="blue" variant="solid">
                                                        Home
                                                    </Button>
                                                    <Button as={Link} href="/WishImporter" colorScheme="blue" variant="solid">
                                                        WishImporter
                                                    </Button>
                                                    <Button as={Link} href="/TimeLinePage" colorScheme="blue" variant="solid">
                                                        TimeMap
                                                    </Button>
                                                </Stack>
                                            </Flex>

                                            <Flex position="absolute" right={4} align="center">
                                                {!user ? (
                                                    <Stack direction="row" spacing={4} align="center">
                                                        <Button
                                                            colorScheme="teal"
                                                            onClick={() => router.push({ pathname: "/signin", query: { mode: "login" } })}
                                                        >
                                                            Log In
                                                        </Button>
                                                        <Button
                                                            colorScheme="teal"
                                                            variant="outline"
                                                            onClick={() => router.push({ pathname: "/signin", query: { mode: "signup" } })}
                                                        >
                                                            Sign Up
                                                        </Button>
                                                    </Stack>
                                                ) : (
                                                    <Menu>
                                                        <MenuButton
                                                            as={Button}
                                                            rightIcon={<ChevronDownIcon />}
                                                            variant="ghost"
                                                            px={2}
                                                        >
                                                            <Text as="span">{user.user_metadata?.user_name || user.email}</Text>
                                                        </MenuButton>
                                                        <MenuList>
                                                            <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
                                                            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                )}
                                            </Flex>
                                        </Flex>
                                    );
                                }

                                export default Navigation;