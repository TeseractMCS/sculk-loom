import {
    ItemUseAfterEvent,
    WorldInitializeBeforeEvent,
} from "@minecraft/server";
import { Registries, Registry } from "@teseractmcs/hardcore-api";
import { EventHandler, TeseractPlugin } from "@teseractmcs/server-api";
import StickItem from "./item/StickItem";

export default class Test extends TeseractPlugin {
    @EventHandler
    private onItemUse(event: ItemUseAfterEvent) {
        LOGGER.info("Item used: " + event.itemStack.typeId);
    }
    public override onLoaded(): void {
        this.getEventManager().registerEvents(this);
        this.getCommandManager().registerCommand(new StickItem())
    }
    public override onEnabled(initializer: WorldInitializeBeforeEvent): void {
    }
}
