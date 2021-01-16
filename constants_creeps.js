const CREEP_ROLE_NAMES = {
    HARVESTER: 'harvester',
    BUILDER: 'builder'
};

const CREEP_ROLES = [
    {
        name: 'harvester',
        //Idea: determine body parts based on need and spawn capabilities
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
        states: {
            FIND_ENERGY: 'find_energy',
            DEPOSIT_ENERGY: 'deposit_energy'
        }
    },

];

module.exports = {
    CREEP_ROLE_NAMES, CREEP_ROLES
};