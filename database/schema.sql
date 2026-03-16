-- 用户表
CREATE TABLE `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机',
  `img` VARCHAR(255) DEFAULT NULL COMMENT '头像',
  `nick_name` VARCHAR(100) DEFAULT NULL COMMENT '昵称',
  `open_id` VARCHAR(100) UNIQUE DEFAULT NULL COMMENT '微信open_id',
  `union_id` VARCHAR(100) UNIQUE DEFAULT NULL COMMENT '微信union_id',
  `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `ip` VARCHAR(45) DEFAULT NULL COMMENT '注册ip',
  `channel` VARCHAR(50) DEFAULT NULL COMMENT '来源',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 景区信息表
CREATE TABLE `channels` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `channel` VARCHAR(50) UNIQUE NOT NULL COMMENT '景区编码',
  `channel_name` VARCHAR(100) NOT NULL COMMENT '景区名称',
  `city` VARCHAR(100) DEFAULT NULL COMMENT '景区位置',
  `star` INT DEFAULT 0 COMMENT '几星',
  `remark` TEXT DEFAULT NULL COMMENT '说明',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系人电话',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区信息表';

-- 景区物料明细表
CREATE TABLE `gifts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `gift_name` VARCHAR(100) NOT NULL COMMENT '名称',
  `gift_price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `gift_num` INT DEFAULT 0 COMMENT '数量',
  `channel_id` BIGINT NOT NULL COMMENT '景区ID',
  `vstatus` TINYINT DEFAULT 0 COMMENT '销售状态 0-销售 1-不销售',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区物料明细表';

-- 用户支付订单信息表
CREATE TABLE `orders` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_no` VARCHAR(50) UNIQUE NOT NULL COMMENT '订单编号',
  `order_price` DECIMAL(10,2) NOT NULL COMMENT '订单价格',
  `order_num` INT DEFAULT 1 COMMENT '数量',
  `user_id` BIGINT NOT NULL COMMENT '会员id',
  `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '生成订单时间',
  `pay_date` DATETIME DEFAULT NULL COMMENT '支付时间',
  `callback_date` DATETIME DEFAULT NULL COMMENT '回调确认成功时间',
  `pay_channel` VARCHAR(50) DEFAULT NULL COMMENT '支付渠道',
  `channel_id` INT NOT NULL COMMENT '景区ID',
  `return_date` DATETIME DEFAULT NULL COMMENT '申请退还时间',
  `return_flag` INT DEFAULT 0 COMMENT '退还物品数量',
  `return_price` DECIMAL(10,2) DEFAULT 0.00 COMMENT '退还金额',
  `broke_price` DECIMAL(10,2) DEFAULT 0.00 COMMENT '损耗金额',
  `return_sucess_date` DATETIME DEFAULT NULL COMMENT '退还成功时间',
  `return_sucess_flag` TINYINT DEFAULT 0 COMMENT '退还成功标记 1-成功',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户支付订单信息表';

-- 订单物料信息表
CREATE TABLE `order_items` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单编号',
  `gift_id` INT NOT NULL COMMENT '物品id',
  `gift_name` VARCHAR(100) NOT NULL COMMENT '物品名称',
  `gift_num` INT DEFAULT 1 COMMENT '物品数量',
  `gift_price` DECIMAL(10,2) NOT NULL COMMENT '物品价格',
  `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `return_date` DATETIME DEFAULT NULL COMMENT '退还时间',
  `return_num` INT DEFAULT 0 COMMENT '退还数量',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单物料信息表';

-- 支付详情表
CREATE TABLE `payments` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `pay_name` VARCHAR(100) NOT NULL COMMENT '支付渠道',
  `pay_param` TEXT DEFAULT NULL COMMENT '请求参数',
  `request_date` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '请求时间',
  `response_data` TEXT DEFAULT NULL COMMENT '返回数据',
  `req_num` INT DEFAULT 1 COMMENT '第几次请求',
  `sucess_flag` TINYINT DEFAULT 0 COMMENT '成功与否标志 1-成功 0-初始化',
  `callback_date` DATETIME DEFAULT NULL COMMENT '回调时间',
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单编号',
  `order_id` BIGINT NOT NULL COMMENT '订单id',
  `pay_price` DECIMAL(10,2) DEFAULT 0.00 COMMENT '支付金额',
  `type` TINYINT DEFAULT 0 COMMENT '类型 0-支付 1-退还',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付详情表';

-- 管理员/操作员表
CREATE TABLE `admins` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(MD5加密)',
  `device_id` VARCHAR(50) UNIQUE DEFAULT NULL COMMENT '设备ID',
  `role` TINYINT DEFAULT 1 COMMENT '角色 1-操作员 2-管理员',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员/操作员表';

-- 创建索引
CREATE INDEX idx_users_open_id ON users(open_id);
CREATE INDEX idx_users_union_id ON users(union_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_no ON orders(order_no);
CREATE INDEX idx_orders_channel_id ON orders(channel_id);
CREATE INDEX idx_gifts_channel_id ON gifts(channel_id);
CREATE INDEX idx_order_items_order_no ON order_items(order_no);
CREATE INDEX idx_payments_order_no ON payments(order_no);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_orders_return_success_flag ON orders(return_sucess_flag);
CREATE INDEX idx_orders_return_date ON orders(return_date);