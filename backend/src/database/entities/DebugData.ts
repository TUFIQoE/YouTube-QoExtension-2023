import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Experiment } from './Experiment'

/**
 * DebugData entity(table) contains debug data (nerd statistics) captured by the browser extension.
 * it has foreign key to Experiment entity(table).
 * There is no video foreign key. Instead there is a
 * sessionID which is a unique v4-uuid generated on every video enter.
 * Can also group by experiment or videoID (the unique video ID exposed by YouTube).
 */
@Entity()
export class DebugData {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  sessionID: string // <-- this is the ID generated on every video enter, can use select distinct to get all video sessions

  @Column({ nullable: true })
  videoID: string

  @Column({ nullable: true })
  sCPN: string

  @Column({ nullable: true })
  viewport: string

  @Column({ nullable: true })
  droppedFrames: string

  @Column({ nullable: true })
  totalFrames: string

  @Column({ nullable: true })
  currentResolution: string

  @Column({ nullable: true })
  optimalResolution: string

  @Column({ nullable: true })
  volume: string

  @Column({ nullable: true })
  normalizedVolume: string

  @Column({ nullable: true })
  codecs: string

  @Column({ nullable: true })
  color: string

  @Column({ nullable: true })
  connectionSpeed: string

  @Column({ nullable: true })
  networkActivity: string

  @Column({ nullable: true })
  bufferHealth: string

  @Column({ nullable: true })
  mysteryText: string

  @Column({ nullable: true })
  date: string

  @Column({ nullable: true })
  timestamp: string

  @ManyToOne(() => Experiment, (experiment) => experiment.debugData, { nullable: false })
  experiment: Experiment
}
