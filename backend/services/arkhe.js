const axios = require('axios');
const characters = require('../../shared/characters.json');
const charactersElements = require('../../shared/CharacterElements.json');
const statMap = require('../../shared/statMap.json');
const { estimateRolls } = require('../../utils/rolls');

async function getPlayerStatsByUID(uid) {
    const url = `https://enka.network/api/uid/${uid}`;

    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'ArkheBot/1.0 (https://arkhe.example.com)'
        }
    });

    const data = response.data;

    if (!data || !data.playerInfo) {
        throw new Error('Nincsenek nyilvános statisztikái vagy hibás UID.');
    }

    const playerInfo = data.playerInfo;
    const stats = {
        uid: playerInfo.uid,
        nickname: playerInfo.nickname,
        level: playerInfo.level,
        signature: playerInfo.signature,
        worldLevel: playerInfo.worldLevel,
        finishAchievementNum: playerInfo.finishAchievementNum,
        towerFloorIndex: playerInfo.towerFloorIndex,
        towerLevelIndex: playerInfo.towerLevelIndex
    };

    return stats;
}


async function getCharacterIdsByUID(uid) {
    const url = `https://enka.network/api/uid/${uid}`;

    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'ArkheBot/1.0 (https://arkhe.example.com)'
        }
    });

    const data = response.data;

    if (!data || !data.avatarInfoList) {
        throw new Error('Nincsenek nyilvános karakterei vagy hibás UID.');
    }

    const mappedCharacters = data.avatarInfoList.map((avatar) => {
        const id = avatar.avatarId;
        const name = characters[id.toString()] || `Ismeretlen (${id})`;
        const element = charactersElements[id.toString()] || "Unknown Element";
        const icon = `https://enka.network/ui/UI_AvatarIcon_Side_${name.replace(/ /g, '')}.png`;
        const level = avatar.propMap?.["4001"]?.ival || "N/A";
        const constellation = avatar.talentIdList?.length || 0;
        const SplashArt = `https://enka.network/ui/UI_Gacha_AvatarImg_${name.replace(/ /g, '')}.png`;

        //cons
        const C1 = `https://enka.network/ui/UI_Talent_S_${name.replace(/ /g, '')}_01.png`
        const C2 = `https://enka.network/ui/UI_Talent_S_${name.replace(/ /g, '')}_02.png`
        const C4 = `https://enka.network/ui/UI_Talent_S_${name.replace(/ /g, '')}_03.png`
        const C6 = `https://enka.network/ui/UI_Talent_S_${name.replace(/ /g, '')}_04.png`

        // Fegyver
        const weapon = avatar.equipList?.find(e => e.flat?.itemType === "ITEM_WEAPON");
        const weaponIcon = weapon?.flat?.icon
            ? `https://enka.network/ui/${weapon.flat.icon}.png`
            : null;
        const weaponName = weapon?.flat?.icon
            ? weapon.flat.icon.replace("UI_EquipIcon_", "").replace(/_/g, " ")
            : "Unknown Weapon";
        const weaponLevel = weapon?.weapon?.level ? weapon.weapon.level: null;
        const weaponRefinement = weapon?.weapon?.affixMap
            ? Object.values(weapon.weapon.affixMap)[0] + 1
            : null;

        // Artifactok
        const artifacts = avatar.equipList
            ?.filter(e => e.flat?.itemType === "ITEM_RELIQUARY")
            ?.map(equip => {
                const icon = equip.flat.icon
                    ? `https://enka.network/ui/${equip.flat.icon}.png`
                    : null;
                const mainStatId = equip.flat.reliquaryMainstat?.mainPropId;
                const mainStatName = statMap[mainStatId] || mainStatId || "Main Stat";

                let cv = 0;

                const level = equip.reliquary?.level || 0;
                const rarity = equip.flat?.rankLevel || 5;

                const substats = equip.flat.reliquarySubstats?.map(sub => {
                    const id = sub.appendPropId;
                    const statName = statMap[id] || id;
                    const value = sub.statValue;

                    const rolls = estimateRolls(id, value);

                    if (id === "FIGHT_PROP_CRITICAL") cv += value * 2;
                    if (id === "FIGHT_PROP_CRITICAL_HURT") cv += value;

                    return {
                        name: `${statName}`,
                        rawValue: value,
                        id,
                        rolls
                    };
                }) || [];






                return {
                    pos: equip.reliquary?.position,
                    icon,
                    mainStat: mainStatName,
                    substats,
                    cv: Math.round(cv * 10) / 10,
                    level,
                    rarity
                };

            }) || [];



        const skillLevels = avatar.skillLevelMap || {};
        const extraLevels = avatar.proudSkillExtraLevelMap || {};

        const skillKeys = Object.keys(skillLevels);
        const normalId = skillKeys[0];
        const skillId = skillKeys[1];
        const burstId = skillKeys[2];

        const talents = {
            normal: (skillLevels[normalId] || 1) + (extraLevels[normalId] || 0),
            skill:  (skillLevels[skillId]  || 1) + (extraLevels[skillId]  || 0),
            burst:  (skillLevels[burstId]  || 1) + (extraLevels[burstId]  || 0)
        };


        const baseStats = {
            hp: avatar.fightPropMap?.["2000"] || 0,
            atk: avatar.fightPropMap?.["2001"] || 0,
            def: avatar.fightPropMap?.["2002"] || 0
        };

        const flatBonus = {
            hp: avatar.fightPropMap?.["6"] || 0,
            atk: avatar.fightPropMap?.["7"] || 0,
            def: avatar.fightPropMap?.["8"] || 0
        };

        const percentBonus = {
            hp: avatar.fightPropMap?.["1"] || 0,
            atk: avatar.fightPropMap?.["4"] || 0,
            def: avatar.fightPropMap?.["7"] || 0
        };

        const finalStats = {
            hp: Math.round(baseStats.hp + flatBonus.hp + baseStats.hp * percentBonus.hp),
            atk: Math.round(baseStats.atk + flatBonus.atk + baseStats.atk * percentBonus.atk),
            def: Math.round(baseStats.def + flatBonus.def + baseStats.def * percentBonus.def)
        };

        const stats = {
            base: baseStats,
            flat: flatBonus,
            percent: percentBonus,
            em: avatar.fightPropMap?.["28"] || 0,
            critRate: avatar.fightPropMap?.["20"] || 0,
            critDmg: avatar.fightPropMap?.["22"] || 0,
            er: avatar.fightPropMap?.["23"] || 0,
            bonus: avatar.fightPropMap?.["40"] || 0, // Elemental DMG Bonus
        };

        return {
            id,
            name,
            element,
            icon,
            SplashArt,
            level,
            constellation,
            C1,
            C2,
            C4,
            C6,
            weaponIcon,
            weaponName,
            weaponLevel,
            weaponRefinement,
            artifacts,
            stats,
            talents
        };
    });

    return mappedCharacters;
}



module.exports = {
    getCharacterIdsByUID,
    getPlayerStatsByUID
};
