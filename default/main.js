// 代码中文解释
/// <reference types="@screepscn/types" />

// 拓展总入口 只执行一次
require("main_mount")();

// 主程序入口 每次tips都执行一次
module.exports.loop = function() {
	// 任务调度启动
	// controller.task.run();
	
	controller.room.run();
	controller.Secure.run();
	controller.Tower.run();
	controller.creep.run();

	// clog('本次tips使用 CPU 时间总量 ',Game.cpu.getUsed())
}

// 中文API
// https://screeps-cn.github.io/api/#
// 英文API
// https://docs.screeps.com/api/#
// lodash
// https://www.lodashjs.com/

// 房间 W25N6  W42S57 W48S54 W47S54
// https://screeps.com/a/#!/room/shard3/W47S54

// 缓存的种类
// 持久化存储：游戏的Memory对象，只有这个地方能实现真正可靠的长时间存储。
// 半持久存储：js 的 Global对象，对象原型都属于半持久存储，这种存储会在游戏全局重置时被清除，一般存放允许丢失的数据。
// 非持久存储：直接定义在游戏对象（非原型）上的属性都属于非持久存储，例如Game.rooms.W1N1.myCustomProp = 123，这种存储只有本 tick 能访问到，用来存放 tick 内协同作业需要的数据。

// 待完成程序:
// .统一任务调度机制
// .多一种角色管理系统，不区分兵种，先统一分配后固定站岗，缺少了补上，1对1搬运
// .自动铺路，能量源，控制器。方案1：两点最近距离.方案2：走得次数多的地方铺路
// .creep阵型，攻击拉扯
// .createConstructionSite自动布局EXTENSION建筑 控制器等级3布局TOWER
// .外能量源采集
// .每个STORAGE搭配一个运输者。如果存在STORAGE并且搭配有运输者，其他运输者才可以把能量放到STORAGE
// .spawn是否停止获取能量，先用于生产
// .可以选择根据总能量上限energyCapacityAvailable动态调整配置
// .TOWER逻辑顺序攻击，维修，治疗，运输者是否1v1运送能量或者1vN运送能量
// .矿床Mineral，稀有资源储备Deposit。自动9*9内建CONTAINER(允许在路road上面建)，限制就1个CONTAINER
// .Game.notify邮件提示配置开关添加
// .限制每个能量源就1个CONTAINER
// .BUG.把自动建CONTAINER允许在路road上面建
// .采集者，升级者，会根据区域9*9哪里有CONTAINER或正在建造的CONTAINER坐标上面站着，如果已经站有一个，不做此限制

// 完成程序:
// .(废弃(改完出现错误)[此名称是 Game.creeps 对象中指向该 creep 对象的哈希键]).把小兵ID放到memory里面，不在使用小兵名称作为唯一ID值判断，改为小兵ID
// .每个运输者可以配置是否固定能量源区运输,属于的在自由选择
// .采集如果脚下有CONTAINER，挖完就放进CONTAINER（没带carry部件或者满了，再采集能量会自动掉脚下，如果脚下有容器就会自动进容器了）
// .在升级控制器的9*9空位其中一个上放置一个CONTAINER（并且检测是否在控制器7*7范围内），多个升级小兵共享一个CONTAINER
// .受到攻击掉血开启安全模式(getEventLog),Tower开启优先攻击模式
// .采集者，在能量源区脚下的CONTAINER未建成，先采集能量了自己建，在运输到需要运输的地方。至少留下一个运输到基地，不自己建
// .运输者，（取，放）状态切换，去取CONTAINER能量后可以选择去捡能量也可以去放
// .运输者一对一搬运，把搬运目标地址写在运输者缓存里面，不在重复循环消耗CPU，new一个RoomPosition
// .把每种小兵的取用能量加上状态,取满在用,用完在取
// .当控制器区存在有能量的CONTAINER,从控制器区存的CONTAINER取能量
// .BUG.能量源区CONTAINER记录信息,控制器CONTAINER记录信息,在creep死亡后,没有正常删除信息,导致无法加入新creeps记录
