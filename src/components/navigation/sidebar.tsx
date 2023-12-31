"use client";

import useUser from "@/hooks/useUser";
import { generateAvatar } from "@/lib/generate-avatar";
import {
    Bell,
    Contact,
    MessageSquareText,
    Users,
    UsersRound,
} from "lucide-react";
import React, { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function NavigationSidebar() {
    const { user } = useUser();
    const avatar = generateAvatar(user?.name as string);
    const location = usePathname();

    return (
        <div className="dark:bg-black/50 h-full w-14 flex flex-col items-center py-4">
            <div className="flex flex-col flex-1 gap-y-2 *:self-center *:cursor-pointer">
                <Link href="/users">
                    <div className="hover:bg-white/15  rounded-md p-2 transition ">
                        <Users
                            className={cn(
                                "w-6 h-6",
                                location === "/users"
                                    ? " stroke-teal-500"
                                    : "fill-none"
                            )}
                        />
                    </div>
                </Link>
                <Link href="/chats">
                    <div className="hover:bg-white/15  rounded-md p-2 transition ">
                        <MessageSquareText
                            className={cn(
                                "w-6 h-6",
                                location === "/chats"
                                    ? " stroke-sky-500"
                                    : "fill-none"
                            )}
                        />
                    </div>
                </Link>

                <Link href="/notifications">
                    <div className="hover:bg-white/15  rounded-md p-2 transition">
                        <Bell
                            className={cn(
                                "w-6 h-6",
                                location === "/notifications"
                                    ? " stroke-rose-500"
                                    : "fill-none"
                            )}
                        />
                    </div>
                </Link>
                <Link href="/contacts">
                    <div className="hover:bg-white/15  rounded-md p-2 transition">
                        <Contact
                            className={cn(
                                "w-6 h-6",
                                location === "/contacts"
                                    ? " stroke-amber-500"
                                    : "fill-none"
                            )}
                        />
                    </div>
                </Link>
            </div>
            {user ? (
                <Popover>
                    <PopoverTrigger>
                        <div
                            dangerouslySetInnerHTML={{ __html: avatar }}
                            className="h-8 w-8"></div>
                    </PopoverTrigger>
                    <PopoverContent>Logout</PopoverContent>
                </Popover>
            ) : (
                <Skeleton className="w-8 h-8 rounded-md" />
            )}
        </div>
    );
}
