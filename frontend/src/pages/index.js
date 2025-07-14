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
      if (stat.startsWith("Crit Rate")) return "Crit Rate";
      if (stat.startsWith("Crit DMG")) return "Crit DMG";
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
                    maxW="900px"
                    w="100%"
                >
                    {/* Fejléc: portré + név + constellation */}
                    <Flex align="center" mb={6} gap={6}>
                        <Image
                            src={selectedCharacter.icon}
                            alt={GetName(selectedCharacter.name)}
                            boxSize="100px"
                            borderRadius="full"
                            fallbackSrc="https://via.placeholder.com/100"
                        />
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold">
                                {GetName(selectedCharacter.name)}
                            </Text>
                            <Text fontSize="md" color="gray.600">
                                Lv. {selectedCharacter.level}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Constellation lvl: {selectedCharacter.constellation ?? 'N/A'}
                            </Text>
                        </Box>
                    </Flex>

                    {/* Fegyver */}
                    {selectedCharacter.weaponIcon && (
                        <Flex align="center" gap={4} mb={4}>
                            <Image
                                src={selectedCharacter.weaponIcon}
                                alt="Weapon"
                                boxSize="50px"
                                fallbackSrc="https://via.placeholder.com/50"
                            />
                            <Box>
                                <Text fontWeight="bold" fontSize="md">Weapon</Text>
                                <Text fontSize="sm">
                                    {selectedCharacter.weaponName ?? 'Unknown'}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Lv. {selectedCharacter.weaponLevel ?? '?'}
                                    {selectedCharacter.weaponRefinement ? ` • R${selectedCharacter.weaponRefinement}` : ''}
                                </Text>
                            </Box>
                        </Flex>
                    )}

                    {/* Artifacts */}
                    <Box mt={6}>
                      <Text fontWeight="bold" fontSize="md" mb={2}>
                        Artifacts
                      </Text>
                        <Flex gap={6} wrap="wrap" justify="flex-start" mt={4} maxW="100%">
                          {selectedCharacter.artifacts?.map((a, i) => (
                            <Box
                              key={i}
                              bgGradient="linear(to-br, gray.50, gray.100)"
                              border="2px solid"
                              borderColor={a.rarity === 5 ? "yellow.400" : "purple.400"}
                              borderRadius="lg"
                              p={4}
                              w="150px"
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
                                  boxSize="48px"
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
                                        {a.mainStat}
                                    </Box>
                                )}

                              {/* Substat list */}
                                {a.substats?.length > 0 && (
                                    <Flex direction="column" gap={1} mt={1}>
                                        {a.substats.map((sub, j) => (
                                            <Box
                                                key={j}
                                                className={`stat-box substat ${getStatType(sub)}`}
                                                onMouseEnter={() => setHoveredStat(getStatType(sub))}
                                                onMouseLeave={() => setHoveredStat(null)}
                                                transition="all 0.2s"
                                                boxShadow={hoveredStat && getStatType(sub) === hoveredStat ? "md" : "none"}
                                                opacity={hoveredStat && getStatType(sub) !== hoveredStat ? 0.5 : 1}
                                                filter={hoveredStat && getStatType(sub) !== hoveredStat ? "blur(1px)" : "none"}
                                                p={2}
                                                borderRadius="md"
                                                bg={hoveredStat && getStatType(sub) === hoveredStat ? "blue.50" : "gray.100"}
                                                fontSize="xs"
                                                color="gray.700"
                                            >
                                                • {sub}
                                            </Box>
                                        ))}
                                    </Flex>
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
                        </Flex>

                        <Box mt={4}>
                        <Text fontWeight="bold" fontSize="md" textAlign="center">
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