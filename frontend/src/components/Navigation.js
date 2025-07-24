import React from "react";
import {Button, Stack, Link} from "@chakra-ui/react";

function Navigation() {
    return (
        <Stack
            direction="row"
            spacing={6}
            mb={6}
            justify="center"
            align="center"
            bg="rgba(255,255,255,0.01)"
            backdropFilter="blur(10px)"
            borderRadius="md"
            boxShadow="sm"
            p={4}
            border="0.1px solid rgba(255,255,255,0.1)"
        >
            <Button as={Link} href="/" colorScheme="blue" variant="solid" _hover={{bg: "blue.600"}}>
                Home
            </Button>
            <Button as={Link} href="/WishImporter" colorScheme="blue" variant="solid" _hover={{bg: "blue.600"}}>
                WishImporter
            </Button>
            <Button as={Link} href="/TimeLinePage" colorScheme="blue" variant="solid" _hover={{bg: "blue.600"}}>
                TimeMap
            </Button>
        </Stack>
    );
}

export default Navigation;