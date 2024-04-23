import { PORT } from "./utils/config";
import { info } from "./utils/logger";
import { server } from "./ws";

server.listen(PORT, () => {
    info(`Server running on port ${PORT}`);
});
