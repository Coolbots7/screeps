const CREEP_TYPE_NAMES = {
    HARVESTER: 'harvester',
    BUILDER: 'builder',
    REPAIRER: 'repairer',
    SWIFFER: 'swiffer'
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
    },
    {
        name: 'swiffer',
        bodyParts: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        states: {
            PICKUP: 'pickup',
            DROPOFF: 'dropoff'
        }
    }
];

module.exports = {
    CREEP_TYPE_NAMES, CREEP_TYPES
};