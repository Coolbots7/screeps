const { calculateCreepRoleSpawnCost, generateCreepName, getType } = require("./helpers_creeps");
const { getCreep, getCreepsWithRole } = require("./helpers_game");

function spawnCreeps(spawn, desiredCreeps) {
    const debug = false;
    if (debug) {
        console.log(`Spawn ${spawn.name}: Checking creeps to spawn.`);
    }
    for (const creepIdx in desiredCreeps) {
        const desiredCreep = desiredCreeps[creepIdx];

        //Check type is a valid type
        const desiredCreepType = getType(desiredCreep.type);
        if (desiredCreepType) {
            //If current creep role quantity is less than the desired quantity
            if (getCreepsWithRole(desiredCreep.role).length < desiredCreep.quantity) {
                //If spawn has enough energy to create a creep with role
                if (spawn.store[RESOURCE_ENERGY] >= calculateCreepRoleSpawnCost(desiredCreepType)) {
                    //Spawn creep with role
                    const creepName = generateCreepName(desiredCreep.role);
                    if (debug) {
                        console.log(`Spawn ${spawn.name}: Spawning creep '${creepName}' of type ${desiredCreepType.name} with role '${desiredCreep.role}'.`);
                    }
                    spawn.spawnCreep(desiredCreepType.bodyParts, creepName);
                    const creep = getCreep(creepName);
                    if (creep) {
                        //Initialize creep memory
                        creep.memory.spawn = spawn;
                        creep.memory.type = desiredCreepType;
                        creep.memory.role = desiredCreep.role;
                        creep.memory.task = desiredCreep.task;
                        creep.memory.state = null;
                        creep.memory.target = null;
                    }
                    else {
                        console.log(`Spawn ${spawn.name}: ERROR Failed to create creep '${creepName}'.`);
                    }
                }
                //Let user know if role is too expensive for spawn
                else if (spawn.store.getCapacity(RESOURCE_ENERGY) < calculateCreepRoleSpawnCost(desiredCreepType)) {
                    console.log(`Spawn ${spawn.name}: INFO type '${desiredCreepType.name}' is too expensive for spawn.`)
                }
            }
            else {
                if (debug) {
                    console.log(`Enough ${desiredCreep.role} creeps, next...`);
                }
            }
        }
        else {
            console.log(`Spawn ${spawn.name}: ERROR Unknown type '${desiredCreepType.type}.`)
        }
    }
}

module.exports = {
    spawnCreeps
};