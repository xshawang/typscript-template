import { ApiProperty } from '@nestjs/swagger';
import {
  RESPONSE_SUCCESS_CODE,
  RESPONSE_SUCCESS_MSG,
} from '../constants/response';
import { IPaginationInfo, IListRespData, IPaginationRespData } from '../interfaces/response';

export class PaginationInfo implements IPaginationInfo {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;
}

export class BaseResponse<T = any> {
  @ApiProperty({
    default: RESPONSE_SUCCESS_MSG,
  })
  msg: string;

  @ApiProperty({
    default: RESPONSE_SUCCESS_CODE,
  })
  code: number;

  @ApiProperty({
    required: false,
  })
  data?: T;

  static success<T>(data?: T, msg: string = RESPONSE_SUCCESS_MSG) {
    const response = new BaseResponse<T>();
    response.code = RESPONSE_SUCCESS_CODE;
    response.msg = msg;
    if (data !== undefined) {
      response.data = data;
    }
    return response;
  }

  static error(msg: string, code: number = -1) {
    const response = new BaseResponse();
    response.code = code;
    response.msg = msg;
    return response;
  }
}

export class ListResponse<T = any> extends BaseResponse<IListRespData<T>> {
  static list<T>(list: T[], msg: string = RESPONSE_SUCCESS_MSG) {
    const response = new BaseResponse<IListRespData<T>>();
    response.code = RESPONSE_SUCCESS_CODE;
    response.msg = msg;
    response.data = { list };
    return response;
  }
}

export class PaginationResponse<T = any> extends BaseResponse<IPaginationRespData<T>> {
  static paginate<T>(list: T[], pagination: IPaginationInfo, msg: string = RESPONSE_SUCCESS_MSG) {
    const response = new BaseResponse<IPaginationRespData<T>>();
    response.code = RESPONSE_SUCCESS_CODE;
    response.msg = msg;
    response.data = { list, pagination };
    return response;
  }
}