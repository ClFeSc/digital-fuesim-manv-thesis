import { Patient, uuid } from 'digital-fuesim-manv-shared';
import { createExercise, createTestEnvironment } from './utils';

describe('propose action', () => {
    const environment = createTestEnvironment();

    it('fails proposing an action when not joined an exercise', async () => {
        await environment.withWebsocket(async (socket) => {
            const proposeAction = await socket.emit('proposeAction', {
                type: '[Patient] Add patient',
                patient: new Patient({}, null, 'black', ''),
            });

            expect(proposeAction.success).toBe(false);
        });
    });

    it('fails proposing a syntactically invalid action', async () => {
        const exerciseIds = await createExercise(environment);

        await environment.withWebsocket(async (socket) => {
            const join = await socket.emit(
                'joinExercise',
                exerciseIds.trainerId,
                'Name'
            );

            expect(join.success).toBe(true);

            const propose = await socket.emit('proposeAction', {
                type: '[Patient] Remove patient',
                patientId: 'invalid-id',
            });

            expect(propose.success).toBe(false);
        });
    });

    it('fails proposing a semantically invalid action', async () => {
        const exerciseIds = await createExercise(environment);

        await environment.withWebsocket(async (socket) => {
            const join = await socket.emit(
                'joinExercise',
                exerciseIds.trainerId,
                'Name'
            );

            expect(join.success).toBe(true);

            const propose = await socket.emit('proposeAction', {
                type: '[Patient] Remove patient',
                patientId: uuid(),
            });

            expect(propose.success).toBe(false);
        });
    });

    it('succeeds proposing a valid action', async () => {
        const exerciseIds = await createExercise(environment);

        await environment.withWebsocket(async (socket) => {
            const join = await socket.emit(
                'joinExercise',
                exerciseIds.trainerId,
                'Name'
            );

            expect(join.success).toBe(true);

            const propose = await socket.emit('proposeAction', {
                type: '[Patient] Add patient',
                patient: new Patient(
                    { any: 'some info' },
                    null,
                    'green',
                    'now'
                ),
            });

            expect(propose.success).toBe(true);
        });
    });
});