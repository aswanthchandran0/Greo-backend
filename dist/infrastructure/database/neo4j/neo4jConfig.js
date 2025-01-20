"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driver = exports.getSession = void 0;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const config_1 = require("../../../config/config");
const driver = neo4j_driver_1.default.driver(config_1.config.NEO4J_URL, neo4j_driver_1.default.auth.basic(config_1.config.NEO4J_USERNAME, config_1.config.NEO4J_PASSWORD));
exports.driver = driver;
const verifyConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = driver.session();
    try {
        const result = yield session.run("RETURN 1");
        if (result.records.length > 0) {
            console.log('Neo4j connection verified sucessfully');
        }
    }
    catch (error) {
        console.error("Neo4j connection verification failed", error);
    }
    finally {
        yield session.close();
    }
});
verifyConnection();
const getSession = () => {
    return driver.session();
};
exports.getSession = getSession;
