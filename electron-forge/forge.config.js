import makerSquirrel from "@electron-forge/maker-squirrel";
import makerZip from "@electron-forge/maker-zip";
import makerDeb from "@electron-forge/maker-deb";
import makerRpm from "@electron-forge/maker-rpm";

export default {
  packagerConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "IPCameraConfig",
        setupExe: "IPCameraConfigSetup.exe",
        shortcutName: "IP Camera Config",
      },
    },
    {
      name: "@electron-forge/maker-zip",
    },
    {
      name: "@electron-forge/maker-deb",
    },
    {
      name: "@electron-forge/maker-rpm",
    },
  ],
};
