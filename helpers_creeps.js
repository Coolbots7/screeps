const { CREEP_TYPES } = require("./constants_creeps");
const { getCreepsWithRole } = require("./helpers_game");

// const TARGET_FILTER_EMPTY = 0x01;
// const TARGET_FILTER_FULL = 0x02;

function getType(typeName) {
    return CREEP_TYPES.find(type => type.name === typeName);
}

//Takes a role name and generates a unique creep name
function generateCreepName(roleName) {
    if (Memory.roleIndexes === undefined) {
        Memory.roleIndexes = {};
    }
    var index = Memory.roleIndexes[roleName];
    if (index === undefined) {
        index = 1;
    }
    else {
        index += 1;
    }
    Memory.roleIndexes[roleName] = index;
    return roleName + '_' + index.toString();
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

    const type = creep.memory.type;

    if (creep.memory.state === null) {
        creep.memory.state = type.states.FIND_RESOURCE;

        //use creep task in memory to determine next destination target
        creep.memory.target = getNextTarget(creep, creep.memory.task.sources);
    }

    if (creep.memory.state === type.states.FIND_RESOURCE) {
        if (creep.memory.target !== null) {
            if (creep.harvest(Game.getObjectById(creep.memory.target.id)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target.id));
            }
        }
        else {
            creep.memory.target = getNextTarget(creep, creep.memory.task.sources);
        }

        if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
            //set state to unload
            //set target to spawn
            creep.memory.state = type.states.DEPOSIT_RESOURCE;

            //use creep task in memory to determine next destination target
            creep.memory.target = getNextTarget(creep, creep.memory.task.destinations);
        }
    }

    if (creep.memory.state === type.states.DEPOSIT_RESOURCE) {
        if (creep.memory.target !== null) {
            const transferResult = creep.transfer(Game.getObjectById(creep.memory.target.id), RESOURCE_ENERGY);
            if (transferResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target.id));
            }
            //if full get next target
            else if (transferResult === ERR_FULL) {
                creep.memory.target = getNextTarget(creep, creep.memory.task.destinations, Game.getObjectById(creep.memory.target.id));
            }
        }
        else {
            creep.memory.target = getNextTarget(creep, creep.memory.task.destinations);
        }

        if (creep.store[RESOURCE_ENERGY] <= 0) {
            creep.memory.state = type.states.FIND_RESOURCE;

            //use creep task in memory to determine source target
            creep.memory.target = getNextTarget(creep, creep.memory.task.sources);

            // creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES);
        }
    }

    //TODO what if current source target no longer exists, is surrounded, or is full?
    //TODO what if current destination target no longer exists, is surrounded, or is now full?
    //TODO if done transferring anf ticksToLive is below threshold, go to spawn and recycle or renew to prevent mining energy and dying on the way back

}

//Builder State Machine
function updateBuilder(creep) {
    // console.log(`Updating builder '${harvesterCreeps[creep].name}'`);

    const type = creep.memory.type;

    if (creep.memory.state === null) {
        creep.memory.state = type.states.REFUEL;
        creep.memory.target = getNextTarget(creep, creep.memory.task.sources);
    }

    if (creep.memory.state === type.states.REFUEL) {
        if (creep.memory.target !== null) {
            if (creep.harvest(Game.getObjectById(creep.memory.target.id)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target.id));
            }
        }
        else {
            creep.memory.target = getNextTarget(creep, creep.memory.task.sources);
        }

        if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.memory.state = type.states.BUILD;
            creep.memory.target = getNextTarget(creep, creep.memory.task.destinations);
        }
    }

    if (creep.memory.state === type.states.BUILD) {
        if (creep.memory.target !== null) {
            const buildResult = creep.build(Game.getObjectById(creep.memory.target.id));
            if (buildResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target.id));
            }
            //If target is now build, get next target
            else if (buildResult === ERR_INVALID_TARGET) {
                // creep.memory.target = getNextTarget(creep, creep.memory.task.destinations, Game.getObjectById(creep.memory.target.id))
                creep.memory.target = null;
            }
        }
        else {
            // creep.memory.target = getNextTarget(creep, creep.memory.task.destinations);
            creep.memory.target = null;
        }

        if (creep.store[RESOURCE_ENERGY] <= 0) {
            creep.memory.state = type.states.REFUEL;
            creep.memory.target = getNextTarget(creep, creep.memory.task.sources);
        }
    }

    //TODO what if current source target no longer exists, is surrounded, or is full?
    //TODO what if current destination target no longer exists, is surrounded, or is now full?
    //TODO if ticksToLive is below threshold, go to spawn and renew or recycle
}

//Repairer State Machine
function updateRepairer(creep) {
    // console.log(`Updating repairer '${harvesterCreeps[creep].name}'`);

    const type = creep.memory.type;

    if (creep.memory.state === null) {
        creep.memory.state = type.states.REFUEL;
        creep.memory.target = getNextTarget(creep, creep.memory.task.sources);
    }

    if (creep.memory.state === type.states.REFUEL) {
        if (creep.memory.target !== null) {
            if (creep.harvest(Game.getObjectById(creep.memory.target.id)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target.id));
            }
        }
        else {
            creep.memory.target = getNextTarget(creep, creep.memory.task.sources);
        }

        if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.memory.state = type.states.REPAIR;
            // creep.memory.target = getNextTarget(creep, creep.memory.task.destinations);
            //TODO replace with filter from memory
            // var targets = creep.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });
            // if (targets.length > 0) {
            //     targets.sort((a, b) => a.hits - b.hits);
            //     creep.memory.target = targets[0];
            // }
            creep.memory.target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });
        }
    }

    if (creep.memory.state === type.states.REPAIR) {
        if (creep.memory.target !== null) {
            const repairResult = creep.repair(Game.getObjectById(creep.memory.target.id));
            if (repairResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target.id));
            }
            //If target is no longer valid, get next target
            else if (repairResult === ERR_INVALID_TARGET) {
                // creep.memory.target = getNextTarget(creep, creep.memory.task.destinations, Game.getObjectById(creep.memory.target.id))
                // //TODO replace with filter from memory
                // var targets = creep.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax }).filter(obj => obj === Game.getObjectById(creep.memory.target.id));
                // if (targets.length > 0) {
                //     targets.sort((a, b) => a.hits - b.hits);
                //     creep.memory.target = targets[0];
                // }
                creep.memory.target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });
                // creep.memory.target = null;
            }
            //If current target has been fully repaired, get next target
            else if (Game.getObjectById(creep.memory.target.id).hits >= Game.getObjectById(creep.memory.target.id).hitsMax) {
                creep.memory.target = null;
            }
        }
        else {
            // creep.memory.target = getNextTarget(creep, creep.memory.task.destinations);
            //TODO replace with filter from memory
            // var targets = creep.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });
            // if (targets.length > 0) {
            //     targets.sort((a, b) => a.hits - b.hits);
            //     creep.memory.target = targets[0];
            // }
            creep.memory.target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });
        }

        if (creep.store[RESOURCE_ENERGY] <= 0) {
            creep.memory.state = type.states.REFUEL;
            creep.memory.target = getNextTarget(creep, creep.memory.task.sources);
        }
    }

    //TODO what if current source target no longer exists, is surrounded, or is full?
    //TODO what if current destination target no longer exists, is surrounded, or is now full?
    //TODO if ticksToLive is below threshold, go to spawn and renew or recycle
}

//TODO not returning a target when creep is blocked in
function getNextTarget(creep, filters, blacklistTarget = undefined) {
    var targetObjects = [];

    //if creep is not in filter room, set target to room
    // if(filters.room !== undefined && creep.room.name !== filters.room) {
    //     return creep.pos.findClosestByRange(creep.room.findExitTo(Game.rooms[filters.room]));
    // }

    //Filter by game object IDs
    if (filters.ids !== undefined && filters.ids.length > 0) {
        for (const idx in filters.ids) {
            targetObjects.push(Game.getObjectById(filters.ids[idx]));
        }
    }
    //Filter by structure
    else if (filters.find !== undefined) {
        if (filters.filter !== undefined) {
            targetObjects = creep.room.find(filters.find, filters.filter);
        }
        else if (filters.structures !== undefined) {
            //For each structure
            for (const structureIdx in filters.structures) {
                //TODO possibly replace creep.room.find with creep.pos.findInRange to increase efficiency, both are medium CPU cost
                targetObjects = creep.room.find(filters.find, { structureType: filters.structures[structureIdx] });

                if (targetObjects.length > 0) {
                    break;
                }
            }
        }
        else {
            targetObjects = creep.room.find(filters.find);
        }
    }

    //If at least one result, return closest
    if (targetObjects.length > 0) {
        if (blacklistTarget !== undefined) {
            targetObjects = targetObjects.filter((obj) => obj !== blacklistTarget);
        }
        return creep.pos.findClosestByPath(targetObjects);
    }

    //TODO if no targets and more than one room specified, try next room

    return null;

    //TODO filter out result that are full / empty
    // if (flags & TARGET_FILTER_EMPTY === TARGET_FILTER_EMPTY) {
    //     //TODO remove empty targets
    // }
    // if (flags & TARGET_FILTER_FULL === TARGET_FILTER_FULL) {
    //     //TODO remove full targets
    // }

    //TODO filter out results that are surrounded
    //creep.room.findPath.length <= 0?
}

module.exports = {
    getType,
    generateCreepName, calculateCreepRoleSpawnCost,
    updateHarvester, updateBuilder, updateRepairer
};