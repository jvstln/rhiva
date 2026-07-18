import { X } from "lucide-react";
import type React from "react";
import { MOCK_NOTIFICATIONS } from "@/data/notification-data";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";

type NotificationsContentProps = React.ComponentProps<typeof Popover> & {
  children?: React.ReactElement;
};

export const NotificationPopover = ({
  children,
  ...props
}: NotificationsContentProps) => {
  return (
    <Popover {...props}>
      {children && <PopoverTrigger render={children} />}
      <PopoverContent>
        <PopoverHeader className="flex-row items-center justify-between">
          <PopoverTitle>Notifications</PopoverTitle>
          {MOCK_NOTIFICATIONS.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
            >
              Clear all <X />
            </Button>
          )}
        </PopoverHeader>

        <div className="-m-(--padding) flex-1 overflow-y-auto">
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <p className="px-5 py-10 text-center text-b-3 text-gray">
              You're all caught up.
            </p>
          ) : (
            MOCK_NOTIFICATIONS.map((n) => (
              <button
                type="button"
                key={n.id}
                // onClick={() => onSelect?.(n.id)}
                className="flex w-full items-start gap-3 border-white/5 border-b px-2 py-4 text-left transition-colors last:border-none hover:bg-muted"
              >
                <Avatar>
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <h3 className="font-semibold text-b-2 text-white">
                    {n.title}
                  </h3>
                  <p className="mt-1 text-b-3 text-muted-foreground leading-snug">
                    {n.description}
                  </p>
                </div>
                {!n.read && (
                  <span className="mt-1.5 ml-auto size-2 shrink-0 rounded-full bg-primary" />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
