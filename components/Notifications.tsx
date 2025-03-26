'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InboxNotification, InboxNotificationList, LiveblocksUIConfig } from "@liveblocks/react-ui"
import { useInboxNotifications, useUnreadInboxNotificationsCount } from "@liveblocks/react/suspense"
import Image from "next/image"
import { ReactNode } from "react"

interface NotificationsProps {
  className?: string;
}

const Notifications = ({ className }: NotificationsProps) => {
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();

  const unreadNotifications = inboxNotifications.filter((notification) => !notification.readAt);

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg hover:bg-dark-400 transition-colors">
          <Image 
            src="/assets/icons/bell.svg"
            alt="Notifications"
            width={24}
            height={24}
            className="text-white"
          />
          {count > 0 && (
            <div className="absolute right-1.5 top-1.5 z-20 size-2.5 rounded-full bg-blue-500 ring-2 ring-dark-700" />
          )}
        </PopoverTrigger>
        
        <PopoverContent align="end" className="w-[360px] p-0 bg-dark-700 border-dark-600 shadow-lg rounded-lg">
          <LiveblocksUIConfig 
            overrides={{
              INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
                <>{user} mentioned you.</>
              )
            }}
          >
            <InboxNotificationList>
              {unreadNotifications.length <= 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No new notifications
                </div>
              ) : (
                unreadNotifications.map((notification) => (
                  <InboxNotification 
                    key={notification.id}
                    inboxNotification={notification}
                    className="hover:bg-dark-600 px-4 py-3 transition-colors"
                    href={`/documents/${notification.roomId}`}
                    showActions={false}
                    kinds={{
                      thread: (props) => (
                        <InboxNotification.Thread 
                          {...props} 
                          showActions={false}
                          showRoomName={false}
                          className="text-white"
                        />
                      ),
                      textMention: (props) => (
                        <InboxNotification.TextMention 
                          {...props} 
                          showRoomName={false}
                          className="text-white"
                        />
                      ),
                      $documentAccess: (props) => (
                        <InboxNotification.Custom 
                          {...props} 
                          title={props.inboxNotification.activities[0].data.title}
                          aside={
                            <InboxNotification.Icon className="bg-transparent">
                              <Image 
                                src={props.inboxNotification.activities[0].data.avatar as string || ''}
                                width={36}
                                height={36}
                                alt="avatar"
                                className="rounded-full"
                              />
                            </InboxNotification.Icon>
                          }
                        >
                          {props.children}
                        </InboxNotification.Custom>
                      )
                    }}
                  />
                ))
              )}
            </InboxNotificationList>
          </LiveblocksUIConfig>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Notifications