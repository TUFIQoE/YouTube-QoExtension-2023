import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Experiment } from './Experiment'

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  value: number

  @Column()
  description: string

  @Column()
  started: string

  @Column()
  timestamp: string

  @Column()
  duration: number

  @ManyToOne(() => Experiment, (experiment) => experiment.assessments, { nullable: false })
  experiment: Experiment
}
