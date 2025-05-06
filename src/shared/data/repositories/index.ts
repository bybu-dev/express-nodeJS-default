import EncryptionRepository from "./encryption"
import NotificationRepository from "./notification"
import { SocketRepository } from "./socket"

export class Repositories {
    static new = async () => {
        return new Repositories(
            new EncryptionRepository(),
            new SocketRepository(),
            new NotificationRepository(),
        )
    }
    
    constructor(
        readonly encryption: EncryptionRepository,
        readonly socket: SocketRepository,
        // readonly event: EventPublisher,
        readonly notification: NotificationRepository,
    ) {}
}