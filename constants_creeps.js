const CREEP_TYPE_NAMES = {
    HARVESTER: 'harvester',
    BUILDER: 'builder'
};

const CREEP_TYPES = [
    {
        name: 'harvester',
        //Idea: determine body parts based on need and spawn capabilities
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
        states: {
            FIND_RESOURCE: 'find_resource',
            DEPOSIT_RESOURCE: 'deposit_resource'
        }
    },
    {
        name: 'builder',
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
        states: {
            REFUEL: 'refuel',
            BUILD: 'build'
        }
    }
];

module.exports = {
    CREEP_TYPE_NAMES, CREEP_TYPES
};