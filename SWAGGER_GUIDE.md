# Swagger API 文档使用指南

本项目使用 NestJS Swagger 模块来自动生成 API 文档。以下是 Swagger 注解的主要用法：

## 主要 Swagger 注解

### 1. 模块级别注解
- `@ApiTags(name: string)` - 为控制器分组，显示在 Swagger UI 中的标签

### 2. 路由级别注解
- `@ApiOperation(options: { summary: string, description?: string })` - 描述 API 操作
- `@ApiBody(options: { type: any })` - 定义请求体参数
- `@ApiQuery(options: { name: string, required?: boolean, description?: string, example?: any })` - 定义查询参数
- `@ApiParam(options: { name: string, required?: boolean, description?: string, example?: any })` - 定义路径参数
- `@ApiHeader(options: { name: string, required?: boolean, description?: string })` - 定义请求头参数

### 3. 响应级别注解
- `@ApiResponse(options: { status: number, description: string, type?: any })` - 定义响应格式

## 示例说明

以下是在本项目中使用的典型模式：

```typescript
@ApiTags('User - 用户模块')  // 控制器标签
@Controller('user')
export class UserController {

  @Post('login')
  @ApiOperation({ 
    summary: '用户登录（微信登录）',           // 操作摘要
    description: '用户通过微信授权码进行登录'  // 详细描述
  })
  @ApiBody({ type: LoginDto })              // 请求体类型
  @ApiResponse({ 
    status: 200, 
    description: '登录成功',                  // 响应描述
    schema: {                               // 响应示例
      example: {
        code: 0,
        msg: '登录成功',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        userInfo: { ... }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    // 实现逻辑
  }
}
```

## 认证相关注解

对于需要认证的接口：

```typescript
@UseGuards(FrontendAuthGuard)              // 应用守卫
@ApiHeader({
  name: 'Authorization',
  description: '用户JWT token，格式为 Bearer {token}',  // 认证头描述
  required: true
})
```

## DTO 类型定义

确保 DTO 类使用适当的 Swagger 注解：

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: '微信授权码', 
    example: '081Ldabcdeabcdeabcdeabcdeabcdeabcde' 
  })
  @IsString()
  code: string;
}
```

## 访问 API 文档

启动应用后，可以通过以下地址访问 Swagger UI：
- http://localhost:7004/api-docs (根据配置文件中的 swagger.path)

## 注意事项

1. 确保所有 DTO 类型都被正确注解，以便 Swagger 能够生成准确的文档
2. 对于复杂的数据结构，使用 `@ApiProperty` 注解属性
3. 使用 `@ApiHideProperty()` 隐藏敏感字段（如密码）
4. 为每个 API 端点提供清晰的描述和示例