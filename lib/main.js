"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const snakecase_keys_1 = __importDefault(require("snakecase-keys"));
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const DEPLOYS_URL = process.env.VELOCITY_DEPLOYS_URL || "https://velocity.codeclimate.com/deploys";
const GITHUB_EVENT_PATH = process.env.GITHUB_EVENT_PATH;
const readEvent = () => camelcase_keys_1.default(JSON.parse(fs_1.readFileSync(GITHUB_EVENT_PATH, "utf8")), { deep: true });
const report = (deploy) => axios_1.default.post(DEPLOYS_URL, snakecase_keys_1.default(Object.assign({}, deploy, { token: core.getInput("token") })), {
    headers: {
        Accept: "application/json",
    },
});
const run = () => __awaiter(this, void 0, void 0, function* () {
    const event = readEvent();
    const deploy = {
        revision: process.env.GITHUB_SHA,
        branch: process.env.GITHUB_REF.replace("refs/heads", ""),
        environment: core.getInput("environment") ||
            (event.deployment || {}).environment ||
            null,
        version: core.getInput("version") || null,
        repositoryUrl: event.repository.url,
    };
    core.debug("Reporting deploy to Velocity...");
    core.debug(`revision: ${deploy.revision}`);
    core.debug(`branch: ${deploy.branch}`);
    core.debug(`environment: ${deploy.environment}`);
    core.debug(`version: ${deploy.version}`);
    try {
        yield report(deploy);
        core.debug("Reported deploy.");
    }
    catch (error) {
        core.setFailed(error.message);
    }
});
run();
