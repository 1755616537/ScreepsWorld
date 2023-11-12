global.controller.creep = {
	run: () => {
		const builds = factory.spawns.get(1).room.find(FIND_STRUCTURES, {
			filter: {
				structureType: STRUCTURE_CONTAINER
			}
		});
		console.log('builds2',builds.length)

		// 遍历所有 creep 并执行上文中拓展的 work 方法
		// Object.values(Game.creeps).forEach(creep => creep.work())

		// 清理内存
		factory.creep.CleanMemory();

		const harvests = factory.creep.Harvest.ALL();
		const upgraders = factory.creep.Upgrader.ALL();
		const builders = factory.creep.Builder.ALL();
		const carriers = factory.creep.Carrier.ALL();
		const repairers = factory.creep.Repairer.ALL();

		// 查看控制器等级
		const controller_level = factory.spawns.get(1).room.controller.level;

		// 母巢 (spawn) 是否正在孵化一个新的 creep
		if (factory.spawns.get(1).spawning) {
			// 孵化，过程可视化
			let spawningCreep = Game.creeps[factory.spawns.get(1).spawning.name];
			factory.spawns.get(1).room.visual.text(
				'孵化🛠️' + spawningCreep.memory.role,
				factory.spawns.get(1).pos.x + 1,
				factory.spawns.get(1).pos.y, {
					align: 'left',
					opacity: 0.8
				});
		} else {
			// 生产 采集
			if (harvests.length < globalData.creepConfigs.harvest.number) {
				factory.creep.addHarvest(harvests);
			}

			// 最少采集2个
			if (harvests.length >= 2) {
				// 优先级顺序生产 每种保持最低1个
				let priority;
				if (upgraders.length < 1) {
					priority = 'upgrader';
				} else if (builders.length < 1) {
					priority = 'builder';
				} else if (repairers.length < 1) {
					priority = 'repairer';
				} else if (carriers.length < 1) {
					// priority = 'carrier';
				}
				if (priority) {
					switch (priority) {
						case 'upgrader':
							addUpgrader(upgraders);
							break;
						case 'builder':
							addBuilder(builders, controller_level);
							break;
						case 'carrier':
							addCarrier(carriers);
							break;
						case 'repairer':
							addRepairer(repairers);
							break;
						default:
					}
				} else {
					// 默认顺序生产
					addUpgrader(upgraders);
					addBuilder(builders, controller_level);
					addCarrier(carriers);
					addRepairer(repairers);
				}
			}
		}

		// 事件管理
		for (let name in Game.creeps) {
			let creep = Game.creeps[name];
			if (creep.memory.role == globalData.harvest) {
				factory.creep.Harvest.run(creep);
			}
			if (creep.memory.role == globalData.upgrader) {
				factory.creep.Upgrader.run(creep);
			}
			if (creep.memory.role == globalData.builder) {
				factory.creep.Builder.run(creep);
			}
			if (creep.memory.role == globalData.carrier) {
				factory.creep.Carrier.run(creep);
			}
			if (creep.memory.role == globalData.repairer) {
				factory.creep.Repairer.run(creep);
			}
		}
	}
}

function addUpgrader(upgraders) {
	// 生产 升级
	if (upgraders.length < globalData.creepConfigs.upgrader.number) {
		return factory.creep.addUpgrader(upgraders);
	}
}

function addBuilder(builders, controller_level) {
	// 生产 建造 前提控制器2等级
	if (controller_level >= 2 && builders.length < globalData.creepConfigs.builder.number) {
		return factory.creep.addBuilder(builders);
	}
}

function addCarrier(carriers) {
	// 生产 运输
	if (carriers.length < globalData.creepConfigs.carrier.number) {
		// 拥有CONTAINER才生产
		const builds = factory.spawns.get(1).room.find(FIND_STRUCTURES, {
			filter: {
				structureType: STRUCTURE_CONTAINER
			}
		});
		console.log('builds',builds.length)
		if (builds.length > 0) return factory.creep.addCarrier(carriers);
	}
}

function addRepairer(repairers) {
	// 生产 维修
	if (repairers.length < globalData.creepConfigs.repairer.number) {
		return factory.creep.addRepairer(repairers);
	}
}