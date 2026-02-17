import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';
import api from '../services/api';

export default function TechnicalChallengeSelector() {
        const navigate = useNavigate();
        const [selectedCategory, setSelectedCategory] = useState('');
        const [selectedDifficulty, setSelectedDifficulty] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        const categories = [
                { id: 'dsa', name: 'Data Structures & Algorithms', icon: '💻', color: 'from-primary to-accent-cyan' },
                { id: 'dbms', name: 'Database Management', icon: '🗄️', color: 'from-success to-green-400' },
                { id: 'daa', name: 'Design & Analysis', icon: '📊', color: 'from-accent-pink to-pink-400' },
        ];

        const difficulties = [
                {
                        id: 'Easy',
                        name: 'Easy',
                        color: 'success',
                        description: 'Great for beginners',
                        bgColor: 'bg-green-500/15',
                        borderColor: 'border-green-500/30',
                        textColor: 'text-green-500',
                        ringColor: 'ring-green-500'
                },
                {
                        id: 'Medium',
                        name: 'Medium',
                        color: 'warning',
                        description: 'Intermediate challenges',
                        bgColor: 'bg-yellow-500/15',
                        borderColor: 'border-yellow-500/30',
                        textColor: 'text-yellow-500',
                        ringColor: 'ring-yellow-500'
                },
                {
                        id: 'Hard',
                        name: 'Hard',
                        color: 'danger',
                        description: 'For advanced learners',
                        bgColor: 'bg-red-500/15',
                        borderColor: 'border-red-500/30',
                        textColor: 'text-red-500',
                        ringColor: 'ring-red-500'
                },
        ];

        const handleGenerate = async () => {
                if (!selectedCategory || !selectedDifficulty) {
                        setToast({ message: 'Please select both category and difficulty!', type: 'error', visible: true });
                        return;
                }

                setIsLoading(true);
                try {
                        // ✅ FIXED: Added /api prefix
                        const response = await api.post('/api/technical-challenge', {
                                category: selectedCategory,
                                difficulty: selectedDifficulty,
                        });
                        navigate('/technical-challenge', { state: { problem: response.data } });
                } catch (error) {
                        console.error('Technical challenge generation error:', error);

                        let errorMessage = 'Failed to generate challenge. Please try again.';
                        if (error.response?.data?.detail) {
                                if (typeof error.response.data.detail === 'string') {
                                        errorMessage = error.response.data.detail;
                                }
                        }

                        setToast({
                                message: errorMessage,
                                type: 'error',
                                visible: true,
                        });
                } finally {
                        setIsLoading(false);
                }
        };

        return (
                <div className="flex min-h-screen">
                        <Sidebar />

                        <main className="flex-1 ml-64 p-8">
                                <div className="max-w-4xl mx-auto">
                                        <header className="text-center mb-12 animate-fade-in">
                                                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent mb-4">
                                                        Choose Your Challenge
                                                </h1>
                                                <p className="text-xl text-text-secondary">
                                                        Select a category and difficulty to generate your technical challenge
                                                </p>
                                        </header>

                                        {/* Category Selection */}
                                        <div className="mb-12 animate-slide-up">
                                                <h2 className="text-2xl font-bold mb-6">1. Select Category</h2>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {categories.map((category) => (
                                                                <Card
                                                                        key={category.id}
                                                                        className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${selectedCategory === category.id
                                                                                        ? 'ring-2 ring-primary shadow-xl shadow-primary/30'
                                                                                        : 'hover:shadow-lg'
                                                                                }`}
                                                                        onClick={() => setSelectedCategory(category.id)}
                                                                        hasTopBorder={selectedCategory === category.id}
                                                                        borderColor={category.color}
                                                                >
                                                                        <div className="text-center">
                                                                                <div className="text-5xl mb-4">{category.icon}</div>
                                                                                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                                                                                <div
                                                                                        className={`text-xs uppercase tracking-wide font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                                                                                >
                                                                                        {category.id.toUpperCase()}
                                                                                </div>
                                                                        </div>
                                                                </Card>
                                                        ))}
                                                </div>
                                        </div>

                                        {/* Difficulty Selection */}
                                        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                                <h2 className="text-2xl font-bold mb-6">2. Select Difficulty</h2>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {difficulties.map((difficulty) => (
                                                                <Card
                                                                        key={difficulty.id}
                                                                        className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${selectedDifficulty === difficulty.id
                                                                                        ? `ring-2 ${difficulty.ringColor} shadow-xl`
                                                                                        : 'hover:shadow-lg'
                                                                                }`}
                                                                        onClick={() => setSelectedDifficulty(difficulty.id)}
                                                                >
                                                                        <div className="text-center">
                                                                                <div
                                                                                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${difficulty.bgColor} border-2 ${difficulty.borderColor} mb-4`}
                                                                                >
                                                                                        <span className={`text-2xl font-bold ${difficulty.textColor}`}>
                                                                                                {difficulty.name[0]}
                                                                                        </span>
                                                                                </div>
                                                                                <h3 className={`font-bold text-lg mb-1 ${difficulty.textColor}`}>{difficulty.name}</h3>
                                                                                <p className="text-sm text-text-secondary">{difficulty.description}</p>
                                                                        </div>
                                                                </Card>
                                                        ))}
                                                </div>
                                        </div>

                                        {/* Generate Button */}
                                        <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                                <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent-cyan/10">
                                                        <div className="mb-6">
                                                                <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
                                                                <p className="text-text-secondary">
                                                                        {selectedCategory && selectedDifficulty
                                                                                ? `Generate a ${selectedDifficulty} ${selectedCategory.toUpperCase()} challenge`
                                                                                : 'Select category and difficulty to continue'}
                                                                </p>
                                                        </div>
                                                        <Button
                                                                onClick={handleGenerate}
                                                                isLoading={isLoading}
                                                                disabled={!selectedCategory || !selectedDifficulty}
                                                                className="w-full max-w-md mx-auto text-lg py-4"
                                                        >
                                                                {isLoading ? 'Generating Challenge...' : '🚀 Generate Challenge'}
                                                        </Button>
                                                </Card>
                                        </div>
                                </div>
                        </main>

                        <Toast
                                message={toast.message}
                                type={toast.type}
                                isVisible={toast.visible}
                                onClose={() => setToast((t) => ({ ...t, visible: false }))}
                        />
                </div>
        );
}
