import {
    ChatSendBeforeEvent,
    EntityDieAfterEvent,
    PlayerJoinAfterEvent,
    world,
} from "@minecraft/server";
import EventHandler from "teseract/server-api/event/EventHandler";
import Teseract from "teseract/server-api/Teseract";
import Runnable from "teseract/server-api/timer/Runnable";

export default class Test extends Runnable {
    @EventHandler
    public onChatSend(event: ChatSendBeforeEvent) {
        if (event.isCommand) {
            return;
        }
        event.cancel = true;
        world.sendMessage(`${event.sender.name} >> ${event.message} xd`);
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
        event.deadEntity.getInventory()
        LOGGER.info("A player has died: " + event.deadEntity.name);
    }

    public override *onRunJob(...args: any[]): Generator<void, void, void> {
        world.sendMessage("I'm a message that will be sent every second!");
    }

    public constructor() {
        super();
        LOGGER.info("Initialized " + this.constructor.name);
        this.runTimer(20);
        LOGGER.debug("A runnable timer is running!");
        Teseract.getEventManager().registerEvents(this);
        LOGGER.log("An event handler has been registerd");
        LOGGER.info(this.constructor.name + " has been fully enabled!")
    }
}
