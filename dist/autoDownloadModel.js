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
exports.default = autoDownloadModel;
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("./constants");
function autoDownloadModel(autoDownloadModelName_1, verbose_1) {
    return __awaiter(this, arguments, void 0, function* (autoDownloadModelName, verbose, withCuda = false) {
        const projectDir = process.cwd();
        if (!autoDownloadModelName) {
            throw new Error('[Nodejs-whisper] Error: Model name must be provided.');
        }
        if (!constants_1.MODELS_LIST.includes(autoDownloadModelName)) {
            throw new Error('[Nodejs-whisper] Error: Provide a valid model name');
        }
        try {
            const modelDirectory = path_1.default.join(projectDir, 'whisper.cpp', 'models');
            shelljs_1.default.cd(modelDirectory);
            const modelAlreadyExist = fs_1.default.existsSync(path_1.default.join(modelDirectory, autoDownloadModelName));
            if (modelAlreadyExist) {
                if (verbose) {
                    console.log(`[Nodejs-whisper] ${autoDownloadModel} already exist. Skipping download.`);
                }
                return 'Models already exist. Skipping download.';
            }
            console.log(`[Nodejs-whisper] Auto-download Model: ${autoDownloadModelName}`);
            let scriptPath = './download-ggml-model.sh';
            if (process.platform === 'win32') {
                scriptPath = 'download-ggml-model.cmd';
            }
            shelljs_1.default.chmod('+x', scriptPath);
            const result = shelljs_1.default.exec(`${scriptPath} ${autoDownloadModelName}`, { silent: !verbose });
            if (result.code !== 0) {
                throw new Error(`[Nodejs-whisper] Failed to download model: ${result.stderr}`);
            }
            console.log('[Nodejs-whisper] Attempting to compile model...');
            shelljs_1.default.cd('../');
            shelljs_1.default.exec('make clean');
            const compileCommand = withCuda ? 'WHISPER_CUDA=1 make -j' : 'make -j';
            const compileResult = shelljs_1.default.exec(compileCommand, { silent: !verbose });
            if (compileResult.code !== 0) {
                throw new Error(`[Nodejs-whisper] Failed to compile model: ${compileResult.stderr}`);
            }
            console.log('[Nodejs-whisper] Model downloaded and compiled successfully');
        }
        catch (error) {
            console.error('[Nodejs-whisper] Error caught in autoDownloadModel:', error);
            shelljs_1.default.cd(projectDir);
            throw error;
        }
    });
}
//# sourceMappingURL=autoDownloadModel.js.map