import { generateAvatar } from "@/lib/generate-avatar";
import React from "react";

export default function ProfileListItem({
    id,
    name,
    createdAt,
}: {
    id: string;
    name: string;
    createdAt: Date;
}) {
    const avatar = generateAvatar(name);
    const timestamp = createdAt;
    const dateObject = new Date(timestamp);

    const formattedDate = dateObject.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex items-center gap-x-4 hover:cursor-pointer hover:bg-white/10 rounded p-3 transition">
            <div className="h-full flex items-center justify-center">
                <div
                    dangerouslySetInnerHTML={{ __html: avatar }}
                    className="h-11 w-11"
                />
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-lg">{name}</p>
                <p className="text-xs text-stone-400">
                    Joined on {formattedDate}
                </p>
            </div>
        </div>
    );
}
