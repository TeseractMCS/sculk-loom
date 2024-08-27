import {
    ChatSendBeforeEvent,
    EntityDieAfterEvent,
    ItemUseBeforeEvent,
    PlayerJoinAfterEvent,
    world,
} from "@minecraft/server";
import EventHandler from "teseract/server-api/event/EventHandler";
import TeseractPlugin from "teseract/server-api/plugin/TeseractPlugin";
import Teseract from "teseract/server-api/Teseract";

export default class Test extends TeseractPlugin {
    @EventHandler
    public onChatSend(event: ChatSendBeforeEvent) {
        if (event.isCommand) {
            return;
        }
        event.cancel = true;
        world.sendMessage(`${event.sender.name} >> ${event.message}`);
    }

    @EventHandler
    public onJoined(event: PlayerJoinAfterEvent) {
        LOGGER.info("A player has joined: " + event.playerName);
        world.sendMessage("Welcome, " + event.playerName);
    }

    @EventHandler
    public onDeath(event: EntityDieAfterEvent) {
        if (!event.deadEntity.isPlayer()) {
            return;
        }
        world.sendMessage(
            "I'm so sorry for you, " +
                event.deadEntity.name +
                ", I hope you find your stuff!",
        );
        LOGGER.info("A player has died: " + event.deadEntity.name);
    }

    @EventHandler
    public async fastTotem({ itemStack, source }: ItemUseBeforeEvent) {
        if (
            itemStack.typeId != "minecraft:shield" &&
            itemStack.typeId != "minecraft:totem_of_undying"
        ) {
            return;
        }
        const inventory = source.getInventory();
        await null;
        inventory.setMainHandItemStack(inventory.getOffHandItemStack());
        inventory.setOffHandItemStack(itemStack);
    }


    public override async onEnabled() {
        LOGGER.info("Initialized " + this.constructor.name);
        await null;
        Teseract.getEventManager().registerEvents(this);
        LOGGER.log("An event handler has been registerd");
        LOGGER.info(this.constructor.name + " has been fully enabled!");
    }
}
