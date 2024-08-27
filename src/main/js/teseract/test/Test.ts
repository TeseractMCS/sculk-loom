import { ChatSendBeforeEvent, world } from "@minecraft/server";
import EventHandler from "teseract/server-api/event/EventHandler";
import Teseract from "teseract/server-api/Teseract";
import Identifier from "teseract/server-api/util/Identifier";

export default class Test {
    @EventHandler
    public onChatSend(event: ChatSendBeforeEvent) {
        if (event.isCommand) {
            return;
        }
        event.cancel = true;
        world.sendMessage(`${event.sender.name} >> ${event.message}`);
    }

    public constructor() {
        Teseract.getEventManager().registerEvents(this);
    }
}
