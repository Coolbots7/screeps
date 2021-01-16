const CREEP_TYPE_NAMES = {
    HARVESTER: 'harvester',
    BUILDER: 'builder',
    REPAIRER: 'repairer'
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
    },
    {
        name: 'repairer',
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
        states: {
            REFUEL: 'refuel',
            REPAIR: 'repair'
        }
    }
];

module.exports = {
    CREEP_TYPE_NAMES, CREEP_TYPES
};