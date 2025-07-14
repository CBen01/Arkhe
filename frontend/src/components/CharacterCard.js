import React from 'react';
import { Box, Image, Text, Badge, Flex, Tooltip } from '@chakra-ui/react';

export default function CharacterCard({ name, icon, level, weaponIcon, artifacts }) {
    return (
        <Box
            bg="white"
            border="1px solid #ddd"
            borderRadius="lg"
            p={4}
            boxShadow="md"
            w="200px"
            textAlign="center"
            position="relative"
        >
            <Image
                src={icon}
                alt={name}
                borderRadius="full"
                boxSize="96px"
                mx="auto"
                mb={2}
                fallbackSrc="https://via.placeholder.com/96"
            />

            <Text fontWeight="bold" fontSize="md">{name}</Text>

            <Badge mt={1} colorScheme="teal">Lv. {level}</Badge>

            {weaponIcon && (
                <Tooltip label="Fegyver">
                    <Image
                        src={weaponIcon}
                        alt="Weapon"
                        boxSize="40px"
                        mt={3}
                        mx="auto"
                        fallbackSrc="https://via.placeholder.com/40"
                    />
                </Tooltip>
            )}

            <Flex justify="center" mt={3} gap={1} wrap="wrap">
                {artifacts?.map((a, i) => (
                    <Tooltip key={i} label={`Artifact ${a.pos}`}>
                        <Image
                            src={a.icon}
                            alt={`Artifact ${a.pos}`}
                            boxSize="28px"
                            borderRadius="md"
                            fallbackSrc="https://via.placeholder.com/28"
                        />
                    </Tooltip>
                ))}
            </Flex>
        </Box>
    );
}
