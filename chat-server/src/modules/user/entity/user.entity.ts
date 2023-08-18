import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ default: '陈冠希' })
  username: string;

  @Column({ default: '123456', select: false })
  password: string;

  @Column({ default: 'chenguanxi.png' })
  avatar: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'on' })
  status: string;

  @Column({ default: '' })
  tag: string;

  @Column({ default: '' })
  nickName: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: 0 })
  gender: number;

  @Column({type: 'double',default: new Date().valueOf()})
  createTime: number;
}
