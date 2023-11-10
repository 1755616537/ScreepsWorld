var pro = {

	/** @param {Creep} creep **/
	run: function(creep) {
		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) { // building && 背包为空
			creep.memory.building = false; // 变为 非building状态
			creep.say('🔄 收获');
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) { // 非building状态 && 背包满(空余为0)
			creep.memory.building = true; // 变为 building状态
			creep.say('🚧 建造');
		}

		if (creep.memory.building) { // building状态的时候
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES); // 寻找建筑位
			console.log(targets);
			if (targets.length) { // targets.length > 0  || 建筑位 > 0
				if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {
						visualizePathStyle: {
							stroke: '#ffffff'
						}
					}); // 绘制路径
				}
			}else{
				// 修复受损建筑
				const targets = creep.room.find(FIND_STRUCTURES, {
				    filter: object => object.hits < object.hitsMax
				});
				clog('asdasd');
				targets.sort((a,b) => a.hits - b.hits);
				
				if(targets.length > 0) {
				    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
				        creep.moveTo(targets[0]);
				    }
				}
			}
		} else { // 非building状态的时候， 到source旁边并采集
			// 能量源对象集
			var sources = creep.room.find(FIND_SOURCES);
			// 采集能量
			if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
				// 移动到能量源旁边
				creep.moveTo(sources[1], {
					visualizePathStyle: {
						stroke: '#ffaa00'
					}
				});
			}
			
			// 从建筑里面取能量
			// if (creep.withdraw(Structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			// 寻找全部建筑
			// var structures = creep.room.find(FIND_STRUCTURES);
			// 移动到建筑旁边
			// 	creep.moveTo(structures[0], {
			// 		visualizePathStyle: {
			// 			stroke: '#ffaa00'
			// 		}
			// 	});
			// }
		}
	},
	length: () => {
		return _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	}
};

global.factory.creep.Builder = pro;