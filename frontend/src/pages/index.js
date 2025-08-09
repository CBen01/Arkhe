import React, {useState, useRef} from "react";
import {
    Flex,
    Input,
    Button,
    Heading,
    Image,
    Text,
    Box
} from "@chakra-ui/react";
import {keyframes} from "@emotion/react";
import weaponNames from "../../../shared/weaponNames.json";
import {FaLock, FaArrowRight} from "react-icons/fa";
import html2canvas from "html2canvas";

function UidSearch() {
    const [uid, setUid] = useState('');
    const [result, setResult] = useState(null);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [hoveredStat, setHoveredStat] = useState(null);
    const cardRef = useRef();

    const handleDownloadCard = async () => {
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: null,
            useCORS: true,
            scale: 2
        });
        const link = document.createElement("a");
        link.download = `${selectedCharacter?.name || "character"}-card.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const statIcons = {
        "HP": "/icons/Hp.png",
        "ATK": "/icons/Atk.png",
        "DEF": "/icons/Def.png",
        "EM": "/icons/Em.png",
        "Crit Rate": "/icons/CritRate.png",
        "Crit DMG": "/icons/CritDmg.png",
        "ER%": "/icons/Er.png",
    };

    const elementColors = {
        anemo: '#549485',
        pyro: '#782d16',
        hydro: '#185999',
        electro: '#592882',
        cryo: '#277991',
        geo: '#967721',
        dendro: '#62911f'
    };

    function getSwappedCharacter(character) {
        if (!character) return character;
        switch (character.name) {
            case "Furina":
                return {...character, C2: character.C6, C6: character.C2};
            case "Shougun":
                return {...character, C2: character.C4, C4: character.C2};
            case "Hutao":
                return {...character, C1: character.C4, C4: character.C2, C2: character.C1};
            case "Momoka":
                return {...character, C4: character.C6, C6: character.C4};
            default:
                return character;
        }
    }

    const handleSearch = async () => {
        const res = await fetch(`http://localhost:3001/api/uid/${uid}`);
        const data = await res.json();
        setResult(data);
        setSelectedCharacter(null);
    };

    const GetName = name => {
        if (name === "SkirkNew") {
            return "Skirk";
        }   else if (name === "Momoka") {
            return "Kirara";
        }
        else {
            return name;
        }
    };

    const getStatType = stat => {
        if (stat.startsWith("Crit DMG")) return "Crit DMG";
        if (stat.startsWith("Crit Rate")) return "Crit Rate";
        if (stat.startsWith("HP%")) return "HP%";
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

    function GetWeaponName(name) {
        return weaponNames[name] || name;
    }

    const fadeSlide = keyframes`
        0% {
            opacity: 0;
            transform: translateY(-20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    `;

    function renderStatBox(label, value) {
        const lower = label.toLowerCase();
        const isBreakdown = ["HP", "ATK", "DEF"].includes(label);
        return (
            <Flex align="center" justify="space-between" w="100%" mb={2}>
                <Flex align="center">
                    <Image src={statIcons[label]} alt={label} boxSize="22px" mr={2}/>
                    <Text fontWeight="medium" color="white">{label}</Text>
                </Flex>
                <Box textAlign="right">
                    <Text fontWeight="bold" color="white" fontSize="md">
                        {isBreakdown ? Math.round(selectedCharacter.stats.base[lower]) : value}
                    </Text>
                    {isBreakdown && (
                        <Text fontSize="xs" color="white">
                            {Math.round(selectedCharacter.stats.percent[lower])}
                            <span style={{color: "#48BB78"}}>
                                + {Math.round(selectedCharacter.stats.base[lower] - selectedCharacter.stats.percent[lower])}
                            </span>
                        </Text>
                    )}
                </Box>
            </Flex>
        );
    }

    // Prepare swapped character and card background color
    const swappedCharacter = getSwappedCharacter(selectedCharacter);
    const elementKey = swappedCharacter?.element?.toLowerCase();
    const cardBg = elementKey && elementColors[elementKey]
           ? elementColors[elementKey] + "b3"
           : "rgba(255,255,255,0.6)";

    return (
        <Box position="relative" minH="100vh" w="100vw" overflowX="hidden">
            {/* Blurred background image */}
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
            {/* Overlay for better contrast */}
            <Box
                position="fixed"
                inset={0}
                w="100%"
                h="100%"
                bg="rgba(0,0,0,0.4)"
                zIndex={-1}
            />
            {/* Main content */}
            <Flex minH="100vh" align="center" justify="center" direction="column" bg="transparent">
                <Text
                    mb="100px"
                    mt="-50px"
                    color="white"
                    fontFamily="'UnifrakturCook', cursive"
                    fontWeight="700"
                    fontSize={{base: "2xl", md: "3xl", lg: "4xl"}}
                    textAlign="center"
                    letterSpacing="widest"
                    lineHeight="1.2"
                    textShadow="0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(255,255,255,0.2)"
                    animation={`${fadeSlide} 1.5s ease-out`}
                >
                    Welcome Traveler!
                </Text>
                <Box
                    bg="rgba(255,255,255,0.08)"
                    boxShadow="0 8px 32px 0 rgba(31,38,135,0.37)"
                    backdropFilter="blur(12px)"
                    borderRadius="2xl"
                    p={8}
                    minW={{base: "90vw", md: "600px"}}
                    color="white"
                    border="1.5px solid rgba(255,255,255,0.18)"
                >
                    <Heading mb={6} textAlign="center" size="md">UID Search</Heading>
                    <Flex mb={4} justify="center" w="100%">
                        <Flex maxW="300px" w="100%">
                            <Input
                                value={uid}
                                onChange={e => setUid(e.target.value)}
                                placeholder="Enter UID"
                                mr={2}
                                borderColor="gray.900"
                                borderWidth="1.5px"
                                maxW="300px"
                                w="100%"
                            />
                            <Button colorScheme="blackAlpha" onClick={handleSearch}>
                                <FaArrowRight />
                            </Button>
                        </Flex>
                    </Flex>

                    {/* Player Info */}
                    {result?.playerStats && (
                        <Flex direction="column" align="left" bg="white" p={4} rounded="md" boxShadow="md" w="100%"
                              maxW="500px" mx="auto" bg="rgba(0,0,0,0.4)">
                            <Heading size="md" mb={4} textAlign="center" w="100%">
                                {result.playerStats.nickname}
                            </Heading>
                            <Text fontSize="lg" color="white" textAlign="center">
                                AR: {result.playerStats.level}
                            </Text>
                            <Text fontSize="lg" color="white" textAlign="center">
                                Sign: {result.playerStats.signature}
                            </Text>
                            <Text fontSize="lg" color="white" textAlign="center">
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
                                        bg={selectedCharacter?.id === char.id ? "blue.400" : "rgba(0,0,0,0.2)"}
                                        border="2px solid"
                                        borderColor="green.400"
                                        rounded="full"
                                        transition="background 0.2s"
                                        _hover={selectedCharacter?.id === char.id ? {} : {bg: "blue.400"}}
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
                                            bg="gray.900"
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
                                    <Text fontSize="sm" color="white" mt={2}>
                                        {GetName(char.name)}
                                    </Text>
                                </Flex>
                            ))}
                        </Flex>
                    )}

                    {/* Character Card */}
                    {selectedCharacter && (
                        <Box
                            bg={cardBg}
                            ref={cardRef}
                            border="2px solid rgba(0,0,0,0.37)"
                            borderRadius="xl"
                            boxShadow="xl"
                            p={6}
                            mt={8}
                            maxW="1000px"
                            w="100%"
                        >
                            <Flex direction={{base: "column", md: "row"}} mb={6} gap={6} justify="space-between">
                                {/* Left: Stat Panel */}
                                <Box flex="none" minW="300px" maxW="360px">
                                    <Heading size="sm" mb={2}>Stats</Heading>
                                    <Box>
                                        {[
                                            ["HP", selectedCharacter.stats.hp],
                                            ["ATK", selectedCharacter.stats.atk],
                                            ["DEF", selectedCharacter.stats.def],
                                            ["EM", Math.round(selectedCharacter.stats.em)],
                                            ["Crit Rate", `${(selectedCharacter.stats.critRate * 100).toFixed(1)}%`],
                                            ["Crit DMG", `${(selectedCharacter.stats.critDmg * 100).toFixed(1)}%`],
                                            ["ER%", `${(selectedCharacter.stats.er * 100).toFixed(1)}%`],
                                            ["Elemental Bonus", `${(selectedCharacter.stats.bonus * 100).toFixed(1)}%`]
                                        ].map(([label, value], i) => (
                                            <Box
                                                key={i}
                                                className={`stat-box char-stat ${getStatType(label)}`}
                                                onMouseEnter={() => setHoveredStat(getStatType(label))}
                                                onMouseLeave={() => setHoveredStat(null)}
                                                transition="all 0.2s"
                                                border={hoveredStat && getStatType(label) === hoveredStat ? "2px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.1)"}
                                                borderRadius="md"
                                                bg={hoveredStat && getStatType(label) === hoveredStat ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.1)"}
                                                opacity={hoveredStat && getStatType(label) !== hoveredStat ? 0.5 : 1}
                                                filter={hoveredStat && getStatType(label) !== hoveredStat ? "blur(1px)" : "none"}
                                                mb={1}
                                                p={2}
                                            >
                                                {renderStatBox(label, value)}
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Talents */}
                                    <Box mt={4}>
                                        <Heading size="sm" mb={2}>Talents</Heading>
                                        <Flex gap={4}>
                                            <Text fontSize="sm"
                                                  color="black">Normal: {selectedCharacter.talents.normal}</Text>
                                            <Text fontSize="sm"
                                                  color="black">Skill: {selectedCharacter.talents.skill}</Text>
                                            <Text fontSize="sm"
                                                  color="black">Burst: {selectedCharacter.talents.burst}</Text>
                                        </Flex>
                                    </Box>
                                </Box>

                                <Box
                                    flex="1"
                                    position="relative"
                                    maxH="520px"
                                    display="flex"
                                    alignItems="flex-start"
                                    justifyContent="flex-end"
                                    overflow="hidden"
                                    borderRadius="lg"
                                >
                                    {/* Splash Art - extra large, clipped */}
                                    <Image
                                        src={selectedCharacter.SplashArt}
                                        alt="Splash Art"
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                        zIndex={0}
                                        pointerEvents="none"
                                        style={{filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.18))"}}
                                    />

                                    {/* Info box - top right */}
                                    <Flex
                                        direction="row"
                                        align="flex-start"
                                        zIndex={1}
                                        position="absolute"
                                        top={0}
                                        right={0}
                                        w="100%"
                                        px={4}
                                        pt={4}
                                        bg="rgba(255,255,255,0)"
                                        borderRadius="md"
                                        backdropFilter="blur(4px)"
                                        gap={8}
                                    >
                                        {/* Left Box: Character Info */}
                                        <Flex
                                            direction="column"
                                            align="flex-start"
                                            position="absolute"
                                            top="0px"
                                            left="0px"
                                            bg="rgba(255,255,255,0.6)"
                                            borderRadius="md"
                                            backdropFilter="blur(6px)"
                                            p={3}
                                            zIndex={2}
                                        >
                                            <Text fontSize="2xl" fontWeight="bold" color="black">
                                                {GetName(selectedCharacter.name)}
                                            </Text>
                                            <Text fontSize="lg" color="gray.700">
                                                Lv. {selectedCharacter.level} • C{selectedCharacter.constellation}
                                            </Text>
                                        </Flex>
                                        <Flex
                                            direction="column"
                                            align="flex-start"
                                            position="absolute"
                                            top="200px"
                                            left="0px"
                                            bg="rgba(255,255,255,0.6)"
                                            borderRadius="md"
                                            backdropFilter="blur(6px)"
                                            p={3}
                                            zIndex={2}
                                        >
                                            {["C1", "C2", "C4", "C6"].map((key, idx) => {
                                                if (!swappedCharacter[key]) return null;
                                                const conNum = parseInt(key.slice(1));
                                                const isUnlocked = swappedCharacter.constellation >= conNum;
                                                const borderColors = {
                                                    pyro: "red.400",
                                                    hydro: "blue.400",
                                                    anemo: "green.200",
                                                    dendro: "green.400",
                                                    cryo: "cyan.300",
                                                    electro: "purple.400"
                                                };
                                                const darkBgColors = {
                                                    pyro: "red.900",
                                                    hydro: "blue.900",
                                                    anemo: "green.900",
                                                    dendro: "green.900",
                                                    cryo: "cyan.900",
                                                    electro: "purple.900"
                                                };
                                                const elKey = swappedCharacter.element?.toLowerCase();
                                                const borderColor = isUnlocked ? borderColors[elKey] || "gray.400" : darkBgColors[elKey] || "gray.900";
                                                const bgColor = darkBgColors[elKey] || "gray.900";
                                                return (
                                                    <Box
                                                        key={key}
                                                        border="3px solid"
                                                        borderColor={borderColor}
                                                        borderRadius="full"
                                                        boxSize="40px"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        bg={bgColor}
                                                        boxShadow={isUnlocked ? "md" : "none"}
                                                        position="relative"
                                                    >
                                                        <Image
                                                            src={swappedCharacter[key]}
                                                            alt={key}
                                                            boxSize="32px"
                                                            borderRadius="full"
                                                            bg="transparent"
                                                            objectFit="contain"
                                                            opacity={isUnlocked ? 1 : 0.25}
                                                        />
                                                        {!isUnlocked && (
                                                            <Box
                                                                position="absolute"
                                                                top="50%"
                                                                left="50%"
                                                                transform="translate(-50%, -50%)"
                                                                zIndex={1}
                                                            >
                                                                <FaLock size={20} color={borderColor}/>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Flex>

                                        {/* Right: Weapon Info */}
                                        {selectedCharacter.weaponIcon && (
                                            <Box
                                                direction="column"
                                                align="flex-end"
                                                position="absolute"
                                                maxW="200px"
                                                top="0px"
                                                right="0px"
                                                bg="rgba(255,255,255,0.6)"
                                                borderRadius="md"
                                                backdropFilter="blur(6px)"
                                                p={3}
                                                zIndex={2}
                                            >
                                                <Flex align="center" gap={3}>
                                                    <Image
                                                        src={selectedCharacter.weaponIcon}
                                                        alt="Weapon"
                                                        boxSize="48px"
                                                        fallbackSrc="https://via.placeholder.com/48"
                                                    />
                                                    <Box textAlign="right">
                                                        <Text fontSize="l"
                                                              color="gray.900">{GetWeaponName(selectedCharacter.weaponName)}</Text>
                                                        <Text fontSize="md" color="gray.600">
                                                            Lv. {selectedCharacter.weaponLevel} •
                                                            R{selectedCharacter.weaponRefinement}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                            </Box>
                                        )}
                                    </Flex>
                                </Box>
                            </Flex>

                            {/* Artifacts */}
                            <Box mt={6}>
                                <Text fontWeight="bold" fontSize="md" mb={2}>
                                    Artifacts
                                </Text>
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{
                                        base: "repeat(2, minmax(0, 1fr))",
                                        md: "repeat(3, minmax(0, 1fr))",
                                        lg: "repeat(5, minmax(0, 1fr))"
                                    }}
                                    gap={4}
                                    mt={4}
                                    w="100%"
                                >
                                    {selectedCharacter.artifacts?.map((a, i) => (
                                        <Box
                                            key={i}
                                            position="relative"
                                            overflow="hidden"
                                            bg="rgba(30, 30, 40, 0.55)"
                                            backdropFilter="blur(8px)"
                                            borderBottom="5px solid"
                                            borderBottomColor={a.rarity === 5 ? "yellow.400" : "purple.400"}
                                            borderRadius="lg"
                                            p={2}
                                            w="160px"
                                            minH="120px"
                                            boxShadow="lg"
                                            transition="transform 0.2s, box-shadow 0.2s"
                                            _hover={{
                                                boxShadow: "xl",
                                            }}
                                        >
                                            {/* Extra large, absolute icon behind everything */}
                                            <Box
                                                position="absolute"
                                                top="-60px"
                                                left="-60px"
                                                zIndex={0}
                                                pointerEvents="none"
                                            >
                                                <Image
                                                    src={a.icon}
                                                    alt={`Artifact ${a.pos}`}
                                                    boxSize="200px"
                                                    objectFit="contain"
                                                    borderRadius="full"
                                                    shadow="lg"
                                                    style={{opacity: 0.9}}
                                                />
                                            </Box>

                                            {/* Blurry overlay at bottom right */}
                                            <Box
                                                position="absolute"
                                                bottom="0"
                                                right="0"
                                                width="80px"
                                                height="80px"
                                                zIndex={1}
                                                pointerEvents="none"
                                                borderBottomRightRadius="lg"
                                            />

                                            {/* Level badge and rest of content (zIndex 2+) */}
                                            <Text
                                                position="absolute"
                                                bottom="2px"
                                                right="2px"
                                                fontSize="xs"
                                                color="white"
                                                bg="blackAlpha.800"
                                                px={1}
                                                borderRadius="sm"
                                                fontWeight="bold"
                                                zIndex={2}
                                            >
                                                +{a.level - 1 ?? "?"}
                                            </Text>

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
                                                    bg="rgba(30, 30, 40, 0.55)"
                                                    backdropFilter="blur(8px)"
                                                    fontWeight="semibold"
                                                    fontSize="sm"
                                                    textAlign="right"
                                                    color="white"
                                                    maxW="fit-content"
                                                    ml="auto"
                                                >
                                                    <Flex align="center" justify="flex-end">
                                                        {getStatType(a.mainStat) === "HP" ? (
                                                            <Image src="/icons/Hp.png" alt="HP" boxSize="24px" mr={2}/>
                                                        ) : getStatType(a.mainStat) === "ATK" ? (
                                                            <Image src="/icons/Atk.png" alt="ATK" boxSize="24px" mr={2}/>
                                                        ) : getStatType(a.mainStat) === "EM" ? (
                                                            <Image src="/icons/Em.png" alt="EM" boxSize="24px" mr={2}/>
                                                        ) : getStatType(a.mainStat) === "DEF" ? (
                                                            <Image src="/icons/Def.png" alt="DEF" boxSize="24px" mr={2}/>
                                                        ) : getStatType(a.mainStat) === "ATK%" ? (
                                                            <Image src="/icons/Atk.png" alt="ATK%" boxSize="24px" mr={2}/>
                                                        ) : getStatType(a.mainStat) === "DEF%" ? (
                                                            <Image src="/icons/Def.png" alt="DEF%" boxSize="24px" mr={2}/>
                                                        ) : getStatType(a.mainStat) === "HP%" ? (
                                                            <Image src="/icons/Hp.png" alt="HP%" boxSize="24px" mr={2}/>
                                                        ) : getStatType(a.mainStat) === "ER%" ? (
                                                            <Image src="/icons/Er.png" alt="ER%" boxSize="24px" mr={2}/>
                                                        ) : getStatType(a.mainStat) === "Crit Rate" ? (
                                                            <Image src="/icons/CritRate.png" alt="Crit Rate" boxSize="24px" mr={2}/>
                                                        ) : getStatType(a.mainStat) === "Crit DMG" ? (
                                                            <Image src="/icons/CritDmg.png" alt="Crit DMG" boxSize="24px" mr={2}/>
                                                        ) : null}
                                                        <Text fontWeight="bold" color="white">
                                                            {a.mainStat}
                                                        </Text>
                                                    </Flex>
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
                                                                bg="rgba(30, 30, 40, 0.55)" // glass-like dark
                                                                backdropFilter="blur(8px)"
                                                                fontSize="xs"
                                                                color="white"
                                                                display="flex"
                                                                alignItems="center"
                                                                flexDirection="column"
                                                            >
                                                                <Box display="flex" alignItems="center">
                                                                    {statType === "HP" ? (
                                                                        <>
                                                                            <Image src="/icons/Hp.png" alt="HP"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}
                                                                            </Text>
                                                                        </>
                                                                    ) : statType === "ATK" ? (
                                                                        <>
                                                                            <Image src="/icons/Atk.png" alt="ATK"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}
                                                                            </Text>
                                                                        </>
                                                                    ) : statType === "DEF" ? (
                                                                        <>
                                                                            <Image src="/icons/Def.png" alt="DEF"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}
                                                                            </Text>
                                                                        </>
                                                                    ) : statType === "HP%" ? (
                                                                        <>
                                                                            <Image src="/icons/Hp.png" alt="HP%"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}%
                                                                            </Text>
                                                                        </>
                                                                    ) : statType === "ATK%" ? (
                                                                        <>
                                                                            <Image src="/icons/Atk.png" alt="ATK%"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}%
                                                                            </Text>
                                                                        </>
                                                                    ) : statType === "DEF%" ? (
                                                                        <>
                                                                            <Image src="/icons/Def.png" alt="DEF%"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}%
                                                                            </Text>
                                                                        </>
                                                                    ) : statType === "ER%" ? (
                                                                        <>
                                                                            <Image src="/icons/Er.png" alt="ER%"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}%
                                                                            </Text>
                                                                        </>
                                                                    ) : statType === "EM" ? (
                                                                        <>
                                                                            <Image src="/icons/Em.png" alt="EM"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}
                                                                            </Text>
                                                                        </>
                                                                    ) : statType === "Crit Rate" ? (
                                                                        <>
                                                                            <Image src="/icons/CritRate.png" alt="Crit Rate"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}%
                                                                            </Text>
                                                                        </>
                                                                    ) : statType === "Crit DMG" ? (
                                                                        <>
                                                                            <Image src="/icons/CritDmg.png" alt="Crit DMG"
                                                                                   boxSize="18px" mr={1}/>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white">
                                                                                +{sub.rawValue}%
                                                                            </Text>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Text as="span" fontWeight="semibold"
                                                                                  color="white" mr={1}>
                                                                                {sub.name}
                                                                            </Text>
                                                                            <Text as="span" color="white">
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
                                                    color="white"
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
                    {selectedCharacter && (
                        <Button
                            mt={2}
                            colorScheme="blue"
                            onClick={handleDownloadCard}
                            leftIcon={<FaArrowRight />}
                        >
                            Download Card
                        </Button>
                    )}

                    {result && !result.characters && (
                        <Box mt={4} p={4} bg="gray.100" rounded="md">
                            <pre>{JSON.stringify(result, null, 2)}</pre>
                        </Box>
                    )}
                </Box>
            </Flex>
        </Box>
    );
}

export default UidSearch;