import type {
    Client,
    EocLogEntry,
    Image,
    ImageTemplate,
    Material,
    Patient,
    PatientTemplate,
    Personell,
    StatusHistoryEntry,
    TransferPoint,
    Vehicle,
    VehicleTemplate,
    Viewport,
} from './models';
import type { UUID } from './utils';
import { uuid } from './utils';
import type { Immutable } from './utils/immutability';

// TODO: This is a workaround, because else the following error is thrown when using produce():
// `[Immer] produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'.Got '[object Object]'`
// (I have no idea why...)
export const generateExercise = (): ExerciseState => ({
    ...new ExerciseStateClass(),
});

/**
 * An immutable object that represents the complete state of an exercise the backend should be aware of.
 */
export type ExerciseState = Immutable<InstanceType<typeof ExerciseStateClass>>;

class ExerciseStateClass {
    public id = uuid();
    public viewports: { [key: UUID]: Viewport } = {};
    public vehicles: { [key: UUID]: Vehicle } = {};
    public personell: { [key: UUID]: Personell } = {};
    public patients: { [key: UUID]: Patient } = {};
    public materials: { [key: UUID]: Material } = {};
    public images: { [key: UUID]: Image } = {};
    public transferPoints: { [key: UUID]: TransferPoint } = {};
    public clients: { [key: UUID]: Client } = {};
    public patientTemplates: PatientTemplate[] = [];
    public vehicleTemplates: VehicleTemplate[] = [];
    public imageTemplates: ImageTemplate[] = [];
    public ecoLog: EocLogEntry[] = [];
    public statusHistory: StatusHistoryEntry[] = [];
    public participantId = '';
}