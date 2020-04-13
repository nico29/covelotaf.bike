import getConfig from "next/config";
export const PASSWORD_REGEX = /(?=.*[0-9])(?=.*[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ])(?=.*[A-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]).{8,}/;

const { serverRuntimeConfig: config } = getConfig();

export const ENABLE_INVITE_CODE: boolean = config.ENABLE_INVITE_CODE;
export const SESSION_SECRET: string = config.SESSION_SECRET;
export const MAPBOX_TOKEN: string = config.MAPBOX_TOKEN;
