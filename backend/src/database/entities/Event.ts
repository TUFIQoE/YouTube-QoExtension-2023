import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Experiment } from './Experiment'

export type EventSource = 'network' | 'player' | 'subject'

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  source: EventSource

  @Column()
  type: string | null // eg. mousedown, mouseup, keydown, keyup, scroll, drag, buffering, seeking etc.

  @Column()
  location: string

  @Column()
  timestamp: string

  @Column('simple-json', { nullable: true })
  details: object

  @ManyToOne(() => Experiment, (experiment) => experiment.events, { nullable: false })
  experiment: Experiment
}
