const { calculateCreepRoleSpawnCost, generateCreepName, getRole } = require("./helpers_creeps");
const { getCreep, getCreepsWithRole } = require("./helpers_game");

function spawnCreeps(spawn, desired_creeps) {
    const debug = false;
    if (debug) {
        console.log(`Spawn ${spawn.name}: Checking creeps to spawn`);
    }
    for (const desired_role in desired_creeps) {
        //Check role is a valid type
        const role = getRole(desired_role);
        if (role) {
            //If current creep role quantity is less than the desired quantity
            if (getCreepsWithRole(desired_role).length < desired_creeps[desired_role]) {
                //If spawn has enough energy to create a creep with role
                if (spawn.store[RESOURCE_ENERGY] >= calculateCreepRoleSpawnCost(role)) {
                    //Spawn creep with role
                    const creepName = generateCreepName(desired_role);
                    if (debug) {
                        console.log(`Spawn ${spawn.name}: Spawning creep '${creepName}' with role '${desired_role}'`);
                    }
                    spawn.spawnCreep(role.bodyParts, creepName);
                    const creep = getCreep(creepName);
                    if (creep) {
                        //Initialize creep memory
                        creep.memory.spawn = spawn;
                        creep.memory.role = role;
                        creep.memory.state = null;
                        creep.memory.target = null;
                    }
                    else {
                        console.log(`Spawn ${spawn.name}: ERROR Failed to create creep '${creepName}' with role '${desired_role}'`);
                    }
                }
                //Let user know if role is too expensive for spawn
                else if (spawn.store.getCapacity(RESOURCE_ENERGY) < calculateCreepRoleSpawnCost(role)) {
                    console.log(`Spawn ${spawn.name}: INFO role '${desired_role}' is too expensive for spawn.`)
                }
            }
            else {
                if (debug) {
                    console.log(`Enough ${desired_role} creeps, next...`);
                }
            }
        }
        else {
            console.log(`Spawn ${spawn.name}: ERROR Unknown role '${desired_role}`)
        }
    }
}

module.exports = {
    spawnCreeps
};