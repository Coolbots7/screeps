const { CREEP_TYPE_NAMES } = require("./constants_creeps");
const { updateHarvester, updateBuilder, updateRepairer } = require("./helpers_creeps");
const { getCreepsWithType, getSpawnNames, getSpawn } = require("./helpers_game");
const { spawnCreeps } = require("./helpers_spawns");

//Constant dict of desired creeps. Order determines spawn priority descending
const DESIRED_CREEPS = [
    {
        role: 'energy_harvester',
        type: CREEP_TYPE_NAMES.HARVESTER,
        quantity: 10,
        task: {
            sources: {
                room: "E8E7",
                find: FIND_SOURCES_ACTIVE,
                structures: [STRUCTURE_POWER_SPAWN]
            },
            destinations: {
                room: "E8E7",
                find: FIND_MY_STRUCTURES,
                structures: [STRUCTURE_SPAWN, STRUCTURE_CONTROLLER]
            }

        }
    },
    {
        role: 'builder',
        type: CREEP_TYPE_NAMES.BUILDER,
        quantity: 6,
        condition: {
            find: FIND_MY_CONSTRUCTION_SITES
        },
        task: {
            sources: {
                room: "E8E7",
                // ids: ["5fda9c1416bc27839dab2e60"]
                find: FIND_SOURCES_ACTIVE,
                structures: [STRUCTURE_POWER_SPAWN]
            },
            destinations: {
                room: "E8E7",
                find: FIND_MY_CONSTRUCTION_SITES
                //Idea: sort by total progress
            }
        }
    },
    {
        role: 'repairer',
        type: CREEP_TYPE_NAMES.REPAIRER,
        quantity: 2,
        condition: {
            find: FIND_MY_STRUCTURES
        },
        task: {
            sources: {
                room: "E8E7",
                find: FIND_SOURCES_ACTIVE,
                structures: [STRUCTURE_POWER_SPAWN]
            },
            // destinations: {
            //     find: FIND_MY_STRUCTURES,
            //     // filter: {
            //     //     filter: object => object.hits < object.hitsMax
            //     // }
            // }
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
    for (const creepIdx in harvesterCreeps) {
        updateHarvester(harvesterCreeps[creepIdx]);
    }

    //Builders
    const builderCreeps = getCreepsWithType(CREEP_TYPE_NAMES.BUILDER);
    for (const creepIdx in builderCreeps) {
        updateBuilder(builderCreeps[creepIdx]);
    }

    //Builders
    const repairerCreeps = getCreepsWithType(CREEP_TYPE_NAMES.REPAIRER);
    for (const creepIdx in repairerCreeps) {
        updateRepairer(repairerCreeps[creepIdx]);
    }


    if (Game.time % 10 == 0) {
        //Cleanup memory every 100th tick
        for (var i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }

        console.log("========================================")
        console.log(`Harvesters: ${harvesterCreeps.length}      Builders: ${builderCreeps.length}     Repairers: ${repairerCreeps.length}`);
        console.log(`Construction Sites: ${Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES).length}      Repairs: ${Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax }).length}`);
    }
}