import { IsInt, IsJSON, IsString, MinLength, MaxLength } from 'class-validator';
import type { ServiceProvider } from 'database/services/service-provider';
import { ExerciseState } from 'digital-fuesim-manv-shared';
import type { ExerciseWrapper } from 'exercise/exercise-wrapper';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity()
export class ExerciseWrapperEntity extends BaseEntity<
    ExerciseWrapperEntity,
    ExerciseWrapper
> {
    @Column({
        type: 'integer',
        default: 0,
    })
    @IsInt()
    tickCounter = 0;

    @Column({
        type: 'json',
    })
    @IsJSON()
    initialStateString!: string;

    @Column({ type: 'char', length: 6 })
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    participantId!: string;

    @Column({ type: 'char', length: 8 })
    @IsString()
    @MinLength(8)
    @MaxLength(8)
    trainerId!: string;

    @Column({ type: 'integer', default: 0 })
    @IsInt()
    stateVersion!: number;

    /**
     * Be very careful when using this. - Use {@link create} instead for most use cases.
     * This constructor does not guarantee a valid entity.
     */
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        super();
    }

    static async create(
        participantId: string,
        trainerId: string,
        services: ServiceProvider,
        initialState: ExerciseState = ExerciseState.create()
    ): Promise<ExerciseWrapperEntity> {
        const exercise = await services.exerciseWrapperService.create({
            participantId,
            trainerId,
            initialStateString: JSON.stringify(initialState),
            stateVersion: ExerciseState.currentStateVersion,
        });

        return exercise;
    }
}
