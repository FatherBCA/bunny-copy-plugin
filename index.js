/**
 * @name Tap To Copy Message
 * @description Instantly copies any chat message text directly to your clipboard with a single tap.
 * @author Dev
 * @version 1.0.0
 */

import { metro, common } from "@bunny";
const { clipboard } = common;

const ChatMessageText = metro.findByProps("ChatMessageText") || metro.findByName("ChatMessageText", false);

let unpatch;

export default {
    onLoad: () => {
        if (!ChatMessageText) return;

        unpatch = metro.before("default", ChatMessageText, (args) => {
            const props = args[0];
            if (!props || !props.message) return;

            const originalOnPress = props.onPress;

            props.onPress = (event) => {
                const textToCopy = props.message.content;

                if (textToCopy) {
                    clipboard.setString(textToCopy);
                    if (common.toast) {
                        common.toast.show("⚡ Copied!", 0);
                    }
                }

                if (originalOnPress) {
                    originalOnPress(event);
                }
            };
        });
    },
    onUnload: () => {
        if (unpatch) unpatch();
    }
};
