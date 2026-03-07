import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Supprimer", type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-luxury-gray w-full max-w-md rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                <AlertCircle size={24} />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-luxury-black dark:text-white mb-2">{title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                            {message}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 ${type === 'danger'
                                        ? 'bg-red-500 shadow-red-500/30 hover:bg-red-600'
                                        : 'bg-primary shadow-primary/30 hover:bg-primary-dark'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
