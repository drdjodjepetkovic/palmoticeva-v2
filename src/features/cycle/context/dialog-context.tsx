"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DialogContextType {
    isOpen: boolean;
    selectedDate: Date;
    openDialog: (date?: Date) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const openDialog = (date?: Date) => {
        if (date) {
            setSelectedDate(date);
        } else {
            setSelectedDate(new Date());
        }
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    return (
        <DialogContext.Provider value={{ isOpen, selectedDate, openDialog, closeDialog }}>
            {children}
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
}
