import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { DebugData } from './DebugData'
import { Assessment } from './Assessment'
import { Event } from './Event'

export type SubjectSex = 'male' | 'female' | 'undisclosed'

/**
 * Experiment entity (table) contains information on experiment subjects.
 * Other experiment data are linked to this entity via foreign key.
 * Experiment is assigned to each subject.
 */
@Entity()
export class Experiment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  subjectAge: number

  @Column()
  subjectSex: SubjectSex

  @Column()
  started: string

  @Column({ nullable: true })
  ended: string

  @OneToMany(() => DebugData, (debugData) => debugData.experiment)
  debugData: DebugData[]

  @OneToMany(() => Assessment, (assessment) => assessment.experiment)
  assessments: Assessment[]

  @OneToMany(() => Event, (event) => event.experiment)
  events: Event[]
}
