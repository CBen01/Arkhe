import React, { useState } from "react";
import {
    Flex,
    Input,
    Button,
    Heading,
    Image,
    Text,
    Box
} from "@chakra-ui/react";

function UidSearch() {
    const [uid, setUid] = useState('');
    const [result, setResult] = useState(null);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [hoveredStat, setHoveredStat] = useState(null);

    const handleSearch = async () => {
        const res = await fetch(`http://localhost:3001/api/uid/${uid}`);
        const data = await res.json();
        setResult(data);
        setSelectedCharacter(null); // reset when new search happens
    };


    const GetName = name => {
        if (name == "SkirkNew"){
            return "Skirk";
        }
        else{
            return name;
        }
    };

    const getStatType = stat => {
        if (stat.startsWith("Crit DMG")) return "Crit DMG";
        if (stat.startsWith("Crit Rate")) return "Crit Rate";
        if (stat.startsWith("HP%")) return "Hp%";
        if (stat.startsWith("HP")) return "HP";
        if (stat.startsWith("ATK%")) return "ATK%";
        if (stat.startsWith("ATK")) return "ATK";
        if (stat.startsWith("EM")) return "EM";
        if (stat.startsWith("ER%")) return "ER%";
        if (stat.startsWith("DEF%")) return "DEF%";
        if (stat.startsWith("DEF")) return "DEF";
        const match = stat.match(/^([A-Za-z\s]+?)(?:\s|$)/);
        return match ? match[1].trim() : stat;
    };


    // Helper to render stat details
    const renderStatBox = (label, value) => {
        const lower = label.toLowerCase();
        if (label === "HP") {
            return (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Image
                        src="/icons/Hp.png"
                        alt="HP"
                        boxSize="28px"
                        mb={1}
                    />
                    <Text fontWeight="bold">{Math.round(selectedCharacter.stats.base[lower])}</Text>
                    <Text fontSize="xs" color="gray.500">
                        {Math.round(selectedCharacter.stats.percent[lower])}
                        <span style={{ color: "#48BB78" }}>+ {Math.round(selectedCharacter.stats.base[lower] - selectedCharacter.stats.percent[lower])}</span>
                    </Text>
                </Box>
            );
        }
        if (["atk", "def"].includes(lower)) {
            return (
                <Box>
                    <Text fontWeight="bold">{Math.round(selectedCharacter.stats.base[lower])}</Text>
                    <Text fontSize="xs" color="gray.500">
                        {Math.round(selectedCharacter.stats.percent[lower])}
                        <span style={{ color: "#48BB78" }}>+ {Math.round(selectedCharacter.stats.base[lower] - selectedCharacter.stats.percent[lower])}</span>
                    </Text>
                </Box>
            );
        }
        return <Text>{value}</Text>;
    };

    return (
        <Flex minH="100vh" align="center" justify="center" direction="column" bg="gray.50">
            <Heading mb={6} textAlign="center" size="md">UID Search</Heading>
            <Flex mb={4}>
                <Input
                    value={uid}
                    onChange={e => setUid(e.target.value)}
                    placeholder="Enter UID"
                    mr={2}
                />
                <Button colorScheme="teal" onClick={handleSearch}>
                    Search
                </Button>
            </Flex>

            {/* Player Info */}
            {result?.playerStats && (
                <Flex direction="column" align="left" bg="white" p={4} rounded="md" boxShadow="md">
                    <Heading size="md" mb={4} textAlign="center" w="100%">
                        {result.playerStats.nickname}
                    </Heading>
                    <Text fontSize="lg" color="gray.600" textAlign="center">
                        AR: {result.playerStats.level}
                    </Text>
                    <Text fontSize="lg" color="gray.600">
                        Sign: {result.playerStats.signature}
                    </Text>
                    <Text fontSize="lg" color="gray.600" textAlign="center">
                        WorldLvl: {result.playerStats.worldLevel}
                    </Text>
                </Flex>
            )}

            {/* Character Avatars */}
            {result?.characters && (
                <Flex justify="center" align="center" gap={5} wrap="wrap" mt={4}>
                    {result.characters.map(char => (
                        <Flex key={char.id} direction="column" align="center">
                            <Box
                                as="button"
                                onClick={() =>
                                    setSelectedCharacter(selectedCharacter?.id === char.id ? null : char)
                                }
                                bg={selectedCharacter?.id === char.id ? "blue.400" : "rgba(0,0,0,0.7)"}
                                border="2px solid"
                                borderColor="green.400"
                                rounded="full"
                                transition="background 0.2s"
                                _hover={selectedCharacter?.id === char.id ? {} : { bg: "blue.400" }}
                                p={1}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                                mt="-10px"
                                w="60px"
                                h="60px"
                                overflow="visible"
                            >
                                <Image
                                    src={char.icon}
                                    alt={GetName(char.name)}
                                    boxSize="82px"
                                    borderRadius="full"
                                    objectFit="cover"
                                    position="absolute"
                                    top="-26px"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    zIndex={2}
                                    pointerEvents="none"
                                />
                                {/* Level box */}
                                <Box
                                    position="absolute"
                                    bottom="-6px"
                                    right="-8px"
                                    bg="gray.700"
                                    color="white"
                                    px={2}
                                    py={0.5}
                                    borderRadius="md"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    zIndex={3}
                                    minW="24px"
                                    textAlign="center"
                                >
                                    {char.level}
                                </Box>
                            </Box>
                            <Text fontSize="sm" color="gray.800" mt={2}>
                                {GetName(char.name)}
                            </Text>
                        </Flex>
                    ))}
                </Flex>
            )}

            {/* Character Card Below Everything */}
            {selectedCharacter && (
                <Box
                    bg="white"
                    border="2px solid #3182ce"
                    borderRadius="xl"
                    boxShadow="xl"
                    p={6}
                    mt={8}
                    maxW="1000px"
                    w="100%"
                >
                    <Flex direction={{ base: "column", md: "row" }} mb={6} gap={6} justify="space-between">
                        {/* BAL OLDAL – Stat Panel */}
                        <Box flex="1">
                            <Heading size="sm" mb={2}>Stats</Heading>
                            <Flex wrap="wrap" gap={3}>
                                {[
                                    ["HP", selectedCharacter.stats.hp],
                                    ["ATK", selectedCharacter.stats.atk],
                                    ["DEF", selectedCharacter.stats.def],
                                    ["EM", Math.round(selectedCharacter.stats.em)],
                                    ["Crit Rate", `${(selectedCharacter.stats.critRate * 100).toFixed(1)}%`],
                                    ["Crit DMG", `${(selectedCharacter.stats.critDmg * 100).toFixed(1)}%`],
                                    ["ER%", `${(selectedCharacter.stats.er * 100).toFixed(1)}%`],
                                    ["Elemental Bonus", `${(selectedCharacter.stats.bonus * 100).toFixed(1)}%`]
                                ].map(([label, value], i) => {
                                    const statType = getStatType(label);
                                    const isActive = hoveredStat && statType === hoveredStat;
                                    const isInactive = hoveredStat && statType !== hoveredStat;
                                    return (
                                        <Box
                                            key={i}
                                            p={3}
                                            bg={isActive ? "blue.100" : "white"}
                                            borderRadius="lg"
                                            fontSize="md"
                                            minW="100px"
                                            className={`stat-box char-stat ${statType}`}
                                            onMouseEnter={() => setHoveredStat(statType)}
                                            onMouseLeave={() => setHoveredStat(null)}
                                            transition="all 0.2s"
                                            boxShadow={isActive ? "0 4px 16px rgba(49,130,206,0.15)" : "0 2px 8px rgba(0,0,0,0.04)"}
                                            border={isActive ? "2px solid #3182ce" : "1px solid #e2e8f0"}
                                            opacity={isInactive ? 0.5 : 1}
                                            filter={isInactive ? "blur(1px)" : "none"}
                                            display="flex"
                                            flexDirection="column"
                                            alignItems="center"
                                        >
                                            <Text fontWeight="medium" color="gray.500" fontSize="sm" mb={1} textAlign="center" w="100%">
                                                {label}
                                            </Text>
                                            <Box fontWeight="bold" fontSize="xl" color={isActive ? "blue.700" : "gray.800"}>
                                                {renderStatBox(label, value)}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Flex>

                            {/* Talentek */}
                            <Box mt={4}>
                                <Heading size="sm" mb={2}>Talents</Heading>
                                <Flex gap={4}>
                                    <Text fontSize="sm">Normal: {selectedCharacter.talents.normal}</Text>
                                    <Text fontSize="sm">Skill: {selectedCharacter.talents.skill}</Text>
                                    <Text fontSize="sm">Burst: {selectedCharacter.talents.burst}</Text>
                                </Flex>
                            </Box>
                        </Box>

                        {/* JOBB OLDAL – Portré + Név + Fegyver */}
                        <Flex direction="column" align="center">
                            <Image
                                src={selectedCharacter.icon}
                                alt={selectedCharacter.name}
                                boxSize="72px"
                                borderRadius="full"
                                fallbackSrc="https://via.placeholder.com/100"
                                mb={3}
                            />
                            <Text fontSize="xl" fontWeight="bold">
                                {GetName(selectedCharacter.name)}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Lv. {selectedCharacter.level} • C{selectedCharacter.constellation}
                            </Text>

                            {/* Fegyver */}
                            {selectedCharacter.weaponIcon && (
                                <Flex align="center" gap={3} mt={3}>
                                    <Image
                                        src={selectedCharacter.weaponIcon}
                                        alt="Weapon"
                                        boxSize="36px"
                                        fallbackSrc="https://via.placeholder.com/42"
                                    />
                                    <Box>
                                        <Text fontSize="lg">{selectedCharacter.weaponName}</Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Lv. {selectedCharacter.weaponLevel} • R{selectedCharacter.weaponRefinement}
                                        </Text>
                                    </Box>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>


                    {/* Artifacts */}
                    <Box mt={6}>
                        <Text fontWeight="bold" fontSize="md" mb={2}>
                            Artifacts
                        </Text>
                        <Box
                            display="grid"
                            gridTemplateColumns={{
                                base: "repeat(2, minmax(0, 1fr))", // 2 columns on mobile
                                md: "repeat(3, minmax(0, 1fr))",   // 3 columns on tablet
                                lg: "repeat(5, minmax(0, 1fr))"    // 5 columns on desktop
                            }}
                            gap={4}
                            mt={4}
                            w="100%"
                        >
                            {selectedCharacter.artifacts?.map((a, i) => (
                                <Box
                                    key={i}
                                    bgGradient="linear(to-br, gray.50, gray.100)"
                                    border="2px solid"
                                    borderColor={a.rarity === 5 ? "yellow.400" : "purple.400"}
                                    borderRadius="lg"
                                    p={2}
                                    w="160px"
                                    boxShadow="lg"
                                    transition="transform 0.2s, box-shadow 0.2s"
                                    _hover={{
                                        transform: "scale(1.05)",
                                        boxShadow: "xl",
                                    }}
                                >
                                    {/* Icon with level at bottom right */}
                                    <Box position="relative" mb={3} display="flex" justifyContent="center" alignItems="center">
                                        <Image
                                            src={a.icon}
                                            alt={`Artifact ${a.pos}`}
                                            boxSize="40px"
                                            fallbackSrc="https://via.placeholder.com/48"
                                        />
                                        <Text
                                            position="absolute"
                                            bottom="2px"
                                            right="4px"
                                            fontSize="xs"
                                            color="gray.500"
                                            bg="whiteAlpha.800"
                                            px={1}
                                            borderRadius="sm"
                                            fontWeight="bold"
                                        >
                                            +{a.level - 1 ?? "?"}
                                        </Text>
                                    </Box>

                                    {/* Main stat */}
                                    {a.mainStat && (
                                        <Box
                                            className={`stat-box main-stat ${getStatType(a.mainStat)}`}
                                            onMouseEnter={() => setHoveredStat(getStatType(a.mainStat))}
                                            onMouseLeave={() => setHoveredStat(null)}
                                            transition="all 0.2s"
                                            boxShadow={hoveredStat && getStatType(a.mainStat) === hoveredStat ? "md" : "none"}
                                            opacity={hoveredStat && getStatType(a.mainStat) !== hoveredStat ? 0.5 : 1}
                                            filter={hoveredStat && getStatType(a.mainStat) !== hoveredStat ? "blur(1px)" : "none"}
                                            mb={2}
                                            p={2}
                                            borderRadius="md"
                                            bg={hoveredStat && getStatType(a.mainStat) === hoveredStat ? "blue.50" : "gray.100"}
                                            fontWeight="semibold"
                                            fontSize="sm"
                                            textAlign="center"
                                        >
                                            {getStatType(a.mainStat) === "HP" ? (
                                                <Image src="/icons/Hp.png" alt="HP" boxSize="24px" mx="auto" />
                                            ) : (
                                                a.mainStat
                                            )}
                                        </Box>
                                    )}

                                    {/* Substat list */}
                                    {a.substats?.length > 0 && (
                                        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1} mt={1}>
                                            {a.substats?.map((sub, j) => {
                                                const statType = getStatType(sub.name);
                                                return (
                                                    <Box
                                                        key={j}
                                                        className={`stat-box substat ${statType}`}
                                                        onMouseEnter={() => setHoveredStat(statType)}
                                                        onMouseLeave={() => setHoveredStat(null)}
                                                        transition="all 0.2s"
                                                        boxShadow={hoveredStat && statType === hoveredStat ? "md" : "none"}
                                                        opacity={hoveredStat && statType !== hoveredStat ? 0.5 : 1}
                                                        filter={hoveredStat && statType !== hoveredStat ? "blur(1px)" : "none"}
                                                        p={1}
                                                        borderRadius="md"
                                                        bg={hoveredStat && statType === hoveredStat ? "blue.50" : "gray.100"}
                                                        fontSize="xs"
                                                        color="gray.700"
                                                        display="flex"
                                                        alignItems="center"
                                                        flexDirection="column"
                                                    >
                                                        <Box display="flex" alignItems="center">
                                                            {statType === "HP" ? (
                                                                <>
                                                                    <Image src="/icons/Hp.png" alt="HP" boxSize="14px" mr={1} />
                                                                    <Text as="span" fontWeight="semibold" color="black">
                                                                        +{sub.rawValue}
                                                                    </Text>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Text as="span" fontWeight="semibold" color="black" mr={1}>
                                                                        {sub.name}
                                                                    </Text>
                                                                    <Text as="span" color="gray.800">
                                                                        +{sub.rawValue}
                                                                    </Text>
                                                                </>
                                                            )}
                                                        </Box>
                                                        {/* Rolls visualization */}
                                                        <Flex w="100%" mt={1} mb={-1} justify="center">
                                                            {[...Array(sub.rolls)].map((_, idx) => (
                                                                <Box
                                                                    key={idx}
                                                                    h="3px"
                                                                    flex="1"
                                                                    mx="1px"
                                                                    bg="blue.300"
                                                                    borderRadius="full"
                                                                />
                                                            ))}
                                                        </Flex>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}

                                    {/* CV centered below icon */}
                                    {a.cv !== undefined && (
                                        <Text
                                            fontSize="xs"
                                            color="blue.600"
                                            fontWeight="semibold"
                                            textAlign="center"
                                            mt={2}
                                        >
                                            CV: {a.cv}
                                        </Text>
                                    )}
                                </Box>
                            ))}
                        </Box>

                        <Box mt={4}>
                            <Text fontWeight="bold" fontSize="sm" textAlign="center">
                                Total CV: {
                                selectedCharacter.artifacts
                                    ?.reduce((sum, a) => sum + (a.cv || 0), 0)
                                    .toFixed(1)
                            }
                            </Text>
                        </Box>
                    </Box>
                </Box>
            )}



            {result && !result.characters && (
                <Box mt={4} p={4} bg="gray.100" rounded="md">
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </Box>
            )}
        </Flex>
    );
}

export default UidSearch;