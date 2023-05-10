"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../app"));
const config_1 = __importDefault(require("../../config/config"));
const db_1 = __importDefault(require("../../config/db"));
void (0, db_1.default)();
app_1.default.listen(config_1.default.server.port, () => {
    console.log(`⚡️[server]: Server is running at http://${config_1.default.server.host}:${config_1.default.server.port}`);
});
//# sourceMappingURL=server.js.map