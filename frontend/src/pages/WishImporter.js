import React, { useState } from "react";
import {
    Box,
    Input,
    Button,
    Heading,
    Text,
    Code,
    useClipboard,
    Link
} from "@chakra-ui/react";

function WishImporter({ onUrlSubmit }) {
    const [logUrl, setLogUrl] = useState("");
    const { hasCopied, onCopy } = useClipboard("https://webstatic.mihoyo.com/hk4e/event/e20190909gacha/index.html?...example");

    const handleSubmit = () => {
        if (logUrl.includes("wishlog") || logUrl.includes("getGachaLog")) {
            onUrlSubmit(logUrl);
        } else {
            alert("Ez nem tűnik helyes log URL-nek.");
        }
    };

    return (
        <Box p={6} maxW="700px" mx="auto">
            <Heading size="md" mb={4}>🎓 Genshin Wish History Import</Heading>

            <Input
                placeholder="Illeszd be a wish log URL-t"
                value={logUrl}
                onChange={(e) => setLogUrl(e.target.value)}
                mb={3}
            />
            <Button colorScheme="teal" onClick={handleSubmit}>
                Importálás
            </Button>

            <Box mt={6} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                <Heading size="sm" mb={2}>📖 Hogyan szerezd meg a Log URL-t?</Heading>
                <ul style={{ marginLeft: "1em", fontSize: "0.95em", marginBottom: "1em" }}>
                    <li>1. Nyisd meg a Genshin Impactot.</li>
                    <li>2. Lépj be az <strong>Event Wishes</strong> ablakba, majd nyisd meg a <strong>Wish History</strong>-t.</li>
                    <li>3. Nyomd meg az <strong>F12</strong>-t a fejlesztői eszközök megnyitásához.</li>
                    <li>4. Navigálj a <strong>Network</strong> fülre, majd frissítsd az oldalt (F5).</li>
                    <li>5. Keresd a <Code>getGachaLog</Code> vagy <Code>wishlog</Code> kérést.</li>
                    <li>6. Jobb klikk → <strong>Copy → Copy link address</strong>.</li>
                </ul>

                <Box mt={4}>
                    <Text fontSize="sm" mb={1}>📋 Példa log URL:</Text>
                    <Code fontSize="xs" wordBreak="break-all" display="block" mb={2}>
                        https://webstatic.mihoyo.com/hk4e/event/e20190909gacha/index.html?...example
                    </Code>
                    <Button size="sm" onClick={onCopy}>
                        {hasCopied ? "✔️ Kimásolva!" : "Példa másolása"}
                    </Button>
                </Box>

                <Text mt={4} fontSize="xs" color="gray.500">
                    Tipp: Használhatsz exportáló eszközt is, pl. {" "}
                    <Link href="https://github.com/uknow6/Genshin-Wish-Exporter" isExternal color="blue.500">
                        Genshin Wish Exporter
                    </Link>.
                </Text>
            </Box>
        </Box>
    );
}

export default WishImporter;