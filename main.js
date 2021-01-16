const { CREEP_ROLE_NAMES } = require("./constants_creeps");
const { updateHarvester } = require("./helpers_creeps");
const { getCreepsWithRole, getSpawnNames, getSpawn } = require("./helpers_game");
const { spawnCreeps } = require("./helpers_spawns");

//Constant dict of desired creeps. Order determines spawn priority descending
//Idea; specify condition to be met before spawning. Like game object of type exists for only spawning builders if structures that need building exist
const DESIRED_CREEPS = {
    'harvester': 8
};

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
    const harvesterCreeps = getCreepsWithRole(CREEP_ROLE_NAMES.HARVESTER);
    for (const creep in harvesterCreeps) {
        updateHarvester(harvesterCreeps[creep]);
    }
}