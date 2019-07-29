"use strict";
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
const readEvent = () => camelcase_keys_1.default(JSON.parse(fs_1.readFileSync(GITHUB_EVENT_PATH, "utf8")));
const report = (deploy) => axios_1.default.post(DEPLOYS_URL, snakecase_keys_1.default(Object.assign({}, deploy, { token: process.env.VELOCITY_DEPLOYMENT_TOKEN })));
const main = () => {
    try {
        const event = readEvent();
        report({
            revision: process.env.GITHUB_SHA,
            branch: process.env.GITHUB_REF,
            environment: core.getInput("environment") || (event.deployment || {}).environment,
            version: core.getInput("version"),
            repositoryUrl: event.repository.webUrl,
        });
    }
    catch (error) {
        core.setFailed(error.message);
    }
};
main();
