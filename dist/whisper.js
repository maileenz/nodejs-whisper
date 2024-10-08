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
exports.whisperShell = whisperShell;
exports.executeCppCommand = executeCppCommand;
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const WHISPER_CPP_PATH = path_1.default.join(__dirname, '..', 'cpp', 'whisper.cpp');
const WHISPER_CPP_MAIN_PATH = './main';
const projectDir = process.cwd();
const defaultShellOptions = {
    silent: true,
    async: true,
};
function handleError(error) {
    console.error('[Nodejs-whisper] Error:', error.message);
    shelljs_1.default.cd(projectDir);
    throw error;
}
function whisperShell(command_1) {
    return __awaiter(this, arguments, void 0, function* (command, options = defaultShellOptions, verbose) {
        return new Promise((resolve, reject) => {
            shelljs_1.default.exec(command, options, (code, stdout, stderr) => {
                console.log('code---', code);
                console.log('stdout---', stdout);
                console.log('stderr---', stderr);
                if (code === 0) {
                    if (stdout.includes('error:')) {
                        reject(new Error('Error in whisper.cpp:\n' + stdout));
                        return;
                    }
                    if (verbose) {
                        console.log('stdout---', stdout);
                        console.log('[Nodejs-whisper] Transcribing Done!');
                    }
                    resolve(stdout);
                }
                else {
                    reject(new Error(stderr));
                }
            });
        }).catch((error) => {
            handleError(error);
            return Promise.reject(error);
        });
    });
}
function executeCppCommand(command, verbose, withCuda) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            shelljs_1.default.cd(WHISPER_CPP_PATH);
            if (!shelljs_1.default.which(WHISPER_CPP_MAIN_PATH)) {
                console.log('[Nodejs-whisper] whisper.cpp not initialized.');
                const makeCommand = withCuda ? 'WHISPER_CUDA=1 make -j' : 'make -j';
                shelljs_1.default.exec(makeCommand);
                if (!shelljs_1.default.which(WHISPER_CPP_MAIN_PATH)) {
                    throw new Error("[Nodejs-whisper] 'make' command failed. Please run 'make' command in /whisper.cpp directory.");
                }
                console.log("[Nodejs-whisper] 'make' command successful.");
            }
            return yield whisperShell(command, defaultShellOptions, verbose);
        }
        catch (error) {
            handleError(error);
            throw new Error('Failed to execute C++ command');
        }
    });
}
//# sourceMappingURL=whisper.js.map