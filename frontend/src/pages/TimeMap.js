import React from "react";
import { Box, Text, VStack, HStack, Circle } from "@chakra-ui/react";

function TimeMap({ events }) {
    return (
        <VStack spacing={6} align="stretch" px={6}>
            {events.map((event, index) => (
                <HStack key={event.id} align="flex-start" spacing={4}>
                    <Text fontSize="sm" color="gray.500" whiteSpace="nowrap" w="90px">
                        {event.date}
                    </Text>
                    <Box position="relative">
                        <Circle size="12px" bg={event.color} />
                        {index !== events.length - 1 && (
                            <Box
                                position="absolute"
                                top="12px"
                                left="5px"
                                width="2px"
                                height="100%"
                                bg="gray.300"
                            />
                        )}
                    </Box>
                    <Box>
                        <Text fontWeight="bold">{event.icon} {event.title}</Text>
                        <Text fontSize="sm" color="gray.600">
                            {event.type}
                        </Text>
                    </Box>
                </HStack>
            ))}
        </VStack>
    );
}

export default TimeMap;
