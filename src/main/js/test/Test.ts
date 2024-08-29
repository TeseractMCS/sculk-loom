import {
    ItemUseAfterEvent,
    WorldInitializeBeforeEvent,
} from "@minecraft/server";
import EventHandler from "@teseract/server-api/event/EventHandler";
import TeseractPlugin from "@teseract/server-api/plugin/TeseractPlugin";

export default class Test extends TeseractPlugin {
    @EventHandler
    private onItemUse(event: ItemUseAfterEvent) {
        LOGGER.info("Item used: " + event.itemStack.typeId);
    }
    public override onLoaded(): void {
        this.getEventManager().registerEvents(this);
    }
    public override onEnabled(initializer: WorldInitializeBeforeEvent): void {
        LOGGER.info("Ni gger ni gger niu gga");
    }
}
