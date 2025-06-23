import { useHunterStore } from "./HunterStore";
const HunterStore = useHunterStore();

const banners = [
    "Blank Page Banner" = {
        "name": "exterminate (all) blankies",
        "img": "",
        "content": [
            HunterStore.getHunterByName("Jacob"),
            HunterStore.getHunterByName("Dandy"),
        ]
    }
]

export function rollGacha() {}

