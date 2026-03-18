import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('channels_station')
export class ChannelsStation extends AbstractEntity {
    @Column({ type: 'int', name: 'channel_id', nullable: false, comment: '景区id' })
  channelId: number;

  @Column({ type: 'varchar', length: 100, name: 'station', nullable: false, comment: '营业点' })
  station: string;

  
}