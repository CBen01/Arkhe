// utils/rolls.js
const rollTable = {
    "FIGHT_PROP_CRITICAL": [2.7, 3.1, 3.5, 3.9],
    "FIGHT_PROP_CRITICAL_HURT": [5.4, 6.2, 7.0, 7.8],
    "FIGHT_PROP_ATTACK_PERCENT": [4.1, 4.7, 5.3, 5.8],
    "FIGHT_PROP_HP_PERCENT": [4.1, 4.7, 5.3, 5.8],
    "FIGHT_PROP_DEF_PERCENT": [5.1, 5.8, 6.6, 7.3],
    "FIGHT_PROP_CHARGE_EFFICIENCY": [4.5, 5.2, 5.8, 6.5],
    "FIGHT_PROP_ELEMENT_MASTERY": [16, 19, 21, 23],
    "FIGHT_PROP_ATTACK": [14, 16, 18, 19],
    "FIGHT_PROP_HP": [209, 239, 269, 299],
    "FIGHT_PROP_DEF": [16, 19, 21, 23],
};

function estimateRolls(statId, value) {
    const values = rollTable[statId];
    if (!values) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const rolls = value / avg;
    return Math.max(1, Math.round(rolls)); // legalább 1
}

module.exports = {
    estimateRolls,
};
