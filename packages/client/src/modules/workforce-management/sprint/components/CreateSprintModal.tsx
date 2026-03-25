import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

type SprintData = {
    name: string;
    goal: string;
    startDate: string;
    endDate: string;
};

type Sprint = {
    _id: string;
    name: string;
    goal: string;
    startDate: string;
    endDate: string;
};

type Props = {
    sprint?: Sprint | null;
    onClose: () => void;
    onSubmit: (data: SprintData) => void;
};

const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '500px',
        width: '90%',
        borderRadius: '12px',
        padding: '0',
        border: 'none',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
    },
};

const CreateSprintModal: React.FC<Props> = ({ sprint, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<SprintData>({
        name: '',
        goal: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        if (sprint) {
            setFormData({
                name: sprint.name || '',
                goal: sprint.goal || '',
                startDate: sprint.startDate ? new Date(sprint.startDate).toISOString().split('T')[0] : '',
                endDate: sprint.endDate ? new Date(sprint.endDate).toISOString().split('T')[0] : '',
            });
        } else {
            // Default: 2-week sprint starting today
            const today = new Date();
            const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
            setFormData({
                name: '',
                goal: '',
                startDate: today.toISOString().split('T')[0],
                endDate: twoWeeks.toISOString().split('T')[0],
            });
        }
    }, [sprint]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        if (!formData.startDate || !formData.endDate) return;
        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            style={customModalStyles}
            ariaHideApp={false}
        >
            <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {sprint ? 'Edit Sprint' : 'Create New Sprint'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Sprint 1"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Goal</label>
                        <textarea
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            placeholder="What do you want to accomplish in this sprint?"
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                        >
                            {sprint ? 'Update Sprint' : 'Create Sprint'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateSprintModal;
