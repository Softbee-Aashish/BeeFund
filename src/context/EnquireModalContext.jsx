import React, { createContext, useContext, useState, useCallback } from 'react';

const EnquireModalContext = createContext();

export const EnquireModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalData, setModalData] = useState({
        loanType: '',
        amount: '',
        source: ''
    });

    const openEnquiryModal = useCallback((data = {}) => {
        setModalData({
            loanType: data.loanType || '',
            amount: data.amount || '',
            source: data.source || ''
        });
        setIsOpen(true);
    }, []);

    const closeEnquiryModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <EnquireModalContext.Provider
            value={{
                isOpen,
                modalData,
                openEnquiryModal,
                closeEnquiryModal
            }}
        >
            {children}
        </EnquireModalContext.Provider>
    );
};

export const useEnquiryModal = () => {
    const context = useContext(EnquireModalContext);
    if (!context) {
        throw new Error('useEnquiryModal must be used within an EnquireModalProvider');
    }
    return context;
};
