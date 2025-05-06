import { connection } from "@/utils/lib/socket";

export class SocketRepository {
    constructor() {
    }

    get getConnection() {
        return connection
    }
}