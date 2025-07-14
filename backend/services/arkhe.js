const axios = require('axios');
const characters = require('../../shared/characters.json');
const statMap = require('../../shared/statMap.json');

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
        const icon = `https://enka.network/ui/UI_AvatarIcon_Side_${name.replace(/ /g, '')}.png`;
        const level = avatar.propMap?.["4001"]?.ival || "N/A";
        const constellation = avatar.talentIdList?.length || 0;

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
                    const statName = statMap[id] || id || "Substat";
                    const value = sub.statValue;

                    // CV számítás: csak Crit Rate és Crit DMG esetén
                    if (id === "FIGHT_PROP_CRITICAL") cv += value * 2;
                    if (id === "FIGHT_PROP_CRITICAL_HURT") cv += value;


                    return `${statName}: +${value}`;
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

        return {
            id,
            name,
            icon,
            level,
            constellation,
            weaponIcon,
            weaponName,
            weaponLevel,
            weaponRefinement,
            artifacts
        };
    });

    return mappedCharacters;
}



module.exports = {
    getCharacterIdsByUID,
    getPlayerStatsByUID
};
