import {
    ItemUseAfterEvent,
    WorldInitializeBeforeEvent,
} from "@minecraft/server";
import { EventHandler, TeseractPlugin } from "@teseractmcs/server-api";

export default class Test extends TeseractPlugin {
    @EventHandler
    private onItemUse(event: ItemUseAfterEvent) {
        LOGGER.info("Item used: " + event.itemStack.typeId);
    }
    public override onLoaded(): void {
        this.getEventManager().registerEvents(this);
    }
    public override onEnabled(initializer: WorldInitializeBeforeEvent): void {
    }
}
