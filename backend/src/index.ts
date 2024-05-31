/**
* Main entry file to host the backend.
*/

import { PORT } from "./utils/config";
import { info } from "./utils/logger";
import { server } from "./homeWS";

server.listen(PORT, () => {
    info(`Server running on port ${PORT}`);
});
