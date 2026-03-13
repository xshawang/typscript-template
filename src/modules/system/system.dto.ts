import { NumberField } from '/@/decorators/field.decorator';

export class ReadNoticeDto {
  @NumberField()
  id: number;

  @NumberField()
  all: number;
}



export class NoticeDto {
  content: string;
  isRead: string;
  time_unix: string;
  id: number;
  constructor(data: any) {
    this.content = data.content;
    this.isRead = data.isRead;
    this.time_unix = data.createTime;
    this.id = data.id;
  }
}

export class NoticeListDto {
  list: NoticeDto[];
  constructor(data: any) {
    this.list = data.map((item: any) => new NoticeDto(item));
  }
}
