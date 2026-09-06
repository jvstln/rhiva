"use client";

import type React from "react";
import { Bell, BellOff, CheckCheck, Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth, useNotifications } from "@/hooks";
import {
  Popover,
  PopoverTitle,
  PopoverHeader,
  PopoverTrigger,
  PopoverContent,
} from "../ui/popover";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "../ui/empty";

type NotificationsContentProps = React.ComponentProps<typeof Popover> & {
  children?: React.ReactElement;
};

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return "";
  const time = new Date(dateStr).getTime();
  if (Number.isNaN(time)) return "";
  const diff = Math.floor((Date.now() - time) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export const NotificationPopover = ({
  children,
  ...props
}: NotificationsContentProps) => {
  const auth = useAuth();
  const { notifications, isLoading, clearAll, isClearing } = useNotifications();

  if (!auth.authenticated) return null;

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <Popover {...props}>
      {children && <PopoverTrigger render={children} />}
      <PopoverContent className="w-80 overflow-hidden p-0 sm:w-96">
        <PopoverHeader className="flex-row items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <PopoverTitle className="font-semibold text-sm">
              Notifications
            </PopoverTitle>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 font-medium text-primary text-xs">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isClearing}
              onClick={() => clearAll()}
              className="h-7 px-2 text-muted-foreground text-xs hover:text-foreground"
            >
              {isClearing ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <>
                  <CheckCheck className="mr-1 size-3.5" />
                  Mark all read
                </>
              )}
            </Button>
          )}
        </PopoverHeader>

        <div className="flex max-h-[380px] min-h-[160px] flex-col overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center py-10">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-6">
              <Empty className="border-none bg-transparent p-0">
                <EmptyHeader>
                  <EmptyMedia
                    variant="icon"
                    className="size-12 rounded-full bg-muted/50 text-muted-foreground"
                  >
                    <BellOff className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle className="font-medium text-sm">
                    No notifications
                  </EmptyTitle>
                  <EmptyDescription className="text-muted-foreground text-xs">
                    You're all caught up. New updates will show up here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex w-full items-start gap-3 border-border/40 border-b px-4 py-3 text-left transition-colors last:border-none hover:bg-muted/50"
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    <Bell className="size-3.5" />
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-semibold text-foreground text-xs">
                      {n.title}
                    </h3>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  {n.subtitle && (
                    <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-snug">
                      {n.subtitle}
                    </p>
                  )}
                </div>
                {!n.readAt && (
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
