"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
/*
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 * More on args: https://storybook.js.org/docs/react/writing-stories/args
 * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
 */
const react_1 = __importDefault(require("react"));
const Settings_1 = require("../components/Settings");
exports.default = {
    title: 'Utilities/AI Text Processor',
    component: Settings_1.Settings,
    parameters: {
        controls: {
            disabled: true,
        },
        options: { showPanel: false },
    },
};
const Template = (args) => react_1.default.createElement(Settings_1.Settings, Object.assign({}, args));
exports.Settings = Template.bind({});
exports.Settings.args = {};
