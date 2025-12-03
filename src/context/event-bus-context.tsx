"use client";

import React, { createContext, useContext, useCallback, useRef } from 'react';
import type { UserEventType, UserEventPayload } from '@/lib/events';

type Handler<T> = (payload: T) => void;

// Change the structure of handlers to avoid the complex generic issue.
// Instead of a map of sets, we'll use an array of listener objects.
type Listener = {
    [K in UserEventType]: {
        event: K;
        handler: Handler<UserEventPayload[K]>;
    };
}[UserEventType];


interface EventBusContextType {
    on: <K extends UserEventType>(event: K, handler: Handler<UserEventPayload[K]>) => () => void;
    emit: <K extends UserEventType>(event: K, payload?: UserEventPayload[K]) => void;
}

const EventBusContext = createContext<EventBusContextType | undefined>(undefined);

export const EventBusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const listeners = useRef<Listener[]>([]);

    const on = useCallback(<K extends UserEventType>(event: K, handler: Handler<UserEventPayload[K]>) => {
        const newListener = { event, handler } as Listener;
        listeners.current.push(newListener);

        // Return an unsubscribe function
        return () => {
            listeners.current = listeners.current.filter(
                (listener) => listener !== newListener
            );
        };
    }, []);

    const emit = useCallback(<K extends UserEventType>(event: K, payload?: UserEventPayload[K]) => {
        listeners.current.forEach((listener) => {
            if (listener.event === event) {
                try {
                    // The type assertion is safe here because we've filtered by event type.
                    (listener.handler as Handler<UserEventPayload[K]>)(payload as UserEventPayload[K]);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            }
        });
    }, []);

    return (
        <EventBusContext.Provider value={{ on, emit }}>
            {children}
        </EventBusContext.Provider>
    );
};

export const useEventBus = () => {
    const context = useContext(EventBusContext);
    if (!context) {
        throw new Error('useEventBus must be used within an EventBusProvider');
    }
    return context;
};
