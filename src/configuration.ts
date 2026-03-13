import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * 将嵌套对象转换为扁平的键值对结构
 * @param obj 嵌套对象
 * @param prefix 前缀
 * @returns 扁平的键值对结构
 */
function flattenObject(obj: any, prefix: string = ''): any {
  let result: any = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // 递归处理嵌套对象
        const flattened = flattenObject(obj[key], newKey);
        result = { ...result, ...flattened };
      } else {
        // 直接添加值
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}

export default () => {
  // 读取STARTCONFIG环境变量，默认为bootstrap
  const configName = process.env.STARTCONFIG || 'bootstrap';
  
  // 构建配置文件路径
  const configPath = path.join(process.cwd(), `${configName}.yaml`);
  
  // 加载YAML配置文件
  let yamlConfig = {};
  try {
    if (fs.existsSync(configPath)) {
      const yamlContent = fs.readFileSync(configPath, 'utf8');
      const loadedYaml = yaml.load(yamlContent) || {};
      // 将嵌套的YAML配置转换为扁平结构
      yamlConfig = flattenObject(loadedYaml);
      console.log(`Loaded configuration from ${configPath}`);
      console.log('Flattened YAML config:', yamlConfig);
    } else {
      console.warn(`Configuration file ${configPath} not found, using default values`);
    }
  } catch (error) {
    console.error(`Error loading configuration file ${configPath}:`, error);
  }
  
  // 基础配置
  const baseConfig = {
    // 应用基础
    'application.port': parseInt(process.env.PORT, 10) || 7004,
    'application.name': process.env.APPLICATION_NAME || 'api',
    'application.rootUserId': parseInt(process.env.ROOT_USER_ID, 10) || 1,
    'application.userPwdSalt': process.env.USER_PWD_SALT || 'salt123',
    'application.userDefaultPwd': process.env.USER_DEFAULT_PWD || '123456',
    'application.protectSysPermmenuMaxId': parseInt(process.env.PROTECT_SYSPERM_MAX_ID, 10) || 100000,
    'application.protectSysDictionaryMaxId': parseInt(process.env.PROTECT_SYSDICT_MAX_ID, 10) || 200000,
    'application.domain': process.env.APPLICATION_DOMAIN || 'http://localhost:7004',

    // Redis
    'redis.host': process.env.REDIS_HOST || '127.0.0.1',
    'redis.port': parseInt(process.env.REDIS_PORT, 10) || 6379,
    'redis.password': process.env.REDIS_PASSWORD || '',
    'redis.db': parseInt(process.env.REDIS_DB, 10) || 0,
    'redis.queue.db': parseInt(process.env.REDIS_QUEUE_DB, 10) || 1,
    'redis.globalPrefix': process.env.REDIS_GLOBAL_PREFIX || 'tiger8_',

    // Logger
    'logger.level': process.env.LOGGER_LEVEL || 'debug',
    'logger.maxFiles': parseInt(process.env.LOGGER_MAXFILES, 10) || 10,
    'logger.maxSize': process.env.LOGGER_MAXSIZE || '20m',

    // JWT
    'jwt.secret': process.env.JWT_SECRET || 'secret123',
    'jwt.expires': parseInt(process.env.JWT_EXPIRES, 10) || 3600,

    // Swagger
    'swagger.enable': process.env.SWAGGER_ENABLE === 'true' || false,
    'swagger.path': process.env.SWAGGER_PATH || 'api-docs',

    // 数据库（AWSDB replication示例）
    'awsdb.master': process.env.AWSDB_MASTER || '127.0.0.1',
    'awsdb.slave': process.env.AWSDB_SLAVE || '127.0.0.1',
    'awsdb.port': parseInt(process.env.AWSDB_PORT, 10) || 3306,
    'awsdb.username': process.env.AWSDB_USER || 'ruoyi',
    'awsdb.password': process.env.AWSDB_PASSWORD || 'ruoyiadmin',
    'awsdb.database': process.env.AWSDB_NAME || 'tiger8',
    'awsdb.logging': process.env.AWSDB_LOGGING === 'true' || false,
  };
  
  // 合并YAML配置和基础配置（YAML配置优先级更高）
  const mergedConfig = {
    ...baseConfig,
    ...yamlConfig,
  };
  
  console.log('Final merged config:', mergedConfig);
  
  return mergedConfig;
};