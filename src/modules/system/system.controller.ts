import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  getInviteLinksDto,
  NoticeListDto,
  ReadNoticeDto,
} from './system.dto';
import { SystemService } from './system.service';
import { wrapResponse } from '/@/common/utils/swagger';
import { AuthUser } from '/@/decorators/auth-user.decorator';
import { ApiSecurityAuth } from '/@/decorators/swagger.decorator';

@ApiTags('System - 系统相关')
@Controller('system')
export class SystemController {
  constructor(private userService: SystemService) {}



  @Get('unreadNoticeCount')
  @ApiSecurityAuth()
  @ApiOkResponse({
    type: wrapResponse({
      type: NoticeListDto,
    }),
  })
  async unreadNoticeCount(@AuthUser('uid') uid: number) {
    return await this.userService.unreadNoticeCount(uid);
  }

  @Get('noticeList')
  @ApiSecurityAuth()
  @ApiOkResponse({
    type: wrapResponse({
      type: NoticeListDto,
    }),
  })
  async noticeList(@AuthUser('uid') uid: number) {
    return await this.userService.noticeList(uid);
  }

  @Get('systemConfig')
  @ApiOkResponse({
    type: wrapResponse({
      type: NoticeListDto,
    }),
  })
  async systemConfig() {
    return await this.userService.systemConfig();
  }

  @Post('noticeRead')
  @ApiOkResponse({
    type: wrapResponse({
      type: {},
    }),
  })
  async noticeRead(@AuthUser('uid') uid: number, @Body() body: ReadNoticeDto) {
    return await this.userService.noticeRead(uid, body.id, body.all !== 0);
  }

}