const { CREEP_ROLES } = require("./constants_creeps");
const { getCreepsWithRole } = require("./helpers_game");

function getRole(roleName) {
    return CREEP_ROLES.find(role => role.name === roleName);
}

//Takes a role name and generates a unique creep name
function generateCreepName(roleName) {
    return roleName + '_' + (getCreepsWithRole(roleName).length + 1).toString();
}

// ====== Calculate creep role spawn cost ======
// Takes a role object and calculates the required energy to spawn a creep of that role
function calculateCreepRoleSpawnCost(role) {
    var cost = 0;
    for (const i in role.bodyParts) {
        cost += BODYPART_COST[role.bodyParts[i]];
    }
    return cost;
}

// Harvester State Machine
function updateHarvester(creep) {   
    // console.log(`Updating harvester '${harvesterCreeps[creep].name}'`);

    const role = creep.memory.role;

    if (creep.memory.state === null) {
        creep.memory.state = role.states.FIND_ENERGY;
        creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES);
    }

    if (creep.memory.state === role.states.FIND_ENERGY) {
        if (creep.harvest(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.target.id));
        }

        if(creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
            //set state to unload
            //set target to spawn
            creep.memory.state = role.states.DEPOSIT_ENERGY;

            //TODO remove defined target
            //TODO check role for target filter or id
            //Take energy to spawn
            // creep.memory.target = Game.spawns.Spawn1;
            //Take energy to controller
            creep.memory.target = creep.room.controller;
        }
    }

    if (creep.memory.state === role.states.DEPOSIT_ENERGY) {
        if(creep.transfer(Game.getObjectById(creep.memory.target.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(Game.getObjectById(creep.memory.target.id));
        }

        if(creep.store[RESOURCE_ENERGY] <= 0) {
            creep.memory.state = role.states.FIND_ENERGY;
            creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES);
        }
    }

    //TODO what if current source target no longer exists, is surrounded, or is full?
    //TODO what if current destination target no longer exists, is surrounded, or is now full?
    //TODO if done transferring anf ticksToLive is below threshold, go to spawn and recycle or renew to prevent mining energy and dying on the way back

}

module.exports = {
    getRole,
    generateCreepName, calculateCreepRoleSpawnCost,
    updateHarvester
};