//Get all spawns
function getSpawnNames() {
    return Game.spawns;
}

function getSpawn(spawnName) {
    return Game.spawns[spawnName];
}

//Get all creeps
function getCreepNames() {
    return Game.creeps;
}

//Get creep with name
function getCreep(name) {
    return Game.creeps[name];
}

//Get creeps with role
function getCreepsWithRole(roleName) {
    return _.filter(Game.creeps, (creep) => creep.memory.role.name == roleName);
}

module.exports = {
    getSpawnNames, getSpawn,
    getCreepNames, getCreep, getCreepsWithRole
};