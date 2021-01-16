const { CREEP_TYPE_NAMES } = require("./constants_creeps");
const { updateHarvester, updateBuilder } = require("./helpers_creeps");
const { getCreepsWithType, getSpawnNames, getSpawn } = require("./helpers_game");
const { spawnCreeps } = require("./helpers_spawns");

//Constant dict of desired creeps. Order determines spawn priority descending
const DESIRED_CREEPS = [
    {
        role: 'energy_harvester',
        type: CREEP_TYPE_NAMES.HARVESTER,
        quantity: 8,
        task: {
            sources: {
                find: FIND_SOURCES_ACTIVE,
                structures: [STRUCTURE_POWER_SPAWN]
            },
            destinations: {
                find: FIND_MY_STRUCTURES,
                structures: [STRUCTURE_SPAWN, STRUCTURE_CONTROLLER]
            }

        }
    },
    {
        role: 'builder',
        type: CREEP_TYPE_NAMES.BUILDER,
        quantity: 8,
        condition: {
            find: FIND_MY_CONSTRUCTION_SITES
        },
        task: {
            sources: {
                // ids: ["5fda9c1416bc27839dab2e60"]
                find: FIND_SOURCES_ACTIVE,
                structures: [STRUCTURE_POWER_SPAWN]
            },
            destinations: {
                find: FIND_MY_CONSTRUCTION_SITES
            }
        }
    }
]

module.exports.loop = function () {
    //Cleanup memory every 100th tick
    if (Game.time % 100 == 0) {
        for (var i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    }

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
    for (const creepIdx in harvesterCreeps) {
        updateHarvester(harvesterCreeps[creepIdx]);
    }

    //Builders
    const builderCreeps = getCreepsWithType(CREEP_TYPE_NAMES.BUILDER);
    for (const creepIdx in builderCreeps) {
        updateBuilder(builderCreeps[creepIdx]);
    }
}