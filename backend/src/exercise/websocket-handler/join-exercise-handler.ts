import { ValidationErrorWrapper } from '../../utils/validation-error-wrapper';
import type { ExerciseServer, ExerciseSocket } from '../../exercise-server';
import { clientMap } from '../client-map';
import { secureOn } from './secure-on';

export const registerJoinExerciseHandler = (
    io: ExerciseServer,
    client: ExerciseSocket
) => {
    secureOn(
        client,
        'joinExercise',
        async (
            exerciseId: string,
            clientName: string,
            callback
        ): Promise<void> => {
            const clientId = await clientMap
                .get(client)
                ?.joinExercise(exerciseId, clientName)
                .catch((e: unknown) => {
                    if (e instanceof ValidationErrorWrapper) {
                        callback({
                            success: false,
                            message: `Invalid payload: ${e.errors}`,
                        });
                        return;
                    }
                    throw e;
                });
            if (!clientId) {
                callback({
                    success: false,
                    message: 'The exercise does not exist',
                });
                return;
            }
            callback({
                success: true,
                payload: clientId,
            });
        }
    );
};
