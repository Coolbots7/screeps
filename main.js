const { CREEP_TYPE_NAMES } = require("./constants_creeps");
const { updateHarvester } = require("./helpers_creeps");
const { getCreepsWithType, getSpawnNames, getSpawn } = require("./helpers_game");
const { spawnCreeps } = require("./helpers_spawns");

//Constant dict of desired creeps. Order determines spawn priority descending
//Idea; specify condition to be met before spawning. Like game object of type exists for only spawning builders if structures that need building exist
const DESIRED_CREEPS = [
    {
        role: 'energy_harvester',
        type: CREEP_TYPE_NAMES.HARVESTER,
        quantity: 10,
        task: {
            sources: {
                // ids: ["5fda9c1416bc27839dab2e62", "5fda9c1416bc27839dab2e60"]
                find: FIND_SOURCES_ACTIVE,
                structures: [STRUCTURE_POWER_SPAWN]
            },
            destinations: {
                find: FIND_MY_STRUCTURES,
                structures: [STRUCTURE_SPAWN, STRUCTURE_CONTROLLER]
            }

        }
    }
]

module.exports.loop = function () {
    //Spawns    
    for (const spawnName in getSpawnNames()) {
        const spawn = getSpawn(spawnName);
        if (spawn.name.toLowerCase() == 'spawn1') {
            spawnCreeps(spawn, DESIRED_CREEPS)
        }
    }

    //Creeps
    //Harvesters
    const harvesterCreeps = getCreepsWithType(CREEP_TYPE_NAMES.HARVESTER);
    for (const creep in harvesterCreeps) {
        updateHarvester(harvesterCreeps[creep]);
    }
}