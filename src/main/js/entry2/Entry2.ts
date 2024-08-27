import { WorldInitializeBeforeEvent } from "@minecraft/server";
import TeseractPlugin from "teseract/server-api/plugin/TeseractPlugin";
import Identifier from "teseract/server-api/util/Identifier";

export default class Entry2 extends TeseractPlugin {
    public static override PLUGIN_ID: string = "entry2"
    public override onLoaded(): void {
        LOGGER.log("Loaded" + this.constructor.name)
    }
    public override onEnabled(initializer: WorldInitializeBeforeEvent): void {
        LOGGER.log("Enabled " + this.constructor.name)
    }
}